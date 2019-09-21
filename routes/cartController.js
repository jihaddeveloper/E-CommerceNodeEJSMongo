//  Author: Mohammad Jihad Hossain
//  Create Date: 02/01/2019
//  Modify Date: 12/06/2019
//  Description: Cart controller for all routes of Cart project for ECL E-Commerce

//Import router
const router = require("express").Router();

//Passport import
const passportConfig = require("../config/passport");

//Model import
const Product = require("../models/product");
const Cart = require("../models/cart");

//Product added to cart
router.post("/add-to-cart", async function(req, res, next) {
  //Read from frontend
  const product_id = req.body.product_id;
  const quantity = req.body.quantity;

  //If no quantity found
  if (!quantity) quantity = 1;

  //Find the product to be added to cart
  const foundProduct = await Product.findOne({
    _id: product_id
  }).populate("discount");

  //To find the current price
  if (foundProduct.discount.enabled) {
    if (foundProduct.discount.usePercentage) {
      var productPrice =
        parseFloat(foundProduct.sellingPrice) -
        parseFloat(
          (parseFloat(foundProduct.sellingPrice) *
            parseFloat(foundProduct.discount.discountPercent)) /
            100
        );
    } else {
      var productPrice =
        parseFloat(foundProduct.sellingPrice) -
        parseFloat(foundProduct.discount.discountAmount);
    }
  } else {
    var productPrice = parseFloat(foundProduct.sellingPrice);
  }

  // if (req.user) {
  //   //Get the user if logged in
  //   const user_id = req.user._id;

  //   //Find the user's cart
  //   const dcart = await Cart.findOne({ owner: user_id });

  //   console.log(dcart);
  // } else {
  // }

  //If there no cart do exist
  if (!req.session.cart) {
    //Create empty cart
    req.session.cart = [];

    //Set the lifetime of cart
    //req.session.cookie.maxAge = 20 * 60000;

    //Add product to cart
    req.session.cart.push({
      product_id: foundProduct._id,
      title: foundProduct.name,
      quantity: quantity,
      unitPrice: parseFloat(productPrice),
      price: parseFloat(productPrice) * parseFloat(quantity),
      image: foundProduct.image[0]
    });

    //console.log("hello");

    //Set the toatal cart price
    req.session.totalCartPrice =
      parseFloat(productPrice) * parseFloat(quantity);
  } else {
    //If there cart do exist

    //Set the lifetime of cart
    //req.session.cookie.maxAge = 20 * 60000;

    //Initialize existing cart
    var cart = req.session.cart;

    //Set product as new product.
    var newItem = true;

    //If the current product do exist in cart
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].product_id == foundProduct._id) {
        cart[i].product_id = foundProduct._id;
        cart[i].quantity = parseFloat(cart[i].quantity) + parseFloat(quantity);
        cart[i].unitPrice = parseFloat(productPrice);
        cart[i].price =
          parseFloat(cart[i].price) +
          parseFloat(productPrice) * parseFloat(quantity);

        //console.log("world");

        //Set total cart price
        req.session.totalCartPrice =
          parseFloat(req.session.totalCartPrice) +
          parseFloat(productPrice) * parseFloat(quantity);

        newItem = false;
        break;
      }
    }

    //console.log(req.session.totalCartPrice);

    //If current product is new product
    if (newItem) {
      //Set the lifetime of cart
      //req.session.cookie.maxAge = 20 * 60000;

      req.session.totalCartItem++;

      //Add product to cart
      cart.push({
        product_id: foundProduct._id,
        title: foundProduct.name,
        quantity: quantity,
        unitPrice: parseFloat(productPrice),
        price: parseFloat(productPrice) * parseFloat(quantity),
        image: foundProduct.image
      });

      //console.log("hi");

      //Set total cart price
      req.session.totalCartPrice =
        parseFloat(req.session.totalCartPrice) +
        parseFloat(productPrice) * parseFloat(quantity);
    }
  }
  if (req.session.returnTo) {
    req.flash("errors", "");
    req.flash("message", "Product is added to cart");
    res.redirect(req.session.returnTo);
    delete req.session.returnTo;
  } else {
    req.flash("errors", "");
    req.flash("message", "Product is added to cart");
    res.redirect("/");
  }
});

//Cart Update
router.get("/cart/update/:product_id", function(req, res, next) {
  var product_id = req.params.product_id;
  var cart = req.session.cart;
  var action = req.query.action;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].product_id == product_id) {
      switch (action) {
        case "increase":
          cart[i].quantity++;
          cart[i].price = parseFloat(cart[i].price) + parseFloat(cart[i].price);
          req.session.totalCartPrice =
            parseFloat(req.session.totalCartPrice) +
            parseFloat(cart[i].unitPrice);
          break;
        case "decrease":
          if (cart[i].quantity > 1) {
            cart[i].quantity--;
            cart[i].price =
              parseFloat(cart[i].price) - parseFloat(cart[i].price);
            req.session.totalCartPrice =
              parseFloat(req.session.totalCartPrice) -
              parseFloat(cart[i].unitPrice);
          }
          //console.log(req.session.totalCartPrice);
          break;
        case "remove":
          req.session.totalCartPrice =
            parseFloat(req.session.totalCartPrice) - parseFloat(cart[i].price);
          cart.splice(i, 1);
          if (cart.length == 0) {
            delete req.session.cart;
            req.session.totalCartPrice = 0;
          }
          //console.log(req.session.totalCartPrice);
          break;
        default:
          console.log("Cart update error");
          break;
      }
      break;
    }
  }
  res.redirect("/checkout");
});

//Clear Cart
router.get("/clear", function(req, res, next) {
  delete req.session.cart;
  res.redirect("/checkout");
});

//Checkout page
router.get("/checkout", function(req, res, next) {
  //For returning to same page
  req.session.returnTo = req.originalUrl;

  if (req.session.cart && req.session.cart.length == 0) {
    delete req.session.cart;
    res.redirect("/checkout");
  } else {
    res.render("main/checkoutReadyPage", {
      cart: req.session.cart
    });
  }
});

//Export router
module.exports = router;
