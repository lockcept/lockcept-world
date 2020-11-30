import express from "express";
import User from "../../dynamodb/user";
import { hash } from "../../helper";
import { errorLogger } from "../../logger";

const router = express.Router();

router.get("/", (req, res) => {
  const user = req.user as User;
  res.json({
    message: `hello lockcept world ${JSON.stringify(user.data, null, 2)}`,
  });
});

router.get("/user", async (req, res) => {
  try {
    const userItems = await User.getAll();
    const uniqueEmailItems = await User.getAllUniqueEmails();
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

router.post("/user/check-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) throw Error();
    const compared = await User.comparePassword(email, password);
    res.json({ message: compared });
  } catch (e) {
    errorLogger(e);
    res.json({ message: "Failed" });
  }
});

export default router;
