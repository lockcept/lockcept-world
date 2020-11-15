import express from "express";
import User from "../../dynamodb/user";

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
    res.json({ message: "Failed to create" });
  }
});

router.get("/user/set-email/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await User.setEmail(id, "lockcept2@gmail.com");
    res.json({ message: "Good!" });
  } catch (e) {
    res.json({ message: "Failed to create" });
  }
});

export default router;
