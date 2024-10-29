const {envs}=require("../config/env.config")
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../models/index.models");

passport.use(
  new GoogleStrategy(
    {
      clientID: envs.ID_CLIENT_GOOGLE,
      clientSecret: envs.SECRET_GOOGLE,
      callbackURL: envs.CALLBACK_URL_GOOGLE,
    },
    async function (accessToken, refreshToken, profile, cb) {
      const user = await User.findOne({ email: profile.emails[0].value });

      if (!user) {
        const newUser = await User.create({
          email: profile.emails[0].value,
          name: profile.name.givenName,
          lastname: profile.name.familyName,
          confirm: true,
          provider: profile.provider,
        });
        return cb(null, profile);
      } else {
        return cb(null, profile);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
