import { CreateAccountRequest } from "@lockcept/shared";
import express from "express";
import Account from "../../dynamodb/account";
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

export default router;
