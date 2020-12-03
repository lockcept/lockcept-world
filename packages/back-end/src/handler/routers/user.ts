import express from "express";
import { omit } from "lodash";
import User from "../../dynamodb/user";
import { errorLogger } from "../../logger";

const router = express.Router();

router.patch("/users/:userId/emails/:email", async (req, res) => {
  const { userId: id, email } = req.params;
  try {
    const user = req.user as User;
    if (user.data.id !== id) {
      res.sendStatus(403);
    }
    await user.setEmail(email);
    res.sendStatus(200);
  } catch (e) {
    errorLogger("Failed to set email", { id, email });
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
    res.sendStatus(500);
  }
});

router.patch("/users/:userId/usernames/:username", async (req, res) => {
  const { userId: id, userName } = req.params;
  try {
    const user = req.user as User;
    if (user.data.id !== id) {
      res.sendStatus(403);
    }
    await user.setUserName(userName);
    res.sendStatus(200);
  } catch (e) {
    errorLogger("Failed to set userName", { id, userName });
    res.sendStatus(500);
  }
});

router.get("/users/:userId", async (req, res) => {
  const { userId: id } = req.params;
  try {
    const user = req.user as User;
    if (user.data.id !== id) {
      res.sendStatus(403);
    }
    const userResponseData = omit(user.data, "password", "id");
    res.status(200).send(JSON.stringify(userResponseData));
  } catch (e) {
    errorLogger("Failed to get userData", { id });
    res.sendStatus(500);
  }
});

export default router;
