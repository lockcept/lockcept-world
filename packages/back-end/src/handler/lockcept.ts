import { v4 as uuid } from "uuid";
import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { config } from "../config";

const dynamoDb = new DynamoDB.DocumentClient();

export const post: APIGatewayProxyHandler = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const requestParams = event.pathParameters ?? {};
  const { email } = requestParams;

  const params = {
    TableName: config.table.lockcept,
    Item: {
      id: uuid(),
      email,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't create the item.",
      });
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};

export const get: APIGatewayProxyHandler = (event, context, callback) => {
  const params = {
    TableName: config.table.lockcept,
  };
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the todos.",
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
