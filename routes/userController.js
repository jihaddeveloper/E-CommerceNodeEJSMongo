//  Author: Mohammad Jihad Hossain
//  Create Date: 02/01/2019
//  Modify Date: 06/08/2019
//  Description: User controller file to handle all user action of ECL E-Commerce

//Library import
const router = require("express").Router();
const async = require("async");
const passport = require("passport");
const passportConfig = require("../config/passport");
const secretConfig = require("../config/secret");
const Product = require("../models/product");
const Category = require("../models/category");
const Review = require("../models/review");
const randomString = require("randomstring");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

//Model import
const User = require("../models/user");
const WishList = require("../models/wishList");
const Cart = require("../models/cart");
const CustomerOrder = require("../models/customerOrder");

//Import secret file
const secret = require("../config/secret");

//Import input validator
const validateSignupInput = require("../validation/signupValidation");
const validateLoginInput = require("../validation/loginValidation");

//Mail Sender
const mailer = require("../misc/mailer");

//Token generator
signToken = user => {
  //JWT payload
  const payload = {
    iss: "DevJihad",
    sub: user.id,
    id: user._id,
    name: user.name,
    avatar: user.avatar,
    iat: new Date().getTime(), //Current Time
    exp: new Date().setDate(new Date().getDate() + 1) // Expiration Time
  };

  //Retun Token
  return jwt.sign(payload, secret.secretKey);
};

//User signup form
router.get("/signup", function(req, res, next) {
  res.render("accounts/signup", {
    errors: req.flash("errors"),
    validationErrors: ""
  });
});

//Create User
router.post("/signup", function(req, res, next) {
  //Set Validation
  const { validationErrors, isValid } = validateSignupInput(req.body);

  //Check Validation
  if (!isValid) {
    //console.log(validationErrors);
    return res.render("accounts/signup", {
      validationErrors: validationErrors
    });
  } else {
    User.findOne({
      email: req.body.email
    }).then(existingUser => {
      validationErrors.email = "Email already exists";

      if (existingUser) {
        return res.render("accounts/signup", {
          validationErrors: validationErrors
        });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200", //Size
          r: "pg", //Rating
          d: "mm" //Default
        });

        //Secret Token for email validation
        let newSecretToken = randomString.generate();

        //new user object
        const newUser = new User();

        var isSeller;
        if (req.body.isSeller === "on") {
          isSeller = true;
        } else {
          isSeller = false;
        }

        newUser.name = req.body.name;
        newUser.profile.name = req.body.name;
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        newUser.secretToken = newSecretToken;
        newUser.isActive = false;
        newUser.profile.picture = avatar;
        newUser.isSeller = isSeller;

        newUser.save(function(err, user) {
          if (err) return next(err);

          //Mail body
          const html = `Hello,
                              <br/>
                              Thank you for register
                              <br/>
                              <br/>
                              Now, please verify your eamil by typing the following token:
                              <br/>
                              <br/>
                              Clicking on the following button:
                              <a href="http://ecle-com.herokuapp.com/verify?token=${user.secretToken}&email=${user.email}">Verify<a/>
                              <br/>
                              <br/>
                              Good Day.... `;

          //https://ecle-com.herokuapp.com/verify">https://ecle-com.herokuapp.com/verify
          //Token: <b>${user.secretToken}<b/>

          //Mail sending
          mailer.sendEmail(
            '"Md Jihad Hossain" <devtestjihad@gmail.com>', // Sender
            user.email, // Receiver
            "Email Verification", //Subject
            html //Mail body
          );

          // Generate JWT Token
          const token = signToken(user);

          // Respond with token
          res.cookie("access_token", token, {
            //year*day*hour*min*sec*milisecond
            maxAge: 1 * 1 * 24 * 60 * 60 * 1000, // maxage setted to 24 hours
            expires: new Date(Date.now() + 1 * 1 * 24 * 60 * 60 * 1000), //expires after 1 day
            httpOnly: true
          });

          //Save a blank wishlist for the user
          const wishlist = new WishList();
          wishlist.owner = user._id;
          wishlist.save();

          //Save a blank cart for the user
          const cart = new Cart();
          cart.owner = user._id;
          cart.save();

          res.render("accounts/signupSuccess", {
            message:
              "Successfully account created, now check your eamil and verify to login",
            errors: ""
          });

          // //Respond with token
          // res.status(200).json({
          //   token: "Bearer " + token
          // });
        });
      }
    });
  }
});

//Customer email validation
router.get("/verify", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.query.email.trim() });

    if (user) {
      if (user.isActive) {
        return res.render("accounts/login", {
          message: "Already verified",
          errors: ""
        });
      } else {
        if (user.secretToken === req.query.token.trim()) {
          //Set User as Active
          user.isActive = true;
          user.secretToken = "";
          await user.save();

          res.render("accounts/login", {
            message: "Successful, now you may login",
            errors: ""
          });
        } else {
          res.render("accounts/login", {
            message: "",
            errors: "Token expired"
          });
        }
      }
    } else {
      return res.render("accounts/login", {
        message: "",
        errors: "No User found"
      });
    }
  } catch (error) {
    next(error);
  }
});

