//  Author: Mohammad Jihad Hossain
//  Create Date: 02/01/2019
//  Modify Date: 06/08/2019
//  Description: Order controller file of ECL E-Commerce

//Library import
const router = require("express").Router();

//Model import
var Product = require("../models/product");

//Order page route
router.get("/confirm-order", function(req, res, next) {
  res.render("main/orderPage", { cart: req.session.cart });
});

//Export router
module.exports = router;
