import { Router } from "express";
import passport from "passport";
import "../strategies/github-strategy";
import { successfullAuthentication } from "../strategies/github-strategy";

export default (router: Router) => {
  router.get("/api/auth/github", passport.authenticate("github"));
  router.get(
    "/auth/github/callback",
    passport.authenticate(
      "github",
      { failureRedirect: "/login" },
      successfullAuthentication
    )
  );
};
