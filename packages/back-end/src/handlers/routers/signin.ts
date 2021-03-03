import {
  ErrorName,
  SigninLocalRequest,
  SigninLocalResponse,
  validateEmail,
  validatePassword,
} from "@lockcept/shared";
import express from "express";
import jwt from "jsonwebtoken";
import { omit } from "lodash";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from "../../config";
import { compareHash, CustomError } from "../../helpers";
import { errorLogger } from "../../logger";
import User from "../../models/user";

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
          return done(
            new CustomError("Invalid email", {
              name: ErrorName.InvalidEmail,
              statusCode: 404,
            }),
            false,
            { message: "Invalid email." }
          );
        }
        if (!(await compareHash(password, user.data.password))) {
          return done(
            new CustomError("Invalid password", {
              name: ErrorName.InvalidPassword,
              statusCode: 403,
            }),
            false,
            { message: "Invalid password." }
          );
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
  if (!validateEmail(email)) {
    res.sendStatus(400);
    return;
  }
  if (!validatePassword(password)) {
    res.status(403).json(
      new CustomError("Invalid password", {
        name: ErrorName.InvalidPassword,
        statusCode: 403,
      })
    );
    return;
  }

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
      if (err || !user) {
        if (err?.options?.name) {
          const statusCode = err?.options?.statusCode ?? 500;
          errorLogger(err);
          return res.status(statusCode).json(err);
        }
        return res.sendStatus(500);
      }
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

signinRouter.post("/auth/google", (req, res) => {
  res.json({
    message: "signinGoogle",
  });
});

export default signinRouter;
