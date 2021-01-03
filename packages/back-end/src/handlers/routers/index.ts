import express from "express";
import authRouter, { jwtUserAuth } from "./auth";
import userRouter from "./user";
import accountRouter from "./account";

const router = express.Router();

/**
 * routers
 */
router.use("/", authRouter);
// router.use("/lockcept-debug", jwtUserAuth, lockceptRouter);
router.use("/user", jwtUserAuth, userRouter);
router.use("/account", jwtUserAuth, accountRouter);

export default router;
