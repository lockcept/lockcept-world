import { CreateUserRequest } from "@lockcept/shared";
import express from "express";
import User from "../../dynamodb/user";
import { hash } from "../../helper";
import { errorLogger } from "../../logger";

const signupRouter = express.Router();

signupRouter.post("/signup/local", async (req, res) => {
  const { userData } = req.body as CreateUserRequest;
  try {
    const { email, password, userName } = userData;
    const hashedPassword = await hash(password);
    await User.create({ email, password: hashedPassword, userName });
    res.sendStatus(200);
  } catch (e) {
    errorLogger("Failed to signup", userData);
    errorLogger(e);
    res.sendStatus(409);
  }
});

signupRouter.post("/signup/google", (req, res) => {
  res.json({
    message: "signupGoogle",
  });
});

export default signupRouter;
