import {
  ErrorName,
  UserData,
  validateEmail,
  validatePassword,
  validateUserName,
} from "@lockcept/shared";
import { isEmpty, isNil } from "lodash";
import { nanoid } from "nanoid";
import { config } from "../config";
import { hash, CustomError } from "../helpers";

import { errorLogger } from "../logger";
import dynamodb, {
  generateKeyConditionParams,
  generateUpdateParams,
  queryAll,
} from "./dynamodb";

const userTable = config.table.user;
const uniqueEmailTable = config.table.uniqueEmail;
const uniqueUserNameTable = config.table.uniqueUserName;

/**
 * User model
 */
class User {
  data: UserData;

  constructor(data: UserData) {
    this.data = data;
  }

  /**
   * Creates a new user
   * @param data UserData to create a new user
   */
  static create = async (data: Omit<UserData, "id">): Promise<void> => {
    const id = nanoid();
    const { email: rawEmail, password, userName: rawUserName } = data;
    const email = rawEmail.toLowerCase();
    const userName = rawUserName.toLowerCase();

    // check data validation
    if (!validateEmail(email)) {
      errorLogger("Invalid Email at createUserItem", { email });
      throw new CustomError("Invalid Email", {
        name: ErrorName.InvalidEmail,
        statusCode: 400,
      });
    }
    if (!validatePassword(password)) {
      errorLogger("Invalid Password at createUserItem", { password });
      throw new CustomError("Invalid Password", {
        name: ErrorName.InvalidPassword,
        statusCode: 400,
      });
    }
    if (!validateUserName(userName)) {
      errorLogger("Invalid UserName at createUserItem", { userName });
      throw new CustomError("Invalid UserName", {
        name: ErrorName.InvalidUserName,
        statusCode: 400,
      });
    }

    const hashPassword = await hash(password);
    const userData = { ...data, id, password: hashPassword };

    // check unique validation
    try {
      const emailData = {
        email,
        id,
      };
      const userNameData = {
        userName,
        id,
      };
      const paramsEmail = {
        TableName: uniqueEmailTable,
        Item: emailData,
        ConditionExpression: "attribute_not_exists(email)",
      };
      const paramsUserName = {
        TableName: uniqueUserNameTable,
        Item: userNameData,
        ConditionExpression: "attribute_not_exists(userName)",
      };
      await dynamodb
        .transactWrite({
          TransactItems: [
            {
              Put: paramsEmail,
            },
            {
              Put: paramsUserName,
            },
          ],
        })
        .promise();
    } catch (e) {
      if (e.name === "TransactionCanceledException") {
        errorLogger("Failed to add unique data at createUserItem", userData);
        errorLogger(e);

        if (await User.ifEmailExists(email))
          throw new CustomError("conflict user data: email", {
            name: ErrorName.ExistingEmail,
            statusCode: 409,
          });
        if (await User.ifUserNameExists(userName))
          throw new CustomError("conflict user data: userName", {
            name: ErrorName.ExistingUserName,
            statusCode: 409,
          });
      }
      throw e;
    }

    // add a new user
    try {
      await dynamodb
        .put({
          TableName: userTable,
          Item: userData,
          ConditionExpression: "attribute_not_exists(id)",
        })
        .promise();
    } catch (e) {
      if (e.code === "ConditionalCheckFailedException") {
        errorLogger("UserId already exist at createUserItem", userData);
        throw new CustomError("", { statusCode: 500 });
      }
      throw e;
    }
  };

  /**
   * Returns an account with userId
   * @param userId userId to get an account
   */
  static get = async (id: string): Promise<User | null> => {
    try {
      const { Item: userData } = await dynamodb
        .get({ TableName: userTable, Key: { id } })
        .promise();
      if (isNil(userData)) return null;
      return new User(userData as UserData);
    } catch (e) {
      errorLogger("Failed at get User", { id });
      throw e;
    }
  };

  /**
   * Updates email with uniqueness checking
   * @param email email to update
   */
  setEmail = async (rawEmail: string): Promise<void> => {
    const { id } = this.data;
    const email = rawEmail.toLowerCase();

    const getPrevEmail = async (): Promise<string | null> => {
      try {
        const emailPrevItems = await queryAll({
          TableName: uniqueEmailTable,
          IndexName: "IdIndex",
          ProjectionExpression: "email",
          ...generateKeyConditionParams({ id }),
        });

        if (isEmpty(emailPrevItems)) throw Error();
        const prevEmail = emailPrevItems[0].email as string;
        if (!prevEmail) throw Error();

        return prevEmail;
      } catch (e) {
        errorLogger("Failed to get prev email at setEmail", { id, email });
        throw e;
      }
    };

    const prevEmail = await getPrevEmail();
    if (!prevEmail) {
      throw Error();
    }

    if (!validateEmail(email)) {
      errorLogger("Invalid email at setEmail", { email });
      return;
    }

    // register new email
    const emailItem = { id, email };

    try {
      const paramsPutEmail = {
        TableName: uniqueEmailTable,
        Item: emailItem,
        ConditionExpression: "attribute_not_exists(id)",
      };
      const paramsUpdateUser = {
        TableName: userTable,
        Key: {
          id,
        },
        ...generateUpdateParams({ email }),
      };
      await dynamodb
        .transactWrite({
          TransactItems: [
            {
              Put: paramsPutEmail,
            },
            {
              Update: paramsUpdateUser,
            },
          ],
        })
        .promise();
    } catch (e) {
      errorLogger("Failed to register new email at setEmail", emailItem);
      throw e;
    }

    // delete prev email
    try {
      await dynamodb
        .delete({
          TableName: uniqueEmailTable,
          Key: {
            email: prevEmail,
          },
        })
        .promise();
    } catch (e) {
      errorLogger("Failed to delete prev email at setEmail", { id });
      throw e;
    }
  };

