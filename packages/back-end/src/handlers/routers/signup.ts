import { SignupLocalRequest } from "@lockcept/shared";
import express from "express";
import { errorLogger } from "../../logger";
import Account from "../../models/account";
import User from "../../models/user";

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
    const user = await User.create({ email, password, userName });
    await Account.create({ userId: user.id });
    res.sendStatus(200);
  } catch (e) {
    errorLogger("Failed to signup", userData);
    errorLogger(e);
    if (e.options?.name) {
      const statusCode = e.options?.statusCode ?? 500;
      res.status(statusCode).json(e);
      return;
    }
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
