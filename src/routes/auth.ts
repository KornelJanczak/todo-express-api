import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
// import { successfullAuthentication } from "../strategies/github-strategy";

export default (router: Router) => {
  // router.get(
  //   "/api/auth/github",
  //   passport.authenticate("github", { scope: ["user:email"] })
  // );
  // router.get(
  //   "/api/auth/github/callback",
  //   passport.authenticate(
  //     "github",
  //     { failureRedirect: "/login" },
  //     (req: Request, res: Response) => {
  //       console.log("Successfull auth");
  //     }
  //   )
  // );
  router.get("/api/auth/google", passport.authenticate("google"));

  router.get(
    "/api/auth/callback/google",
    passport.authenticate("google"),
    (req: Request, res: Response) =>
      res.status(200).send({ message: "Finish!" })
  );

  router.get("/api/auth/status", (req: Request, res: Response) => {
    console.log(req.user, "STATUS USER");

    return req.user ? res.send(req.user) : res.sendStatus(401);
  });

  router.get(
    "/api/auth/logout",
    (req: Request, res: Response, next: NextFunction) => {
      req.logout((err) => {
        console.log("chuj");

        if (err) return next(err);

        res.send(200);
      });
    }
  );
};
