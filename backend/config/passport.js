const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Cerca utente già registrato con Google ID
      let user = await User.findOne({ where: { email: profile.emails[0].value } });

      if (!user) {
        // Se non esiste, crea nuovo utente
        user = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          password: Math.random().toString(36).slice(-8), // password random
          role: 'user',
          isBlocked: false
        });
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

// Serializzazione (necessaria per sessioni, anche se usi JWT)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

module.exports = passport;
