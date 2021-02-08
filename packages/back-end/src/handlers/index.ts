import serverless from "serverless-http";
import { config } from "../config";
import app from "./app";

const { stage } = config.app;

export const handler = serverless(app, {
  basePath: `/${stage}`,
});
