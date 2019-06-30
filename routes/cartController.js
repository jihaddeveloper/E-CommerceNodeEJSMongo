//  Author: Mohammad Jihad Hossain
//  Create Date: 02/01/2019
//  Modify Date: 12/06/2019
//  Description: Cart controller for all routes of Cart project for ECL E-Commerce

//Import router
const router = require("express").Router();

//Passport import
const passportConfig = require("../config/passport");

//Product model import
const Product = require("../models/product");

//Product added to cart
router.post("/add-to-cart", async function(req, res, next) {
  //Read from frontend
  const product_id = req.body.product_id;
  const quantity = req.body.quantity;

  if (req.user) {
  } else {
  }
  //If no quantity found
  if (!quantity) quantity = 1;

  const foundProduct = await Product.findOne({
    _id: product_id
  });

  //If there no cart do exist
  if (!req.session.cart) {
    //Create empty cart
    req.session.cart = [];

    //Set the lifetime of cart
    //req.session.cookie.maxAge = 20 * 60000;

    //Add product to cart
    req.session.cart.push({
      product: foundProduct._id,
      title: foundProduct.name,
      quantity: quantity,
      unitPrice: parseFloat(foundProduct.sellingPrice),
      price: parseFloat(foundProduct.sellingPrice) * quantity,
      image: foundProduct.image[0]
    });

    //console.log("hello");

    //Set the toatal cart price
    req.session.totalCartPrice = parseFloat(foundProduct.sellingPrice);
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
      if (cart[i].product == foundProduct._id) {
        cart[i].product = foundProduct._id;
        cart[i].quantity++;
        cart[i].unitPrice = parseFloat(foundProduct.sellingPrice);
        cart[i].price =
          parseFloat(cart[i].price) + parseFloat(foundProduct.sellingPrice);

        //console.log("world");

        //Set total cart price
        req.session.totalCartPrice =
          parseFloat(req.session.totalCartPrice) +
          parseFloat(foundProduct.sellingPrice);

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
        product: foundProduct._id,
        title: foundProduct.name,
        quantity: quantity,
        unitPrice: parseFloat(foundProduct.sellingPrice),
        price: parseFloat(foundProduct.sellingPrice) * quantity,
        image: foundProduct.image
      });

      //console.log("hi");

      //Set total cart price
      req.session.totalCartPrice =
        parseFloat(req.session.totalCartPrice) +
        parseFloat(foundProduct.sellingPrice);
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

//Cart Update
router.get("/cart/update/:product", function(req, res, next) {
  var product = req.params.product;
  var cart = req.session.cart;
  var action = req.query.action;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].title == product) {
      switch (action) {
        case "increase":
          if (cart[i].quantity < 5) {
            cart[i].quantity++;
            cart[i].price =
              parseFloat(cart[i].price) + parseFloat(cart[i].price);
            req.session.totalCartPrice =
              parseFloat(req.session.totalCartPrice) +
              parseFloat(cart[i].unitPrice);
            //console.log(req.session.totalCartPrice);
          }
          //console.log(cart);
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

//Export router
module.exports = router;
