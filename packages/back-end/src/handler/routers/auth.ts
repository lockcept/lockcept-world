import express from "express";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { config } from "../../config";
import User from "../../dynamodb/user";
import signinRouter from "./signin";
import signupRouter from "./signup";

const authRouter = express.Router();

authRouter.use("/signup", signupRouter);
authRouter.use("/signin", signinRouter);

authRouter.use(passport.initialize());

const jwtKey = config.key.JWT_USER;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtKey,
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findOneByEmail(jwtPayload.email);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (e) {
        return done(e);
      }
    }
  )
);

authRouter.use("/", passport.authenticate("jwt", { session: false }));

export default authRouter;
