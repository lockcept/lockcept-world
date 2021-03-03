import { SignupLocalRequest } from "@lockcept/shared";
import express from "express";
import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import { config } from "../../config";
import { errorLogger } from "../../logger";
import Account from "../../models/account";
import User from "../../models/user";

/**
 * router for signup
 */
const signupRouter = express.Router();

signupRouter.use(passport.initialize());

/**
 * signup local
 */
signupRouter.post("/local", async (req, res) => {
  const { userData } = req.body as SignupLocalRequest;
  try {
    const { email, password, userName } = userData;
    const user = await User.create({
      email,
      password,
      userName,
      isFakeEmail: false,
    });
    await Account.create({ userId: user.id });
    res.sendStatus(200);
  } catch (e) {
    errorLogger("Failed to signup", userData);
    errorLogger(e);
    if (e.options?.name) {
      const statusCode = e.options?.statusCode ?? 500;
      res.status(statusCode).json(e);
      return;
    }
    if (e.options?.statusCode) res.sendStatus(e.options.statusCode);
    else res.sendStatus(500);
  }
});

/**
 * signup google (WIP)
 */

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = config.key;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/signup/google/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log("asdf", profile);
      const user = User.create({
        email: `${profile.id}_google@lockcept.kr`,
        password: "lockcept",
        userName: `google`,
        isFakeEmail: false,
      });
      console.log("asdf2");
      return cb(null, user);
    }
  )
);
signupRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  })
);
signupRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  (req, res) => {
    console.log("asdf3");
    res.redirect("http://localhost:3000/");
  }
);

export default signupRouter;
