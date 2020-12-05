import { AccountData, validateAccountData } from "@lockcept/shared";
import { isNil, pick } from "lodash";
import { config } from "../config";
import { errorLogger } from "../logger";
import dynamodb, { generateUpdateParams } from "./dynamodb";
import User from "./user";

const accountTable = config.table.account;

class Account {
  data: AccountData;

  constructor(data: AccountData) {
    this.data = data;
  }

  static create = async (data: AccountData): Promise<Account | null> => {
    const { userId, site, comment } = data;

    const user = await User.get(userId);
    if (!user) {
      errorLogger("User not found at create account", { userId });
      return null;
    }
    const accountData: { [id: string]: any } = { userId };

    // check data validation
    if (!isNil(site)) {
      if (validateAccountData({ site })) accountData.site = site;
    }
    if (!isNil(comment)) {
      if (validateAccountData({ comment })) accountData.comment = comment;
    }

    // add new account
    try {
      await dynamodb
        .put({
          TableName: accountTable,
          Item: accountData,
          ConditionExpression: "attribute_not_exists(id)",
        })
        .promise();
    } catch (e) {
      if (e.code === "ConditionalCheckFailedException") {
        errorLogger("Account already exist at create account", data);
        throw Error();
      }
      throw e;
    }
    const newAccountData = data as AccountData;
    return new Account(newAccountData);
  };

  static get = async (userId: string): Promise<Account | null> => {
    try {
      const { Item: accountData } = await dynamodb
        .get({ TableName: accountTable, Key: { userId } })
        .promise();
      if (isNil(accountData)) return null;
      return new Account(accountData as AccountData);
    } catch (e) {
      errorLogger("Failed at get Account", { userId });
      throw e;
    }
  };

  update = async (data: Partial<AccountData>): Promise<Account> => {
    const updateData = pick(data, "site", "comment");
    try {
      const { Attributes: updatedData } = await dynamodb
        .update({
          TableName: accountTable,
          Key: {
            userId: this.data.userId,
          },
          ...generateUpdateParams(updateData),
        })
        .promise();
      if (isNil(updatedData)) {
        errorLogger("updatedData is nil in update account", data);
        throw Error();
      }
      const updatedAccountData = updatedData as AccountData;
      return new Account(updatedAccountData);
    } catch (e) {
      errorLogger("Failed to update account", e);
      throw e;
    }
  };
}

export default Account;
