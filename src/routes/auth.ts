import { Router } from "express";
import passport from "passport"
import "../strategies/github-strategy";

export default (router: Router) => {
  router.get("/api/auth/github", passport.authenticate("github"));
};
