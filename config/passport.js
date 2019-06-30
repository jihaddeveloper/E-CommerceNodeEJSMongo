//  Author: Mohammad Jihad Hossain
//  Create Date: 02/01/2019
//  Modify Date: 17/06/2019
//  Description: Passport config file of ECL E-Commerce

//Libarary imports
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const FacebookTokenStrategy = require("passport-facebook-token");
const GooglePlusTokenStrategy = require("passport-google-plus-token");

var secret = require("../config/secret");
var User = require("../models/user");
var async = require("async");

// const opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = secret.secretKey;

//Serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//Cookie extractor
const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

// JSON WEB TOKENS STRATEGY
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: secret.secretKey,
      passReqToCallback: true
    },
    async (req, jwt_payload, done) => {
      try {
        // Find the user specified in token
        const user = await User.findById(jwt_payload.sub);

        // If user doesn't exists, handle it
        if (!user) {
          return done(null, false);
        }

        // Otherwise, return the user
        req.user = user;
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//Middleware for local login
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    async function(req, email, password, done) {
      try {
        // Find the user given the email
        const user = await User.findOne({ email: email });

        // If not, handle it
        if (!user) {
          return done(
            null,
            false,
            req.flash("loginMessage", "No user has been found")
          );
        }

        // Check if the password is correct
        const isMatch = await user.comparePassword(password);

        // If the password is incorrect
        if (!isMatch) {
          return done(
            null,
            false,
            req.flash("loginMessage", "Wrong password !!")
          );
        }

        //If the user is not active
        if (!user.isActive) {
          return done(
            null,
            false,
            req.flash("loginMessage", "You need to verify email first !!")
          );
        }

        // Otherwise, return the user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//Middleware for facebook login
passport.use(
  "facebook",
  new FacebookStrategy(secret.facebook, function(
    token,
    refreshToken,
    profile,
    done
  ) {
    User.findOne({ facebook: profile.id }, function(err, user) {
      if (err) return done(err);

      if (user) {
        return done(null, user);
      } else {
        async.waterfall([
          function(callback) {
            var newUser = new User();

            newUser.email = profile._json.email;
            newUser.facebook = profile.id;
            newUser.tokens.push({ kind: "facebook", token: token });
            newUser.profile.name = profile.displayName;
            newUser.profile.picture =
              "https://graph.facebook.com/" +
              profile.id +
              "/picture?type=large";

            newUser.save(function(err) {
              if (err) throw err;

              callback(err, newUser);
            });
          },
          function(newUser) {
            var cart = new Cart();

            cart.owner = newUser._id;

            cart.save(function(err) {
              if (err) return done(err);
              return done(err, newUser);
            });
          }
        ]);
      }
    });
  })
);

// //Facebook OAuth Strategy
// passport.use(
//   "facebookToken",
//   new FacebookTokenStrategy(
//     {
//       clientID: secret.facebook.clientID,
//       clientSecret: secret.facebook.clientSecret
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Could get accessed in two ways:
//         // 1) When registering for the first time
//         // 2) When linking account to the existing one

//         // console.log('profile', profile);
//         // console.log('accessToken', accessToken);
//         // console.log('refreshToken', refreshToken);

//         // Checking the user already registered or not
//         const existingUser = await User.findOne({
//           "facebook.id": profile.id
//         });

//         //If existing user, return the user
//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         // Create new user
//         const newUser = new User();
//         newUser.email = profile.emails[0].value;
//         newUser.facebook.email = profile.emails[0].value;
//         newUser.facebook.id = profile.id;
//         newUser.name = profile.displayName;
//         //newUser.avatar = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';

//         // Save new user
//         await newUser.save();
//         done(null, newUser);
//       } catch (error) {
//         done(error, false, error.message);
//       }
//     }
//   )
// );

// // Google OAuth Strategy
// passport.use('googleToken', new GooglePlusTokenStrategy({
//   clientID: secret.google.clientID,
//   clientSecret: secret.google.clientSecret,
//   passReqToCallback: true,
// }, async (req, accessToken, refreshToken, profile, done) => {
//   try {
//       // Could get accessed in two ways:
//       // 1) When registering for the first time
//       // 2) When linking account to the existing one

//       // // Should have full user profile over here
//       // console.log('profile', profile);
//       // console.log('accessToken', accessToken);
//       // console.log('refreshToken', refreshToken);

//       // Checking the user already registered or not
//       const existingUser = await User.findOne({
//           'google.id': profile.id
//       });
//       if (existingUser) {
//           return done(null, existingUser);
//       }

//       //If new user
//       // Create new user
//       const newUser = new User();
//       newUser.email = profile.emails[0].value;
//       newUser.google.email = profile.emails[0].value;
//       newUser.google.id = profile.id;
//       newUser.name = profile.displayName;
//       //newUser.avatar = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';

//       // Save new user
//       await newUser.save();
//       done(null, newUser);
//   } catch (error) {
//       done(error, false, error.message);
//   }
// }));

//Custom function to validate
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
};