  /**
   * Updates userName with uniqueness checking
   * @param userName userName to update
   */
  setUserName = async (rawUserName: string): Promise<void> => {
    const { id } = this.data;
    const userName = rawUserName.toLowerCase();

    const getPrevUserName = async (): Promise<string | null> => {
      try {
        const userNamePrevItems = await queryAll({
          TableName: uniqueUserNameTable,
          IndexName: "IdIndex",
          ProjectionExpression: "userName",
          ...generateKeyConditionParams({ id }),
        });

        if (!userNamePrevItems) throw Error();
        const prevUserName = userNamePrevItems[0].userName as string;
        if (!prevUserName) throw Error();

        return prevUserName;
      } catch (e) {
        errorLogger("Failed to get Prev UserName at setUserName", {
          id,
          userName,
        });
        throw e;
      }
    };

    const prevUserName = await getPrevUserName();
    if (!prevUserName) {
      throw Error();
    }

    if (!validateUserName(userName)) {
      errorLogger("Invalid userName at setUserName", { userName });
      throw Error();
    }

    // register new userName
    const userNameItem = { id, userName };

    try {
      const paramsPutUserName = {
        TableName: uniqueUserNameTable,
        Item: userNameItem,
        ConditionExpression: "attribute_not_exists(id)",
      };
      const paramsUpdateUser = {
        TableName: userTable,
        Key: {
          id,
        },
        ...generateUpdateParams({ userName }),
      };
      await dynamodb
        .transactWrite({
          TransactItems: [
            {
              Put: paramsPutUserName,
            },
            {
              Update: paramsUpdateUser,
            },
          ],
        })
        .promise();
    } catch (e) {
      errorLogger(
        "Failed to register new userName at setUserName",
        userNameItem
      );
      throw e;
    }

    // delete prev userName
    try {
      await dynamodb
        .delete({
          TableName: uniqueUserNameTable,
          Key: {
            userName: prevUserName,
          },
        })
        .promise();
    } catch (e) {
      errorLogger("Failed to delete prev userName at setUserName", { id });
      throw e;
    }
  };

  /**
   * Updates password
   * @param password password to update
   */
  setPassword = async (password: string): Promise<void> => {
    const { id } = this.data;
    const hashPassword = await hash(password);

    try {
      await dynamodb
        .update({
          TableName: userTable,
          Key: {
            id,
          },
          ConditionExpression: "attribute_exists(id)",
          ...generateUpdateParams({ password: hashPassword }),
        })
        .promise();
    } catch (e) {
      if (e.code === "ConditionalCheckFailedException") {
        errorLogger("User id does not exist at setPassword", { id });
        throw Error();
      }
      throw e;
    }
  };

  /**
   * Returns existance of email
   * @param rawEmail
   */
  static ifEmailExists = async (rawEmail: string): Promise<boolean> => {
    const email = rawEmail.toLowerCase();
    try {
      const { Item: user } = await dynamodb
        .get({
          TableName: uniqueEmailTable,
          Key: { email },
        })
        .promise();
      if (user) return true;
      return false;
    } catch (e) {
      errorLogger("Failed to check email existance", { email });
      throw e;
    }
  };

  /**
   * Returns existance of userName
   * @param rawUserName
   */
  static ifUserNameExists = async (rawUserName: string): Promise<boolean> => {
    const userName = rawUserName.toLowerCase();
    try {
      const { Item: user } = await dynamodb
        .get({
          TableName: uniqueUserNameTable,
          Key: { userName },
        })
        .promise();
      if (user) return true;
      return false;
    } catch (e) {
      errorLogger("Failed to check userName existance", { userName });
      throw e;
    }
  };

  /**
   * Returns an user with email
   * @param email email to find user with
   */
  static findOneByEmail = async (rawEmail: string): Promise<User | null> => {
    const email = rawEmail.toLowerCase();
    try {
      const userItems = await queryAll({
        TableName: userTable,
        IndexName: "EmailIndex",
        ...generateKeyConditionParams({ email }),
      });

      if (isEmpty(userItems)) return null;
      const userData = userItems[0] as UserData;
      if (!userData) throw Error();
      return new User(userData);
    } catch (e) {
      errorLogger("Failed at findOneByEmail", { email });
      throw e;
    }
  };
}

export default User;
