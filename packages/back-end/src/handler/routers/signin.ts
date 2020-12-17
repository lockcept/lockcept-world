import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as LocalStrategy } from "passport-local";
import { omit } from "lodash";
import { SigninLocalRequest, SigninLocalResponse } from "@lockcept/shared";
import User from "../../dynamodb/user";
import { compareHash } from "../../helper";
import { errorLogger } from "../../logger";
import { config } from "../../config";

/**
 * router for signin
 */
const signinRouter = express.Router();
const jwtKey = config.key.JWT_USER;

signinRouter.use(passport.initialize());

/**
 * signin local
 */
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

signinRouter.post("/local", (req, res, next) => {
  const { email, password } = req.body as SigninLocalRequest;

  req.url = "/auth/local";
  req.body = { email, password };
  next();
});

signinRouter.post("/auth/local", (req, res) => {
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
        const token = jwt.sign(omit(user.data, "password"), jwtKey, {
          expiresIn: "1d",
        });
        const resBody: SigninLocalResponse = { token };
        return res.json(resBody);
      });
    }
  )(req, res);
});

/**
 * signin google (WIP)
 */
signinRouter.post("/google", (req, res) => {
  res.json({
    message: "signin",
  });
});

signinRouter.post("/auth/google", (req, res) => {
  res.json({
    message: "signinGoogle",
  });
});

export default signinRouter;
