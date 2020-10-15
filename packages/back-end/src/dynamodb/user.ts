import { UserData } from "@lockcept/shared";
import { config } from "../config";
import dynamodb from "./dynamodb";

const userTable = config.table.user;

class User {
  data: UserData;

  constructor(data: UserData) {
    this.data = data;
  }

  static checkUserItem = async (userId: string) => {
    const params = {
      TableName: userTable,
      Key: {
        id: userId,
      },
    };

    const dynamodbOutput = await dynamodb.get(params).promise();
    if (dynamodbOutput.Item) return true;

    return false;
  };

  static createUserItem = async (user: UserData) => {
    const params = {
      TableName: userTable,
      Item: user,
      ConditionExpression: "attribute_not_exists(id)",
    };
    // eslint-disable-next-line no-console
    console.log(params);

    await dynamodb.put(params).promise();
    return true;
  };

  static getUserItem = async (userId: string) => {
    const params = {
      TableName: userTable,
      Key: {
        id: userId,
      },
    };

    try {
      const dynamodbOutput = await dynamodb.get(params).promise();
      if (dynamodbOutput.Item) {
        return new User(dynamodbOutput.Item as UserData);
      }
      return null;
    } catch (e) {
      throw Error("Failed to get user");
    }
  };
}

export default User;
