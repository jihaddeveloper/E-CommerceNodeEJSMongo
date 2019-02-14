const router = require('express').Router();
const async = require('async');
const passportConfig = require('../config/passport');
var Product = require('../models/product');
var Cart = require('../models/cart');
var Review = require('../models/review');
const User = require('../models/user');
const CustomerOrder = require('../models/customerOrder');

//Product Filtering
var unique = require("array-unique");

//Stripe payment route form
router.get('/stripe-payment', passportConfig.isAuthenticated, function(req, res, next){

    //For returning to same page
    req.session.returnTo = req.originalUrl;

    res.render('main/paymentReady',{ cart: req.session.cart, totalCartPrice: req.session.totalCartPrice });
});

//Stripe Payment
router.post('/payment', passportConfig.isAuthenticated, function (req, res, next) {
    //For returning to same page
    req.session.returnTo = req.originalUrl;

    (async () => {

        var arr = [];

        req.session.cart.map((rs)=>{
        //console.log(rs.product)
            var obj = {};
            obj.product=rs.product;
            obj.quantity = rs.quantity;
            obj.unitPrice = rs.unitPrice;
            obj.price =rs.price;
            arr.push(obj)
        })
   
        var history = {
            date: new Date(),
            comment: 'Email body',
            status: 'New',
            customerNotified: 'Yes'
        }

        var customerOrder = new CustomerOrder({
            user: req.user,
            cart: arr,
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            paymentMethod: req.body.paymentMethod,
            paymentId: "abc",
            shippingCharge: req.body.shipCharge,
            history: history,
            totalAmount: req.body.finalTotalAmount,
    
        });

        customerOrder.save(function(err, order){
            if(err) return err;

            delete req.session.cart;
            req.session.totalCartPrice = 0;
            res.redirect('/order-success');
        });
    
    })();

    

});

// //Stripe payment route
// router.post('/stripe-payment', passportConfig.isAuthenticated, function (req, res, next) {
    
//     //For returning to same page
//     req.session.returnTo = req.originalUrl;

//     var cart = req.session.cart;

//     // Set your secret key: remember to change this to your live secret key in production
//     // See your keys here: https://dashboard.stripe.com/account/apikeys
//     var stripe = require("stripe")("sk_test_v6upa8MEdWolNaz3cThw8uoT");

//     // Token is created using Checkout or Elements!
//     // Get the payment token ID submitted by the form:
//     const token = req.body.stripeToken; // Using Express
    
//     (async () => {
//         const charge = await stripe.charges.create({
//           amount: req.session.totalCartPrice * 100,
//           currency: 'usd',
//           description: 'Example charge',
//           source: token,
//         }, function(err, charge){
//             //asynchronously called
//             if(err) return err;

//             var arr = []
//             req.session.cart.map((rs)=>{
//                 //console.log(rs.product)
        
//                 var obj = {};
//                 obj.product=rs.product;
//                 obj.quantity = rs.quantity;
//                 obj.unitPrice = rs.unitPrice;
//                 obj.price =rs.price;
//                 arr.push(obj)
//             })
           
            
//             var history = {
//                 date: new Date(),
//                 comment: 'Email body',
//                 status: 'New',
//                 customerNotified: 'Yes'
//             }

//             var customerOrder = new CustomerOrder({
//                 user: req.user,
//                 cart: arr,
//                 name: req.body.name,
//                 phone: req.body.phone,
//                 address: req.body.address,
//                 city: req.body.city,
//                 //division: req.body.division,
//                 paymentMethod: req.body.paymentMethod,
//                 paymentId: charge.id,
//                 //shippingCost: 100,
//                 history: history,
//                 totalAmount: req.session.totalCartPrice,
            
//             });

//             customerOrder.save(function(err, order){
//                 if(err) return err;

//                 delete req.session.cart;
//                 req.session.totalCartPrice = 0;
//                 res.redirect('/order-success');

//             });

//         });
//       })();

// });

//Order Success Page
router.get('/order-success', function(req, res, next){
    res.render('main/orderSuccessPage');
});

module.exports = router;