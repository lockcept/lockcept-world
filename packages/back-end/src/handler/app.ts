import express from "express";
import cors from "cors";
import awsServerlessExpressMiddleware from "aws-serverless-express/middleware";

const app = express();
app.use(cors());
app.use(awsServerlessExpressMiddleware.eventContext());

app.get("/", (req, res) => {
  res.json({
    message: "hello lockcept world",
  });
});

export default app;
