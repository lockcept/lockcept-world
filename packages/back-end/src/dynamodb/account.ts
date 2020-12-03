import { AccountData, validateAccountData } from "@lockcept/shared";
import { isNil } from "lodash";
import { config } from "../config";
import { errorLogger } from "../logger";
import dynamodb from "./dynamodb";
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
        errorLogger("Account already exist at serItem", data);
        throw Error();
      }
      throw e;
    }
    return new Account(data);
  };
}

export default Account;
