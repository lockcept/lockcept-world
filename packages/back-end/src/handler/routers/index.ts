import express from "express";
import lockceptRouter from "./lockcept";

const router = express.Router();

router.use("/lockceptDebug", lockceptRouter);

export default router;
