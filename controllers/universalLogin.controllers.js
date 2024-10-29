require("../config/auth.google");
require("../config/auth.facebooks");
const passport = require("passport");
const { User } = require("../models/index.models");
const { generateToken } = require("../config/token");

class UniversalLoginControllers {
  static authenticationGoogle() {
    return passport.authenticate("google", { scope: ["email", "profile"] });
  }

  static callbackGoogle() {
    return passport.authenticate("google", {
      successRedirect: "/api/v1/universalLogin/google/login",
      failureRedirect: "/api/v1/universalLogin/auth/failure",
    });
  }

  static async loginGoogle(req, res) {
    const email = req.user.emails[0].value;

    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const payload = {
        email: user.email,
        id: user._id,
      };
      const token = generateToken(payload);
      res.cookie("token", token);
      res.status(200).send(`Welcome ${user.name}`);
    } catch (error) {
      console.log(error);
    }
  }

  static authenticationFacebook() {
    return passport.authenticate("facebook", {
      scope: ["email", "public_profile"],
    });
  }

  static callbackFacebook() {
    return passport.authenticate("facebook", {
      successRedirect: "/api/v1/universalLogin/facebook/login",
      failureRedirect: "/api/v1/universalLogin/auth/failure",
    });
  }

  static async loginFacebook(req, res) {
    const email = req.user.emails[0].value;

    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const payload = {
        email: user.email,
        id: user._id,
      };
      const token = generateToken(payload);
      res.cookie("token", token);
      res.status(200).send(`Welcome ${user.name}`);
    } catch (error) {
      console.log(error);
    }
  }

  static async logout(req, res) {
    req.session.destroy();
    res.clearCookie("token");
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "You have logged out" });
  }
}

module.exports = UniversalLoginControllers;
