//  Author: Mohammad Jihad Hossain
//  Create Date: 28/08/2019
//  Modify Date: 01/09/2019
//  Description: Faq controller for ECL E-Commerce

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
const Product = require("../models/product");
const Review = require("../models/review");
const User = require("../models/user");
const CustomerOrder = require("../models/customerOrder");
const Faq = require("../models/faq");

//Order Success Page
router.post("/post-question", passportConfig.isAuthenticated, async function(
  req,
  res,
  next
) {
  (async () => {
    // New Review instance
    let newFaq = new Faq();
    // Value assign to instance
    newFaq.owner = req.user._id;
    if (req.body.name) newFaq.name = req.body.name;
    if (req.body.question) newFaq.question = req.body.question;
    if (req.body.email) newFaq.email = req.body.email;
    newFaq.product = req.body.product_id;

    // Save the new review
    await newFaq.save(async function(err, faq) {
      if (err) return next(err);

      //Find the product to set review
      await Product.findOneAndUpdate(
        { _id: req.body.hidden_product_id },
        { $push: { faqs: faq._id } },
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
