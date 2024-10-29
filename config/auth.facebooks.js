const {envs}=require("../config/env.config")
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const { User } = require("../models/index.models");

passport.use(
  new FacebookStrategy(
    {
      clientID: envs.ID_CLIENT_FACEBOOK,
      clientSecret: envs.SECRET_FACEBOOK,
      callbackURL: envs.CALLBACK_URL_FACEBOOK,
      profileFields: ["id", "displayName", "name", "emails"],
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
