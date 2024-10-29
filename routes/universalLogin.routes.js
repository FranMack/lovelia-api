const express = require("express");
const universalLoginRouter = express.Router();
const UniversalLoginControllers = require("../controllers/universalLogin.controllers");

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

//google

universalLoginRouter.get(
  "/auth/google",
  UniversalLoginControllers.authenticationGoogle()
);

universalLoginRouter.get(
  "/google/callback",
  UniversalLoginControllers.callbackGoogle()
);

universalLoginRouter.get(
  "/google/login",
  isLoggedIn,
  UniversalLoginControllers.loginGoogle
);

//facebook

universalLoginRouter.get(
  "/auth/facebook",
  UniversalLoginControllers.authenticationFacebook()
);

universalLoginRouter.get(
  "/facebook/callback",
  UniversalLoginControllers.callbackFacebook()
);

universalLoginRouter.get(
  "/facebook/login",
  isLoggedIn,
  UniversalLoginControllers.loginFacebook
);

universalLoginRouter.get("/auth/failure", (req, res) => {
  res.status(200).send("WRONG CREDENTIALS");
});

universalLoginRouter.get("/logout", UniversalLoginControllers.logout);

module.exports = universalLoginRouter;
