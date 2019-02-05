const router = require('express').Router();

//Product model import
var Product = require('../models/product');

//Live model import
var Live = require('../models/live');

//Product added to cart
router.get('/add-to-cart/:product_id', function (req, res, next) {
    
    var product_id = req.params.product_id;

    Product.findOne({_id: product_id})
    .exec(function(err, foundProduct){
        if(err) console.log(err);

        Live.findOne({product_id: product_id}).exec(function(err, live){
            if(err) console.log(err);

            console.log(live);
            if(live.quantity > 0){
                if(!req.session.cart){
                    req.session.cart = [];
                    req.session.cart.push({
                        product: foundProduct,
                        title: foundProduct.name,
                        quantity: 1,
                        unitPrice: parseFloat(foundProduct.unitPrice),
                        price: parseFloat(foundProduct.unitPrice),
                        image: foundProduct.image
                    });
                }else{
                    var cart = req.session.cart;
                    var newItem = true;
        
                    for(var i = 0; i < cart.length; i++){
                        if(cart[i].title == foundProduct.name){
                            cart[i].product = foundProduct;
                            cart[i].quantity++;
                            cart[i].unitPrice = parseFloat(foundProduct.unitPrice);
                            cart[i].price = parseFloat(cart[i].price) + parseFloat(foundProduct.unitPrice);
                            req.session.totalCartPrice = parseFloat(cart[i].price) + parseFloat(foundProduct.unitPrice);
                            newItem = false;
                            break;
                        }
                    }
        
                    if(newItem){
                        req.session.totalCartItem++ ;
                        req.session.totalCartPrice += parseFloat(foundProduct.unitPrice);
                        cart.push({
                            product: foundProduct,
                            title: foundProduct.name,
                            quantity: 1,
                            unitPrice: parseFloat(foundProduct.unitPrice),
                            price: parseFloat(foundProduct.unitPrice),
                            image: foundProduct.image
                        });
                    }
                }
                //console.log(req.session.cart);
                res.redirect('/product/'+req.params.product_id);
            }
        });

    });
});


//Checkout page
router.get('/checkout', function(req, res, next){

    if(req.session.cart && req.session.cart.length == 0){
        delete req.session.cart;
        res.redirect('/checkout');
    }else{
        res.render('main/checkoutPage',{ cart: req.session.cart });
    }
});

//Cart Update
router.get('/cart/update/:product', function(req, res, next){
    var product = req.params.product;
    var cart = req.session.cart;
    var action = req.query.action;

    for(var i = 0; i < cart.length; i++){
        if(cart[i].title == product) {
            switch(action){
                case "increase":
                    if(cart[i].quantity < 5){
                        cart[i].quantity++;
                        cart[i].price = parseFloat(cart[i].price) + parseFloat(cart[i].price);
                    }
                    break;
                case "decrease":
                    cart[i].quantity--;
                    cart[i].price = parseFloat(cart[i].price) - parseFloat(cart[i].price);
                    if(cart[i].quantity < 1) cart.splice(i, 1);
                    break;
                case "remove":
                    cart.splice(i, 1);
                    if(cart.length == 0) delete req.session.cart;
                    break;
                default:
                    console.log('Cart update error');
                    break;
            }
            break;
        }
    }
    res.redirect('/checkout');
});

//Clear Cart
router.get('/clear', function(req, res, next){
    delete req.session.cart;
    res.redirect('/checkout');
});

//Export router
module.exports = router;