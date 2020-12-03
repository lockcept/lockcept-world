import { UserData } from "@lockcept/shared";
import express from "express";
import { map } from "lodash";
import { config } from "../../config";
import { scanAll } from "../../dynamodb/dynamodb";
import User from "../../dynamodb/user";
import { hash } from "../../helper";
import { errorLogger } from "../../logger";

const userTable = config.table.user;
const uniqueEmailTable = config.table.uniqueEmail;

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

const router = express.Router();

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

router.get("/user/create", async (req, res) => {
  try {
    const hashPassword = await hash("lockcept");
    await User.create({
      email: "lockcept@gmail.com",
      password: hashPassword,
      userName: "lockcept",
    });
    res.json({ message: "Good!" });
  } catch (e) {
    errorLogger(e);
    res.json({ message: "Failed to create" });
  }
});

export default router;
