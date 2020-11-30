import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../../dynamodb/user";
import { compareHash } from "../../helper";
import { errorLogger } from "../../logger";
import { config } from "../../config";

const signinRouter = express.Router();
const jwtKey = config.key.JWT_USER;

signinRouter.use(passport.initialize());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOneByEmail(email);
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        if (!(await compareHash(password, user.data.password))) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (e) {
        errorLogger(e);
        return done(e);
      }
    }
  )
);

signinRouter.post("/signin/local", (req, res, next) => {
  const { userData } = req.body;
  const { email, password } = userData;

  req.url = "/auth/signin/local";
  req.body = { email, password };
  next();
});

signinRouter.post("/auth/signin/local", (req, res) => {
  passport.authenticate(
    "local",
    {
      session: false,
    },
    (err, user: User) => {
      if (err || !user) return res.sendStatus(403);
      return req.login(user, { session: false }, (e) => {
        if (e) {
          return res.send(e);
        }
        const token = jwt.sign(user.data, jwtKey, { expiresIn: "1d" });
        return res.json({ token });
      });
    }
  )(req, res);
});

signinRouter.post("/signin/google", (req, res) => {
  res.json({
    message: "signin",
  });
});

signinRouter.post("/auth/signin/google", (req, res) => {
  res.json({
    message: "signinGoogle",
  });
});

export default signinRouter;
