import { v4 as uuid } from "uuid";
import { APIGatewayProxyHandler } from "aws-lambda";
import { config } from "../config";
import dynamodb from "../dynamodb/dynamodb";

export const post: APIGatewayProxyHandler = (event, context, callback) => {
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

  dynamodb.put(params, (error) => {
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
  dynamodb.scan(params, (error, result) => {
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
