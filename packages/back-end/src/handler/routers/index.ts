import express from "express";
import authRouter from "./auth";
import lockceptRouter from "./lockcept";
import userRouter from "./user";
import accountRouter from "./account";

const router = express.Router();

router.use("/lockcept-debug", lockceptRouter);
router.use("/", authRouter);
router.use("/user", userRouter);
router.use("/account", accountRouter);

export default router;
