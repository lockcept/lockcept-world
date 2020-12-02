import { DynamoDB } from "aws-sdk";
import { config } from "../config";

type AttributeMap = DynamoDB.DocumentClient.AttributeMap;

const options =
  config.app.stage === "dev"
    ? {
        region: "localhost",
        endpoint: "http://localhost:8000",
      }
    : {};

const dynamodb = new DynamoDB.DocumentClient({
  ...options,
});

export const queryAll = async (
  params: DynamoDB.DocumentClient.QueryInput,
  prevLastKey?: DynamoDB.DocumentClient.Key
): Promise<AttributeMap[]> => {
  const actualParams = prevLastKey
    ? {
        ...params,
        ExclusiveStartKey: prevLastKey,
      }
    : params;
  const {
    Items: items = [],
    LastEvaluatedKey: lastEvaluatedKey,
  } = await dynamodb.query(actualParams).promise();
  if (!lastEvaluatedKey) return items;
  const nextItems = await queryAll(params, lastEvaluatedKey);
  return [...items, ...nextItems];
};

export default dynamodb;
