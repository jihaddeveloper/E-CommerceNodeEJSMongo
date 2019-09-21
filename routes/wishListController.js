//  Author: Mohammad Jihad Hossain
//  Create Date: 16/06/2019
//  Modify Date: 16/06/2019
//  Description: Wishlist controller for all routes of Wishlist.

//Import router
const router = require("express").Router();
//To show the date in right format
const moment = require("moment");

//Product model import
const User = require("../models/user");
const Product = require("../models/product");
const WishList = require("../models/wishList");

//Passport import
const passportConfig = require("../config/passport");

//Product added to wishlist
router.get(
  "/add-to-wishlist/:product_id",
  passportConfig.isAuthenticated,
  function(req, res, next) {
    //Get the product id from url params
    const product_id = req.params.product_id;

    let quantity = 1;

    WishList.findOne({ owner: req.user._id }, async function(err, wishList) {
      //Find the product
      const product = await Product.findOne({ _id: product_id });

      //Set product as new product.
      var newItem = true;

      //Check the product is already in wishlist
      for (var i = 0; i < wishList.items.length; i++) {
        if (wishList.items[i].product == product_id) {
          newItem = false;
          //console.log("World");
          req.flash("errors", "This product is already exist in wishlist");
          req.flash("message", "");
          return res.redirect("/product/" + req.params.product_id);
        }
      }

      //If the product is new
      if (newItem) {
        wishList.items.push({
          product: product_id,
          price: product.sellingPrice,
          quantity: quantity
        });
        //console.log("Hello");
        wishList.total = wishList.total + product.sellingPrice;

        wishList.save(function(err) {
          if (err) return next(err);
          req.flash("errors", "");
          req.flash("message", "Product is added to wishlist");
          return res.redirect("/product/" + req.params.product_id);
        });
      }
    });
  }
);

//Wishlist view
router.get("/wishlist", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  //Store the current URL
  req.session.returnTo = req.originalUrl;

  WishList.findOne({ owner: req.user._id })
    .populate("items.product")
    .exec(function(err, wishList) {
      if (err) return next(err);
      return res.render("accounts/wishlist", {
        wishList: wishList,
        moment: moment
      });
    });
});

//Product remove from wishlist
router.get(
  "/wishlist/remove/:product_id",
  passportConfig.isAuthenticated,
  function(req, res, next) {
    // //Store the current URL
    // req.session.returnTo = req.originalUrl;

    //Get product form params
    var product = req.params.product_id;

    //console.log(product);

    WishList.findOneAndUpdate(
      { owner: req.user._id },
      { $pull: { items: { product: product } } },
      { multi: true },
      function(err, updatedWishlist) {
        if (err) return next(err);
        req.flash("errors", "");
        req.flash("message", "Product is removed from wishlist");
        res.redirect("/wishlist");
      }
    );
  }
);

//Export router
module.exports = router;
