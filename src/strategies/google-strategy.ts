import passport from "passport";
import { Strategy, type StrategyOptions } from "passport-google-oauth20";
import {
  createUserQuery,
  getCurrentUserQuery,
  getUserByIdQuerty,
} from "../db/auth";

const strategyOptions: StrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  callbackURL: "/api/auth/callback/google",
  scope: [
    "profile",
    "email",
    "openid",
    // "https://www.googleapis.com/auth/userinfo.profile",
    // "https://www.googleapis.com/auth/userinfo.email",
  ],
};

passport.serializeUser((user, done) => {
  console.log("a");

  done(null, user);
});
passport.deserializeUser((id, done) => {
  console.log("ada");

  done("chuj", null);
});

export default passport.use(
  new Strategy(
    strategyOptions,
    async (accessToken, refreshToken, profile, done) => {
      const account = profile._json;
      let user = {};

      try {

       console.log('google auth');
       

        const currentUser = await getCurrentUserQuery();

        if (currentUser.rows.length === 0) {
          await createUserQuery();

          const id = await getUserByIdQuerty();

          user = {
            id: id.rows[0].id,
            email: account.email,
          };
        } else {
          user = {
            id: currentUser.rows[0].id,
            email: currentUser.rows[0].email,
          };
        }
      } catch (err) {
        done(null, user);
      }
    }
  )
);
