const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;

const ExtractJWT = passportJWT.ExtractJwt;

require("dotenv").config();

const db = require("../models");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    (email, password, done) => {
      db.User.findOne({
        where: {
          email: email
        }
      }).then(dbUser => {
        if (!dbUser) {
          return done(null, false, {
            message: "Incorrect Email."
          });
        } else if (!dbUser.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect Password"
          });
        }
        return done(null, dbUser);
      });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    // The second part of the token is the payload, which contains the claims. Claims are statements about an entity (typically, the user) and additional data. There are three types of claims: registered, public, and private claims.
    // This function is passing in two parameters, jwtPayload and cb (or the callback)
    function(jwtPayload, cb) {
      // Returning the id from the User table
      return db.User.findById(jwtPayload)
        .then(user => {
          return cb(null, user);
        })
        .catch(err => {
          return cb(err);
        });
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
