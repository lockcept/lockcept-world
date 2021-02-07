import {
  SigninLocalResponse,
  UpdateEmailRequest,
  UpdateUserNameRequest,
  UserDataResponse,
} from "@lockcept/shared";
import express from "express";
import jwt from "jsonwebtoken";
import { omit } from "lodash";
import { config } from "../../config";
import { errorLogger } from "../../logger";
import User from "../../models/user";

const router = express.Router();

const jwtKey = config.key.JWT_USER;

router.post("/users/:userId/email", async (req, res) => {
  const { userId: id } = req.params;
  const { email } = req.body as UpdateEmailRequest;
  try {
    const user = req.user as User;
    if (user.data.id !== id) {
      res.sendStatus(403);
    }
    await user.setEmail(email);
    const token = jwt.sign(omit({ ...user.data, email }, "password"), jwtKey, {
      expiresIn: "1d",
    });
    const resBody: SigninLocalResponse = { token };
    res.json(resBody);
  } catch (e) {
    errorLogger("Failed to set email", { id, email });
    errorLogger(e);
    if (e?.options?.name) {
      const statusCode = e?.options?.statusCode ?? 500;
      res.status(statusCode).json(e);
    }
    res.sendStatus(500);
  }
});

router.patch("/users/:userId/passwords/:password", async (req, res) => {
  const { userId: id, password } = req.params;
  try {
    const user = req.user as User;
    if (user.data.id !== id) {
      res.sendStatus(403);
    }
    await user.setPassword(password);
    res.sendStatus(200);
  } catch (e) {
    errorLogger("Failed to set password", { id, password });
    errorLogger(e);
    res.sendStatus(500);
  }
});

router.post("/users/:userId/username/", async (req, res) => {
  const { userId: id } = req.params;
  const { userName } = req.body as UpdateUserNameRequest;
  try {
    const user = req.user as User;
    if (user.data.id !== id) {
      res.sendStatus(403);
    }
    await user.setUserName(userName);
    const token = jwt.sign(
      omit({ ...user.data, userName }, "password"),
      jwtKey,
      {
        expiresIn: "1d",
      }
    );
    const resBody: SigninLocalResponse = { token };
    res.json(resBody);
  } catch (e) {
    errorLogger("Failed to set userName", { id, userName });
    errorLogger(e);
    if (e?.options?.name) {
      const statusCode = e?.options?.statusCode ?? 500;
      res.status(statusCode).json(e);
    }
    res.sendStatus(500);
  }
});

router.get("/users/:userId", async (req, res) => {
  const { userId: id } = req.params;
  try {
    const user = req.user as User;
    if (user.data.id !== id) {
      res.sendStatus(403);
      return;
    }
    const userResponseData: UserDataResponse = {
      userData: omit(user.data, "password", "id"),
    };
    res.status(200).json(userResponseData);
  } catch (e) {
    errorLogger("Failed to get userData", { id });
    errorLogger(e);
    res.sendStatus(500);
  }
});

export default router;
