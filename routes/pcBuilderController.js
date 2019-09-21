//  Author: Mohammad Jihad Hossain
//  Create Date: 02/01/2019
//  Modify Date: 05/08/2019
//  Description: PCBuilder controller file of ECL E-Commerce

//Library import
const express = require("express");
const router = require("express").Router();
const async = require("async");
const passportConfig = require("../config/passport");

//Model import
const Product = require("../models/product");
const Review = require("../models/review");
const User = require("../models/user");

//Load PC Builder page
router.get("/pc-builder", function(req, res, next) {
  //For returning to same page
  req.session.returnTo = req.originalUrl;

  res.render("main/pcBuilder", {
    message: "",
    errors: req.flash("errors")
  });
});

//Product added to PCBuilder
router.get("/add-to-pcBuilder/:product_id", function(req, res, next) {
  var product_id = req.params.product_id;

  Product.findOne({
    _id: product_id
  }).exec(function(err, foundProduct) {
    if (err) console.log(err);

    if (!foundProduct.isActive) {
      //Show some message to customer that the product is out of stock
      req.flash("errors", "This Product is out of stock");
      if (req.session.returnTo) {
        res.redirect(req.session.returnTo);
        delete req.session.returnTo;
      } else {
        res.redirect("/pc-builder");
      }
    } else {
      if (foundProduct.isActive) {
        if (!req.session.pcBuilder) {
          //Initalize the pcbuilder and totalprice
          req.session.pcBuilder = [];
          req.session.pcBuilderTotalPrice = 0;

          req.session.pcBuilder.push({
            product_id: foundProduct._id,
            title: foundProduct.name,
            quantity: 1,
            unitPrice: parseFloat(foundProduct.sellingPrice),
            image: foundProduct.image[0]
          });
          req.session.pcBuilderTotalPrice = parseFloat(
            foundProduct.sellingPrice
          );
        } else {
          var pcBuilder = req.session.pcBuilder;
          var newItem = true;

          for (var i = 0; i < pcBuilder.length; i++) {
            if (pcBuilder[i].product_id == foundProduct._id) {
              newItem = false;
              //console.log('Hey there');
              break;
            }
          }
          if (newItem) {
            pcBuilder.push({
              product_id: foundProduct._id,
              title: foundProduct.name,
              quantity: 1,
              unitPrice: parseFloat(foundProduct.sellingPrice),
              image: foundProduct.image[0]
            });
            req.session.pcBuilderTotalPrice =
              parseFloat(req.session.pcBuilderTotalPrice) +
              parseFloat(foundProduct.sellingPrice);
          }
        }
        if (req.session.returnTo) {
          res.redirect(req.session.returnTo);
          //console.log('world');
          delete req.session.returnTo;
        } else {
          //console.log('Hello');
          res.redirect("/pc-builder");
        }
      } else {
        //Show some message to customer that the product is out of stock
        req.flash("errors", "This Product is out of stock");
        res.redirect("/pc-builder");
      }
    }
  });
});

//Product remove from PCBuilder
router.get("/pcBuilder/remove/:product_id", function(req, res, next) {
  var product = req.params.product_id;
  var pcBuilder = req.session.pcBuilder;

  for (var i = 0; i < pcBuilder.length; i++) {
    req.session.pcBuilderTotalPrice =
      parseFloat(req.session.pcBuilderTotalPrice) -
      parseFloat(pcBuilder[i].unitPrice);
    pcBuilder.splice(i, 1);
    if (pcBuilder.length == 0) {
      delete req.session.pcBuilder;
      req.session.pcBuilderTotalPrice = 0;
    }
  }
  res.redirect("/pc-builder");
});

module.exports = router;
