import { DynamoDB } from "aws-sdk";
import { map } from "lodash";
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

export const scanAll = async (
  params: DynamoDB.DocumentClient.ScanInput,
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
  } = await dynamodb.scan(actualParams).promise();
  if (!lastEvaluatedKey) return items;
  const nextItems = await scanAll(params, lastEvaluatedKey);
  return [...items, ...nextItems];
};

const generateExpressionAttribute = (
  attributeMap: AttributeMap
): {
  ExpressionAttributeNames: DynamoDB.DocumentClient.ExpressionAttributeNameMap;
  ExpressionAttributeValues: DynamoDB.DocumentClient.ExpressionAttributeValueMap;
  variables: { [name: string]: string };
} => {
  const getKeyForIndex = (index: number): string => {
    const share = Math.floor(index / 26);
    const remainder = index % 26;
    const char = String.fromCharCode(97 + remainder);
    if (share === 0) return char;
    return `${getKeyForIndex(share - 1)}${char}`;
  };
  const entries = Object.entries(attributeMap);

  const names: DynamoDB.DocumentClient.ExpressionAttributeNameMap = {};
  const values: DynamoDB.DocumentClient.ExpressionAttributeValueMap = {};
  const variables: { [name: string]: string } = {};

  entries.forEach(([name, value], i) => {
    const key = getKeyForIndex(i);
    const nameVar = `#${key}`;
    names[nameVar] = name;
    const valueVar = `:${key}`;
    values[valueVar] = value;
    variables[nameVar] = valueVar;
  });

  return {
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    variables,
  };
};

export const generateKeyConditionParams = (
  equalMap: AttributeMap
): {
  ExpressionAttributeNames: DynamoDB.DocumentClient.ExpressionAttributeNameMap;
  ExpressionAttributeValues: DynamoDB.DocumentClient.ExpressionAttributeValueMap;
  KeyConditionExpression: string;
} => {
  const {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    variables,
  } = generateExpressionAttribute(equalMap);
  return {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    KeyConditionExpression: map(variables, (val, name) => {
      return `${name} = ${val}`;
    }).join(" AND "),
  };
};

export const generateUpdateParams = (
  setMap: AttributeMap
): {
  ExpressionAttributeNames: DynamoDB.DocumentClient.ExpressionAttributeNameMap;
  ExpressionAttributeValues: DynamoDB.DocumentClient.ExpressionAttributeValueMap;
  UpdateExpression: string;
} => {
  const {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    variables,
  } = generateExpressionAttribute(setMap);
  return {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    UpdateExpression: `SET ${map(
      variables,
      (val, name) => `${name} = ${val}`
    ).join(", ")}`,
  };
};

export default dynamodb;
