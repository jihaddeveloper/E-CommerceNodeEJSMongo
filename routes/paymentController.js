//  Author: Mohammad Jihad Hossain
//  Create Date: 02/01/2019
//  Modify Date: 23/06/2019
//  Description: Payment controller of ECL E-Commerce

//Library import
const router = require("express").Router();
const async = require("async");
const randomString = require("randomstring");
const passportConfig = require("../config/passport");
var Product = require("../models/product");
var Review = require("../models/review");
const User = require("../models/user");
const CustomerOrder = require("../models/customerOrder");
const ejs = require("ejs");
const fs = require("fs");
const ejsmate = require("ejs-mate");
const Invoice = require("../models/invoice");

//Mail Sender
const mailer = require("../misc/mailer");

//Product Filtering
var unique = require("array-unique");

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

//Stripe payment route form
router.get("/payment", passportConfig.isAuthenticated, async function(
  req,
  res,
  next
) {
  //For returning to same page
  req.session.returnTo = req.originalUrl;

  //Find user for existing shipping address
  var user = await User.findOne({ _id: req.user.id });

  res.render("main/shippingAddress", {
    cart: req.session.cart,
    totalCartPrice: req.session.totalCartPrice,
    shippingAddress: user.shippingAddress[0]
  });
});

// Payment
router.post("/payment", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  //For returning to same page
  req.session.returnTo = req.originalUrl;

  (async () => {
    //Save new shipping address to user
    //Find the current user
    const user = await User.findOne({ _id: req.user._id });

    //Set shipping address
    var shippingAddress = {
      shippingAddressName: req.body.shippingAddressName,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      shippingAddressCity: req.body.shippingAddressCity,
      shippingAddressDistrict: req.body.shippingAddressDistrict,
      shippingAddressDivision: req.body.shippingAddressDivision,
      shippingAddressPostalCode: req.body.shippingAddressPostalCode,
      shippingAddressCountry: req.body.shippingAddressCountry,
      shippingAddressPhone: req.body.shippingAddressPhone
    };

    // //Set shipping address to user
    // await user.shippingAddress.push(shippingAddress);

    // //Save user with new shipping address
    // user.save();

    //Save user with new shipping address
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $push: { shippingAddress: shippingAddress } },
      { safe: true, upsert: true }
    );

    //Get the cart items
    var arr = [];
    req.session.cart.map(rs => {
      //console.log(rs.product)
      var obj = {};
      obj.product = rs.product;
      obj.quantity = rs.quantity;
      obj.unitPrice = rs.unitPrice;
      obj.price = rs.price;
      arr.push(obj);
    });

    //Set history object
    var history = {
      date: new Date(),
      comment: "Email body",
      status: "New",
      customerNotified: "Yes"
    };

    //customer order id
    let orderId = user.email + randomString.generate();
    //Total cart price
    let totalAmount = parseFloat(req.session.totalCartPrice);

    //Invoice id
    let invoiceId = randomString.generate();

    //Set order objetc
    var customerOrder = new CustomerOrder({
      orderId: orderId,
      user: req.user,
      cart: arr,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress,
      paymentMethod: req.body.paymentMethod,
      paymentId: "abc",
      shippingCharge: req.body.shipCharge,
      history: history
    });

    //Save the customer order
    await customerOrder.save(function(err, order) {
      if (err) return console.log(err);

      //Generate new invoice
      var newInvoice = new Invoice({
        invoiceId: invoiceId,
        user: req.user._id,
        order: order._id
      });

      //Save the invoice
      newInvoice.save();
    });

    //Generate invoice object

    //Generating the email body html
    ejs.renderFile(
      __dirname + "/emailTemplate/invoice.ejs",
      {
        cart: req.session.cart,
        user: user,
        orderId: orderId,
        invoiceId: invoiceId,
        paymentMethod: req.body.paymentMethod,
        shippingAddress: shippingAddress,
        totalCartPrice: req.session.totalCartPrice
      },
      function(err, invoiceBody) {
        if (err) {
          console.log(err);
        } else {
          //Mail sending
          mailer.sendEmail(
            '"Md Jihad Hossain" <devtestjihad@gmail.com>', //Sender
            user.email, // Receiver
            "Primary Invoice", //Subject
            invoiceBody //Mail body
          );
        }
      }
    );

    //Delete the cart
    delete req.session.cart;

    //Set total price 0
    req.session.totalCartPrice = 0;

    //Redirect to success page
    res.redirect("/order-success");
  })();
});

//Order Success Page
router.get("/order-success", function(req, res, next) {
  res.render("main/orderSuccessPage");
});

module.exports = router;
