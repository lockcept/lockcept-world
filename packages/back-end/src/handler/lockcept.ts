import { v4 as uuid } from "uuid";
import { APIGatewayProxyHandler } from "aws-lambda";
import { config } from "../config";
import dynamodb from "../dynamodb/dynamodb";
import middleware from "./middleware";

export const post: APIGatewayProxyHandler = middleware(
  async (event, _context, _callback) => {
    const timestamp = new Date().getTime();
    const requestParams = event.pathParameters ?? {};
    const { email } = requestParams;

    // eslint-disable-next-line no-console
    console.log(email, config.table.lockcept);

    const params = {
      TableName: config.table.lockcept,
      Item: {
        id: uuid(),
        email,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };
    try {
      const dynamodbOutput = await dynamodb.put(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify(dynamodbOutput),
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't create the item.",
      };
    }
  }
);

export const get: APIGatewayProxyHandler = middleware(
  async (_event, _context, _callback) => {
    const params = {
      TableName: config.table.lockcept,
    };
    try {
      const dynamodbOutput = await dynamodb.scan(params).promise();
      return {
        statusCode: 200,
        body: JSON.stringify(dynamodbOutput),
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the todos.",
      };
    }
  }
);
