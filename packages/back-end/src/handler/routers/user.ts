import express from "express";
import { signinRouter } from "./signin";
import { signupRouter } from "./signup";

const router = express.Router();

router.use("/", signupRouter);
router.use("/", signinRouter);

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
