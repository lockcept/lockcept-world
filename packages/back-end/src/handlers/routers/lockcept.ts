import { AccountData, UserData } from "@lockcept/shared";
import express from "express";
import { map } from "lodash";
import { config } from "../../config";
import Account from "../../models/account";
import User from "../../models/user";
import { errorLogger } from "../../logger";
import { scanAll } from "../../models/dynamodb";

/**
 * router for debug
 */
const router = express.Router();

const userTable = config.table.user;
const uniqueEmailTable = config.table.uniqueEmail;
const accountTable = config.table.account;

const getAllUsers = async (): Promise<User[]> => {
  const userItems = await scanAll({
    TableName: userTable,
  });
  return map(userItems, (user) => {
    return new User(user as UserData);
  });
};

const getAllUniqueEmails = async (): Promise<string[]> => {
  const uniqueEmailItems = await scanAll({
    TableName: uniqueEmailTable,
  });
  return map(uniqueEmailItems, (uniqueEmail) => {
    return JSON.stringify(uniqueEmail);
  });
};

const getAllAccounts = async (): Promise<Account[]> => {
  const accountItems = await scanAll({
    TableName: accountTable,
  });
  return map(accountItems, (account) => {
    return new Account(account as AccountData);
  });
};

router.get("/", (req, res) => {
  const user = req.user as User;
  res.json({
    message: `hello lockcept world ${JSON.stringify(user.data, null, 2)}`,
  });
});

router.get("/user", async (req, res) => {
  try {
    const userItems = await getAllUsers();
    const uniqueEmailItems = await getAllUniqueEmails();
    res.json({
      message: userItems,
      message2: uniqueEmailItems,
    });
  } catch (e) {
    errorLogger(e);
    res.sendStatus(500);
  }
});

router.get("/account", async (req, res) => {
  try {
    const userItems = await getAllAccounts();
    res.json({
      message: userItems,
    });
  } catch (e) {
    errorLogger(e);
    res.sendStatus(500);
  }
});

export default router;
