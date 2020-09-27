import { APIGatewayProxyHandler } from "aws-lambda";

const middleware = (
  handler: APIGatewayProxyHandler
): APIGatewayProxyHandler => {
  return async (event, context, callback) => {
    const res = await handler(event, context, callback);
    if (!res) {
      return {
        statusCode: 500,
        body: "",
      };
    }
    return {
      statusCode: res.statusCode,
      body: res.body,
      headers: {
        ...res.headers,
        // "Access-Control-Allow-Origin": "https://lockcept.kr",
        "Access-Control-Allow-Origin": "*",
      },
    };
  };
};

export default middleware;
