import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());

app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "hello lockcept world",
  });
});

app.get("/lockcept", (req, res) => {
  res.json({
    message: "hello lockcept world!",
  });
});

export default app;
