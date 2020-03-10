//  Author: Mohammad Jihad Hossain
//  Create Date: 02/01/2019
//  Modify Date: 10/03/2020
//  Description: Main controller file of ECL E-Commerce

// Library import
const router = require("express").Router();
const async = require("async");
const passportConfig = require("../config/passport");

//Model import
var Product = require("../models/product");
var Review = require("../models/review");
const User = require("../models/user");

//Product Filtering
var unique = require("array-unique");

//Pagination function
async function paginate(req, res, next) {
  //Paginate product page
  var perPage = 6;
  var page = req.params.page;

  // Find all Products
  Product.find({
    isActive: true
  })
    .skip(perPage * page - page)
    .limit(perPage)
    .populate({
      path: "subcategory",
      populate: {
        path: "category"
      }
    })
    .populate("category")
    .populate("subcategory")
    .populate("brand")
    .populate("features.label")
    .populate("relatedProducts")
    .populate("reviews")
    .populate("discount")
    .exec(function(err, products) {
      if (err) return next(err);
      //console.log(products.length);
      Product.count().exec(async function(err, count) {
        if (err) return next(err);

        // Find Products with discount
        var discountProducts = await Product.find({
          $and: [
            { isActive: true },
            { discount: { $ne: null } },
            { discount: { $exists: true } }
          ]
        })
          .populate("category")
          .populate("subcategory")
          .populate("brand")
          .populate("features.label")
          .populate("relatedProducts")
          .populate("reviews")
          .populate("discount");

        //console.log(discountProducts);

        res.render("main/index", {
          products: products,
          discountProducts: discountProducts,
          pages: count / perPage,
          message: "",
          errors: req.flash("errors")
        });
      });
    });
}

//Home Route
router.get("/", function(req, res, next) {
  //For returning to same page
  req.session.returnTo = req.originalUrl;

  paginate(req, res, next);
});

//Pages
router.get("/page/:page", function(req, res, next) {
  paginate(req, res, next);
});

//About Route
router.get("/about", function(req, res, next) {
  res.render("main/about");
});

//Single product view
router.get("/product/:id", function(req, res, next) {
  //Store the current URL
  req.session.returnTo = req.originalUrl;

  //console.log(req.session.cart);

  Product.findOne({
    _id: req.params.id
  })
    .populate("category")
    .populate("subcategory")
    .populate("brand")
    .populate("features.label")
    .populate("relatedProducts")
    .populate("reviews")
    .populate("discount")
    .exec(function(err, product) {
      //console.log(product);
      if (err) return next(err);

      //To find the discount price
      if (product.discount) {
        if (product.discount.enabled) {
          if (product.discount.usePercentage) {
            var discountPrice =
              parseFloat(product.sellingPrice) -
              parseFloat(
                (parseFloat(product.sellingPrice) *
                  parseFloat(product.discount.discountPercent)) /
                  100
              );
          } else {
            var discountPrice =
              parseFloat(product.sellingPrice) -
              parseFloat(product.discount.discountAmount);
          }
        }
      }

      res.render("main/singleProduct", {
        product: product,
        discountPrice: discountPrice,
        features: product.features
      });
    });
});

//Custom Search
//Search route
router.post("/search", function(req, res, next) {
  res.redirect("/search?q=" + req.body.q);
});

//Text making function
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

//Search function
router.get("/search", function(req, res, next) {
  if (req.query.q) {
    const regex = new RegExp(escapeRegex(req.query.q), "gi");
    Product.find({
      $or: [
        {
          name: regex
        },
        {
          categoryName: regex
        },
        {
          subCategoryName: regex
        },
        {
          brandName: regex
        },
        {
          model: regex
        },
        {
          description: regex
        }
      ]
    })
      .populate({
        path: "subcategory",
        populate: {
          path: "category"
        }
      })
      .populate("category")
      .populate("subcategory")
      .populate("brand")
      .exec(function(err, results) {
        if (err) return next(err);
        res.render("main/searchResult", {
          query: req.query.q,
          data: results
        });
      });
  } else {
    paginate(req, res, next);
  }
});
//Custom Search

//Cart view (Database)
router.get("/cart", function(req, res, next) {
  Cart.findOne({
    owner: req.user._id
  })
    .populate("items.item")
    .exec(function(err, foundCart) {
      if (err) return next(err);
      res.render("main/cart", {
        foundCart: foundCart,
        user: req.user,
        message: req.flash("remove")
      });
    });
});

//Procced to checkout
router.get("/procced-checkout", function(req, res, next) {
  if (!req.session.sessionCart) {
    return res.redirect("/shopping-cart");
  }
  var cart = new SessionCart(req.session.sessionCart);
  res.render("main/checkoutPage", {
    totalPrice: cart.totalPrice
  });
});

//Payment Ready Page
router.post("/paymentReady", function(req, res, next) {});

module.exports = router;
