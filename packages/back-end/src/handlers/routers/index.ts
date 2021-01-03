import express from "express";
import authRouter from "./auth";
import userRouter from "./user";
import accountRouter from "./account";

const router = express.Router();

/**
 * routers
 */
router.use("/", authRouter);
router.use("/user", userRouter);
router.use("/account", accountRouter);
// router.use("/lockcept-debug", jwtUserAuth, lockceptRouter);

export default router;
