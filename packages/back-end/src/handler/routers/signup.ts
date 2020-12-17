import { SignupLocalRequest } from "@lockcept/shared";
import express from "express";
import User from "../../dynamodb/user";
import { errorLogger } from "../../logger";

/**
 * router for signup
 */
const signupRouter = express.Router();

/**
 * signup local
 */
signupRouter.post("/local", async (req, res) => {
  const { userData } = req.body as SignupLocalRequest;
  try {
    const { email, password, userName } = userData;
    await User.create({ email, password, userName });
    res.sendStatus(200);
  } catch (e) {
    errorLogger("Failed to signup", userData);
    errorLogger(e);
    if (e.options?.statusCode) res.sendStatus(e.options.statusCode);
    else res.sendStatus(500);
  }
});

/**
 * signup google (WIP)
 */
signupRouter.post("/google", (req, res) => {
  res.json({
    message: "signupGoogle",
  });
});

export default signupRouter;
