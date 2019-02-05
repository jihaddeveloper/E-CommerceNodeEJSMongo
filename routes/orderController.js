const router = require('express').Router();

//Model import
var Product = require('../models/product');
var Order = require('../models/order');

//Order page route
router.get('/confirm-order', function(req, res, next){
    res.render('main/orderPage',{ cart: req.session.cart });
});

//Export router
module.exports = router;