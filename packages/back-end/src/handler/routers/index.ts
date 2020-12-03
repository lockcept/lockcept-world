import express from "express";
import authRouter from "./auth";
import lockceptRouter from "./lockcept";
import userRouter from "./user";

const router = express.Router();

router.use("/", authRouter);
router.use("/user", userRouter);
router.use("/lockcept-debug", lockceptRouter);

export default router;
