import { APIGatewayProxyHandler } from "aws-lambda";
import {
  CheckUserResponse,
  CreateUserRequest,
  CreateUserResponse,
} from "@lockcept/shared";
import User from "../dynamodb/user";
import middleware from "./middleware";

export const create: APIGatewayProxyHandler = middleware(
  async (event, _context, _callback) => {
    const reqBody: CreateUserRequest = event.body ? JSON.parse(event.body) : {};
    const data = reqBody.userData;

    const ifCreated = await User.createUserItem(data);
    if (ifCreated) {
      const resBody: CreateUserResponse = { ifCreated };
      return {
        statusCode: 200,
        body: JSON.stringify(resBody),
      };
    }

    const resBody: CreateUserResponse = { ifCreated };
    return {
      statusCode: 500,
      body: JSON.stringify(resBody),
    };
  }
);

export const check: APIGatewayProxyHandler = middleware(
  async (event, _context, _callback) => {
    const requestParams = event.pathParameters ?? {};
    const { userId } = requestParams;
    const ifExist = await User.checkUserItem(userId);
    const resBody: CheckUserResponse = { ifExist };
    return { statusCode: 200, body: JSON.stringify(resBody) };
  }
);

export const signin: APIGatewayProxyHandler = middleware(
  async (_event, _context, _callback) => {
    return { statusCode: 500, body: "not implemented yet" };
  }
);

export const updateEmail: APIGatewayProxyHandler = middleware(
  async (_event, _context, _callback) => {
    return { statusCode: 500, body: "not implemented yet" };
  }
);
