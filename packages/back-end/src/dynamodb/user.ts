import {
  UserData,
  validateEmail,
  validatePassword,
  validateUserName,
} from "@lockcept/shared";
import { isEmpty } from "lodash";
import { nanoid } from "nanoid";
import { config } from "../config";
import { hash } from "../helper";
import { errorLogger } from "../logger";
import dynamodb, { queryAll } from "./dynamodb";

const userTable = config.table.user;
const uniqueEmailTable = config.table.uniqueEmail;
const uniqueUserNameTable = config.table.uniqueUserName;

class User {
  data: UserData;

  constructor(data: UserData) {
    this.data = data;
  }

  static create = async (data: Omit<UserData, "id">): Promise<void> => {
    const id = nanoid();
    const { email, password, userName } = data;

    // check data validation

    if (!validateEmail(email)) {
      errorLogger("Invalid Email at createUserItem", { email });
      throw Error();
    }
    if (!validatePassword(password)) {
      errorLogger("Invalid Password at createUserItem", { password });
      throw Error();
    }
    if (!validateUserName(userName)) {
      errorLogger("Invalid UserName at createUserItem", { userName });
      throw Error();
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
      errorLogger("Failed to add unique data at createUserItem", userData);
      throw e;
    }

    // add new user
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
        errorLogger("User already exist at createUserItem", userData);
        throw Error();
      }
      throw e;
    }
  };

  static get = async (id: string): Promise<User | null> => {
    try {
      const { Item: user } = await dynamodb
        .get({ TableName: userTable, Key: { id } })
        .promise();
      if (!user) return null;
      return user as User;
    } catch (e) {
      errorLogger("Failed at get User", { id });
      throw e;
    }
  };

  static findOneByEmail = async (email: string): Promise<User | null> => {
    try {
      const userItems = await queryAll({
        TableName: userTable,
        IndexName: "EmailIndex",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
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

  setEmail = async (email: string): Promise<void> => {
    const { id } = this.data;

    const getPrevEmail = async (): Promise<string | null> => {
      try {
        const emailPrevItems = await queryAll({
          TableName: uniqueEmailTable,
          IndexName: "IdIndex",
          ProjectionExpression: "email",
          FilterExpression: "id = :id",
          ExpressionAttributeValues: {
            ":id": id,
          },
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
        UpdateExpression: "set #a = :x",
        ExpressionAttributeNames: { "#a": "email" },
        ExpressionAttributeValues: { ":x": email },
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

  setUserName = async (userName: string): Promise<void> => {
    const { id } = this.data;

    const getPrevUserName = async (): Promise<string | null> => {
      try {
        const userNamePrevItems = await queryAll({
          TableName: uniqueUserNameTable,
          IndexName: "IdIndex",
          ProjectionExpression: "userName",
          FilterExpression: "id = :id",
          ExpressionAttributeValues: {
            ":id": id,
          },
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
        UpdateExpression: "set #a = :x",
        ExpressionAttributeNames: { "#a": "userName" },
        ExpressionAttributeValues: { ":x": userName },
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

  setPassword = async (password: string): Promise<void> => {
    const { id } = this.data;

    // register new userName
    try {
      await dynamodb
        .update({
          TableName: userTable,
          Key: {
            id,
          },
          UpdateExpression: "set #a = :x",
          ExpressionAttributeNames: { "#a": "password" },
          ExpressionAttributeValues: { ":x": password },
          ConditionExpression: "attribute_exists(id)",
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
}

export default User;
