import { SignupLocalRequest } from "@lockcept/shared";
import express from "express";
import User from "../../dynamodb/user";
import { errorLogger } from "../../logger";

const signupRouter = express.Router();

signupRouter.post("/local", async (req, res) => {
  const { userData } = req.body as SignupLocalRequest;
  try {
    const { email, password, userName } = userData;
    await User.create({ email, password, userName });
    res.sendStatus(200);
  } catch (e) {
    errorLogger("Failed to signup", userData);
    errorLogger(e);
    res.sendStatus(409);
  }
});

signupRouter.post("/google", (req, res) => {
  res.json({
    message: "signupGoogle",
  });
});

export default signupRouter;
