import {
  AccountData,
  CreateAccountRequest,
  validateAccountData,
} from "@lockcept/shared";
import express from "express";
import { isNil } from "lodash";
import Account from "../../models/account";
import User from "../../models/user";
import { errorLogger } from "../../logger";

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

export default router;
