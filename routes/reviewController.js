//  Author: Mohammad Jihad Hossain
//  Create Date: 26/08/2019
//  Modify Date: 28/08/2019
//  Description: Review controller for ECL E-Commerce

//  Library import
const router = require("express").Router();
const async = require("async");
const randomString = require("randomstring");
const passportConfig = require("../config/passport");
const ejs = require("ejs");
const fs = require("fs");
const ejsmate = require("ejs-mate");

//Model import
const Invoice = require("../models/invoice");
var Product = require("../models/product");
var Review = require("../models/review");
const User = require("../models/user");
const CustomerOrder = require("../models/customerOrder");

//Order Success Page
router.post("/post-review", passportConfig.isAuthenticated, async function(
  req,
  res,
  next
) {
  (async () => {
    // New Review instance
    let newReview = new Review();
    // Value assign to instance
    newReview.owner = req.user._id;
    if (req.body.title) newReview.title = req.body.title;
    if (req.body.description) newReview.description = req.body.description;
    if (req.body.comment) newReview.comment = req.body.comment;
    newReview.product = req.body.hidden_product_id;
    newReview.rating = req.body.rating;

    // Save the new review
    await newReview.save(async function(err, review) {
      if (err) return next(err);

      //Find the product to set review
      await Product.findOneAndUpdate(
        { _id: req.body.hidden_product_id },
        { $push: { reviews: review._id } },
        { safe: true, upsert: true }
      );

      //console.log(req.body.hidden_product_id);

      //Redirect to success page
      res.redirect(req.session.returnTo);
      delete req.session.returnTo;
    });
  })();
});

module.exports = router;
