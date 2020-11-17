import { UserData } from "@lockcept/shared";
import { map } from "lodash";
import { nanoid } from "nanoid";
import validator from "validator";
import { config } from "../config";
import { errorLogger } from "../logger";
import dynamodb from "./dynamodb";

const userTable = config.table.user;
const uniqueEmailTable = config.table.uniqueEmail;
const uniqueUserNameTable = config.table.uniqueUserName;

class User {
  data: UserData;

  constructor(data: UserData) {
    this.data = data;
  }

  static getItems = async () => {
    const { Items: userItems } = await dynamodb
      .scan({
        TableName: userTable,
      })
      .promise();
    return map(userItems, (user) => {
      return new User(user as UserData);
    });
  };

  static getUniqueEmailItems = async () => {
    const { Items: uniqueEmailItems } = await dynamodb
      .scan({
        TableName: uniqueEmailTable,
      })
      .promise();
    return map(uniqueEmailItems, (uniqueEmail) => {
      return JSON.stringify(uniqueEmail);
    });
  };

  static createUserItem = async (data: Omit<UserData, "id">) => {
    const id = nanoid();
    const { email, password, userName } = data;

    // check data validation
    if (!email || !password || !userName) {
      errorLogger("Invalid Data at createUserItem", data);
      throw Error();
    }
    if (!validator.isEmail(email)) {
      errorLogger("Invalid Email at createUserItem", { email });
      throw Error();
    }
    if (!validator.isAlphanumeric(userName)) {
      errorLogger("Invalid UserName at createUserItem", { userName });
      throw Error();
    }

    const userData = { ...data, id };

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
      errorLogger(e);
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

  static setEmail = async (id: string, email: string) => {
    const getPrevEmail = async (): Promise<string | null> => {
      try {
        const { Items: emailPrevItem } = await dynamodb
          .scan({
            TableName: uniqueEmailTable,
            IndexName: "IdIndex",
            AttributesToGet: ["email"],
            ScanFilter: {
              id: {
                ComparisonOperator: "EQ",
                AttributeValueList: [id],
              },
            },
          })
          .promise();

        if (!emailPrevItem) throw Error();
        // eslint-disable-next-line no-console
        console.log(emailPrevItem);
        const prevEmail = emailPrevItem[0].email;
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

    if (!validator.isEmail(email)) {
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

  static setUserName = async (id: string, userName: string) => {
    const getPrevUserName = async (): Promise<string | null> => {
      try {
        const { Items: userNamePrevItem } = await dynamodb
          .scan({
            TableName: uniqueUserNameTable,
            IndexName: "IdIndex",
            AttributesToGet: ["userName"],
            ScanFilter: {
              id: {
                ComparisonOperator: "EQ",
                AttributeValueList: [id],
              },
            },
          })
          .promise();

        if (!userNamePrevItem) throw Error();
        const prevUserName = userNamePrevItem[0].userName;
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

    if (!validator.isAlphanumeric(userName)) {
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

  static setPassword = async (id: string, password: string) => {
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
