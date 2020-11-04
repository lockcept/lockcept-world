import express from "express";
import cors from "cors";
import routers from "./routers";

const app = express();
app.use(cors());

app.use(express.json());

app.use("/", routers);

app.get("/", (req, res) => {
  res.json({
    message: "hello lockcept world app",
  });
});

export default app;
