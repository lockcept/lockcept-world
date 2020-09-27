import { DynamoDB } from "aws-sdk";
import { config } from "../config";

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

export default dynamodb;
