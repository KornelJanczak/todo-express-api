import passport from "passport";
import { Strategy, type StrategyOptions } from "passport-google-oauth20";
import {
  createUserQuery,
  getCurrentUserQuery,
  getUserByIdQuery,
} from "../db/auth";
import { User } from "@clerk/clerk-sdk-node";

const strategyOptions: StrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  callbackURL: "/api/auth/callback/google",
  passReqToCallback: false,
  scope: ["profile", "email", "openid"],
};

passport.serializeUser((user, done) => {
  console.log(user, "seriazlize user");

  done(null, user);
});
passport.deserializeUser(async (user: User, done) => {
  console.log(user.id, "deserialize user id");
  try {
    const findUser = await getUserByIdQuery(user.id);

    console.log(findUser, "Find user");

    if (!findUser) done(null, null);

    const currentUser = {
      id: findUser.rows[0],
      email: findUser.rows[1],
    };

    done(null, currentUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(
    strategyOptions,
    async (accessToken, refreshToken, profile, done) => {
      const account = profile._json;
      let user = {};

      console.log(account, "ACCOUNT");

      try {
        const existingUser = await getCurrentUserQuery(account.email);

        console.log(existingUser, "Current user");

        if (existingUser.rows.length === 0) {
          await createUserQuery(account.sub, account.email);

          const newUser = await getUserByIdQuery(account.sub);

          if (!newUser) throw new Error("User with the id doesn't exist");

          user = {
            id: newUser.rows[0].id,
            email: account.email,
          };
        } else {
          user = {
            id: existingUser.rows[0].id,
            email: existingUser.rows[0].email,
          };
        }
        done(null, user);
      } catch (err) {
        throw new Error(`${err}`);
      }
    }
  )
);
