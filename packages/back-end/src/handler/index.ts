import { createServer, proxy } from "aws-serverless-express";
import { APIGatewayProxyHandler } from "aws-lambda";
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "hello lockcept world!",
  });
});

const server = createServer(app);

export const handler: APIGatewayProxyHandler = (event, context) => {
  proxy(server, event, context);
};
