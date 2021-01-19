import {
  AccountData,
  AccountDataResponse,
  CreateAccountRequest,
  validateAccountData,
} from "@lockcept/shared";
import express from "express";
import { isNil } from "lodash";
import { errorLogger } from "../../logger";
import Account from "../../models/account";
import User from "../../models/user";

const router = express.Router();

router.post("/", async (req, res) => {
  const { accountData } = req.body as CreateAccountRequest;
  try {
    if (!accountData) {
      res.sendStatus(400);
      return;
    }
    const account = await Account.create(accountData);
    if (!account) {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(200);
  } catch (e) {
    errorLogger("Failed to create account", accountData);
    errorLogger(e);
    res.sendStatus(500);
  }
});

router.patch("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  const { accountData } = req.body as { accountData: AccountData };
  try {
    const user = req.user as User;
    if (user.data.id !== userId) {
      res.sendStatus(403);
    }
    if (!validateAccountData(accountData)) {
      res.sendStatus(400);
    }
    const account = await Account.get(userId);
    if (isNil(account)) throw Error();
    await account.update(accountData);
    res.sendStatus(200);
  } catch (e) {
    errorLogger("Failed to update account", { userId, accountData });
    errorLogger(e);
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
    const account = await Account.get(id);
    if (isNil(account)) {
      res.sendStatus(404);
      return;
    }
    const { data: accountData } = account;
    const accountResponseData: AccountDataResponse = { accountData };
    res.status(200).json(accountResponseData);
  } catch (e) {
    errorLogger("Failed to get accountData", { id });
    errorLogger(e);
    res.sendStatus(500);
  }
});

export default router;
