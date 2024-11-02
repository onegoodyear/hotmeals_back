// services/passportServices.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const authServices = require("./authServices");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await authServices.handleGoogleAuth(profile);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  authServices.getUserProfile(id)
    .then((user) => done(null, user))
    .catch((error) => done(error, null));
});

module.exports = passport;
