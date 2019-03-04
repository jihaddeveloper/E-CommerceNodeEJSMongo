const router = require('express').Router();
const async = require('async');
const passportConfig = require('../config/passport');
var Product = require('../models/product');
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


//Order Success Page
router.get('/order-success', function(req, res, next){
    res.render('main/orderSuccessPage');
});

module.exports = router;