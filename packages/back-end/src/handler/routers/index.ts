import express from "express";
import lockceptRouter from "./lockcept";
import userRouter from "./user";

const router = express.Router();

router.use("/lockcept-debug", lockceptRouter);
router.use("/user", userRouter);

export default router;
