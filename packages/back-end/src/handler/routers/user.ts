import { CreateUserRequest } from "@lockcept/shared";
import express from "express";
import passport from "passport";
import User from "../../dynamodb/user";
import { errorLogger } from "../../logger";

const router = express.Router();

router.use(passport.initialize());

router.post("/auth/signup", (req, res) => {
  const { userData } = req.body as CreateUserRequest;
  const { email, password, userName } = userData;

  try {
    User.createUserItem({ email, password, userName });
  } catch (e) {
    errorLogger(e);
  }

  res.json({
    message: "signup",
  });
});

router.post("/auth/signup/google", (req, res) => {
  res.json({
    message: "signupGoogle",
  });
});

router.post("/auth/signin", (req, res) => {
  res.json({
    message: "signin",
  });
});

router.post("/auth/signin/google", (req, res) => {
  res.json({
    message: "signinGoogle",
  });
});

router.post("/set-email", (req, res) => {
  res.json({
    message: "setEmail",
  });
});

router.post("/set-password", (req, res) => {
  res.json({
    message: "setPassword",
  });
});

router.post("/set-userName", (req, res) => {
  res.json({
    message: "setUserName",
  });
});

export default router;
