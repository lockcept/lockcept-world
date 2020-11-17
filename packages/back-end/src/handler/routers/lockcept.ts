import express from "express";
import User from "../../dynamodb/user";
import { errorLogger } from "../../logger";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "hello lockcept world",
  });
});

router.get("/user", async (req, res) => {
  try {
    const userItems = await User.getItems();
    const uniqueEmailItems = await User.getUniqueEmailItems();
    res.json({
      message: userItems,
      message2: uniqueEmailItems,
    });
  } catch (e) {
    errorLogger(e);
    res.json({});
  }
});

router.get("/user/create", async (req, res) => {
  try {
    await User.createUserItem({
      email: "lockcept@gmail.com",
      password: "lockcept",
      userName: "lockcept",
    });
    res.json({ message: "Good!" });
  } catch (e) {
    errorLogger(e);
    res.json({ message: "Failed to create" });
  }
});

router.get("/user/set-email/:id/:email", async (req, res) => {
  const { id, email } = req.params;
  try {
    await User.setEmail(id, email);
    res.json({ message: "Good!" });
  } catch (e) {
    errorLogger(e);
    res.json({ message: "Failed to create" });
  }
});

router.get("/user/set-user-name/:id/:userName", async (req, res) => {
  const { id, userName } = req.params;
  try {
    await User.setUserName(id, userName);
    res.json({ message: "Good!" });
  } catch (e) {
    errorLogger(e);
    res.json({ message: "Failed to create" });
  }
});

router.get("/user/set-password/:id/:password", async (req, res) => {
  const { id, password } = req.params;
  try {
    await User.setPassword(id, password);
    res.json({ message: "Good!" });
  } catch (e) {
    errorLogger(e);
    res.json({ message: "Failed to create" });
  }
});

export default router;