//Profile page
router.get("/profile", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  CustomerOrder.find({ user: req.user })
    .populate("cart.product")
    .exec(function(err, orders) {
      //console.log(orders);
      if (err) return next(err);
      res.render("accounts/profile", {
        user: req.user,
        orders: orders,
        moment: moment
      });
    });
});

//User login form
router.get("/login", function(req, res, next) {
  if (req.user) return res.redirect("/");
  res.render("accounts/login", {
    message: "",
    errors: req.flash("loginMessage"),
    validationErrors: ""
  });
});

//User login
router.post(
  "/login",
  passport.authenticate("local-login", {
    // session: false,
    // successRedirect: '/profile',
    failureRedirect: "/login",
    failureFlash: true
  }),
  function(req, res, next) {
    //Set Validation
    const { validationErrors, isValid } = validateLoginInput(req.body);

    //Check Validation
    if (!isValid) {
      //console.log(validationErrors);
      return res.render("accounts/login", {
        validationErrors: validationErrors
      });
    } else {
      // Generate token
      const token = signToken(req.user);

      //console.log(token);

      //Set cookie
      res.cookie("access_token", token, {
        //year*day*hour*min*sec*milisecond
        maxAge: 1 * 1 * 24 * 60 * 60 * 1000, // maxage is setted to 24 hours
        expires: new Date(Date.now() + 1 * 1 * 24 * 60 * 60 * 1000), //expires after 1 day
        httpOnly: true
      });

      //Redirect to saved URL
      if (req.session.returnTo) {
        res.redirect(req.session.returnTo);
        delete req.session.returnTo;
      } else {
        //Redirect to profile
        res.redirect("/profile");
      }
    }
  }
);

//User logout
router.get("/logout", function(req, res, next) {
  //Clear the existing cookie
  res.clearCookie("access_token");

  //Logout
  req.logout();

  //Remove cart
  delete req.session.cart;

  //Redirect to previous URL
  res.redirect("/login");

  //Remove old url
  delete req.session.returnTo;
});

//Password recovery
router.get("/passwordRecovery", function(req, res, next) {});

//Profile update form
router.get("/edit-profile", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  res.render("accounts/editProfile", { message: req.flash("success") });
});

//Profile update
router.post("/edit-profile", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  User.findOne({ _id: req.user._id }, function(err, user) {
    if (err) return next(err);

    var bool;
    if (req.body.isSeller === "on") {
      bool = true;
    } else {
      bool = false;
    }

    if (req.body.name) user.profile.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.contact) user.contact = req.body.contact;

    user.isSeller = bool;

    user.save(function(err) {
      if (err) return next(err);
      req.flash("success", "Successfully edited profile");
      return res.redirect("/profile");
    });
  });
});

//Profile Address update form
router.get("/edit-address", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  res.render("accounts/editAddress", { message: req.flash("success") });
});

//Profile Address update
router.post("/edit-address", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  User.findOne({ _id: req.user._id }, function(err, user) {
    if (err) return next(err);

    if (req.body.address1) user.address.address1 = req.body.address1;
    if (req.body.address2) user.address.address2 = req.body.address2;
    if (req.body.city) user.address.city = req.body.city;
    if (req.body.district) user.address.district = req.body.district;
    if (req.body.country) user.address.country = req.body.country;
    if (req.body.postalCode) user.address.postalCode = req.body.postalCode;

    user.save(function(err) {
      if (err) return next(err);
      req.flash("success", "Successfully edited address");
      return res.redirect("/profile");
    });
  });
});

//facebook login route
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

//facebook login callback
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/login"
  })
);

//  //Passport jwt facebook and google
// // @route   POST /api/user/oauth/facebook
// // @desc    Facebook oauth
// // @access  Private
// router.post(
//   "/oauth/facebook",
//   passport.authenticate("facebookToken", {
//     //session: false
//     // successRedirect: "/profile",
//     // failureRedirect: "/login"
//   }),
//   (req, res) => {
//     // Generate Token
//     const token = signToken(req.user);
//     //Set cookie
//     res.cookie("access_token", token, {
//       //year*day*hour*min*sec*milisecond
//       maxAge: 1 * 1 * 24 * 60 * 60 * 1000, // maxage is setted to 24 hours
//       expires: new Date(Date.now() + 1 * 1 * 24 * 60 * 60 * 1000), //expires after 1 day
//       httpOnly: true
//     });
//     //Redirect to saved URL
//     if (req.session.returnTo) {
//       res.redirect(req.session.returnTo);
//       delete req.session.returnTo;
//     } else {
//       //Redirect to profile
//       res.redirect("/profile");
//     }

//     //console.log("Hello World");
//     //console.log(req.user);
//   }
// );

// // @route   POST /api/user/oauth/google
// // @desc    Google oauth
// // @access  Private
// router.post(
//   "/oauth/google",
//   passport.authenticate("googleToken", {
//     session: false
//   }),
//   (req, res) => {
//     // Generate Token
//     const token = signToken(req.user);

//     //Respond with token
//     res.status(200).json({
//       token: "Bearer " + token
//     });
//   }
// );

module.exports = router;
