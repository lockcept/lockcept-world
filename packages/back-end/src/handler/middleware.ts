import { APIGatewayProxyHandler } from "aws-lambda";
import { errorLogger } from "../logger";

const corsHeaders = {
  // "Access-Control-Allow-Origin": "https://lockcept.kr",
  "Access-Control-Allow-Origin": "*",
};

const middleware = (
  handler: APIGatewayProxyHandler
): APIGatewayProxyHandler => {
  return async (event, context, callback) => {
    try {
      const res = await handler(event, context, callback);

      if (!res) {
        return {
          statusCode: 500,
          body: "api server internal error",
          headers: {
            ...corsHeaders,
          },
        };
      }
      return {
        statusCode: res.statusCode,
        body: res.body,
        headers: {
          ...res.headers,
          ...corsHeaders,
        },
      };
    } catch (e) {
      errorLogger(e);
      return {
        statusCode: 500,
        body: e.message,
        headers: {
          ...corsHeaders,
        },
      };
    }
  };
};

export default middleware;
