const router = require('express').Router();

//Product model import
var Product = require('../models/product');
var SessionCart = require('../models/sessionCart');

//Live model import
var Live = require('../models/live');

//New Cart with Model
// router.get('/add-to-cart/:product_id', function (req, res, next) {
    
//     var product_id = req.params.product_id;
//     var cart = new SessionCart(req.session.cart ? );

//     Product.findOne({_id: product_id})
//     .exec(function(err, foundProduct){
//         if(err) console.log(err);

//         Live.findOne({product_id: product_id}).exec(function(err, live){
//             if(err) console.log(err);

//             //console.log(live);
//             if(live.quantity > 0){







//                 if(!req.session.cart){
//                     req.session.cart = [];
//                     req.session.cart.push({
//                         product: foundProduct._id,
//                         title: foundProduct.name,
//                         quantity: 1,
//                         unitPrice: parseFloat(foundProduct.unitPrice),
//                         price: parseFloat(foundProduct.unitPrice),
//                         image: foundProduct.image
//                     });
//                     req.session.totalCartPrice = parseFloat(foundProduct.unitPrice);

//                     //Increment the live blockQuantity
//                     Live.findOneAndUpdate({product_id: product_id},
//                         {$inc: { blockQuantity: 1 }}, {new: true},function(err, newLive){
//                             if(err) return next(err);

//                             console.log(newLive);
//                         });
//                     //live.quantity--;
//                 }else{
//                     var cart = req.session.cart;
//                     var newItem = true;
        
//                     for(var i = 0; i < cart.length; i++){
//                         if(cart[i].title == foundProduct.name){
//                             cart[i].product = foundProduct._id;
//                             cart[i].quantity++;
//                             cart[i].unitPrice = parseFloat(foundProduct.unitPrice);
//                             cart[i].price = parseFloat(cart[i].price) + parseFloat(foundProduct.unitPrice);
//                             req.session.totalCartPrice = parseFloat(req.session.totalCartPrice) + parseFloat(foundProduct.unitPrice);
//                             newItem = false;
//                             break;
//                         }
//                     }
//                     //live.quantity--;
//                     //console.log(req.session.totalCartPrice);
//                     if(newItem){
//                         req.session.totalCartItem++ ;
//                         cart.push({
//                             product: foundProduct._id,
//                             title: foundProduct.name,
//                             quantity: 1,
//                             unitPrice: parseFloat(foundProduct.unitPrice),
//                             price: parseFloat(foundProduct.unitPrice),
//                             image: foundProduct.image
//                         });
//                         //live.quantity--;
//                         req.session.totalCartPrice = parseFloat(req.session.totalCartPrice) + parseFloat(foundProduct.unitPrice);
//                     }
//                 }
//                 //console.log(req.session.cart);
//                 //console.log(req.session.totalCartPrice);
//                 res.redirect('/product/'+req.params.product_id);
//             }else{
//                 //Show some message to customer that the product is out of stock
//                 req.flash('errors', 'This Product is out of stock');
//                 res.redirect('/product/'+req.params.product_id);
//             }
//         });

//     });
// });

//Product added to cart
router.get('/add-to-cart/:product_id', function (req, res, next) {
    
    var product_id = req.params.product_id;

    Product.findOne({_id: product_id})
    .exec(function(err, foundProduct){
        if(err) console.log(err);

        Live.findOne({product_id: product_id}).exec(function(err, live){
            if(err) console.log(err);

            //console.log(live);
            if(live.frontQuantity > 0){
                if(!req.session.cart){
                    req.session.cart = [];

                    //Set the lifetime of cart
                    req.session.cookie.maxAge = 20 * 60000 ;

                    req.session.cart.push({
                        product: foundProduct._id,
                        title: foundProduct.name,
                        quantity: 1,
                        unitPrice: parseFloat(foundProduct.unitPrice),
                        price: parseFloat(foundProduct.unitPrice),
                        image: foundProduct.image
                    });
                    req.session.totalCartPrice = parseFloat(foundProduct.unitPrice);
                    //Decrement the live frontQuantity
                    Live.findOneAndUpdate({product_id: foundProduct._id},
                        {$inc: { frontQuantity: -1 }}, {new: true},function(err, newLive){
                            if(err) return next(err);

                            //console.log(newLive);
                    });
                }else{
                    var cart = req.session.cart;
                    var newItem = true;
        
                    for(var i = 0; i < cart.length; i++){
                        if(cart[i].title == foundProduct.name){
                            cart[i].product = foundProduct._id;
                            cart[i].quantity++;
                            cart[i].unitPrice = parseFloat(foundProduct.unitPrice);
                            cart[i].price = parseFloat(cart[i].price) + parseFloat(foundProduct.unitPrice);
                            req.session.totalCartPrice = parseFloat(req.session.totalCartPrice) + parseFloat(foundProduct.unitPrice);
                            //Decrement the live frontQuantity
                            Live.findOneAndUpdate({product_id: foundProduct._id},
                                {$inc: { frontQuantity: -1 }}, {new: true},function(err, newLive){
                                    if(err) return next(err);

                                    console.log(newLive);
                            });
                            newItem = false;
                            break;
                        }
                    }
                    //live.quantity--;
                    //console.log(req.session.totalCartPrice);
                    if(newItem){
                        req.session.totalCartItem++ ;
                        cart.push({
                            product: foundProduct._id,
                            title: foundProduct.name,
                            quantity: 1,
                            unitPrice: parseFloat(foundProduct.unitPrice),
                            price: parseFloat(foundProduct.unitPrice),
                            image: foundProduct.image
                        });
                        req.session.totalCartPrice = parseFloat(req.session.totalCartPrice) + parseFloat(foundProduct.unitPrice);
                        //Decrement the live frontQuantity
                        Live.findOneAndUpdate({product_id: foundProduct._id},
                            {$inc: { frontQuantity: -1 }}, {new: true},function(err, newLive){
                                if(err) return next(err);

                                console.log(newLive);
                        });
                    }
                }
                //console.log(req.session.cart);
                //console.log(req.session.totalCartPrice);
                res.redirect('/product/'+req.params.product_id);
            }else{
                //Show some message to customer that the product is out of stock
                req.flash('errors', 'This Product is out of stock');
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
                    // Live.findOne({product_id: cart[i].product}).exec(function(err, live){
                    // });
                    if(cart[i].quantity < 2){
                            cart[i].quantity++;
                            cart[i].price = parseFloat(cart[i].price) + parseFloat(cart[i].price);
                            req.session.totalCartPrice = parseFloat(req.session.totalCartPrice) + parseFloat(cart[i].unitPrice);
                            //console.log(req.session.totalCartPrice);
                            //Decrement the live frontQuantity
                            Live.findOneAndUpdate({product_id: cart[i].product},
                                {$inc: { frontQuantity: -1 }}, {new: true},function(err, newLive){
                                    if(err) return next(err);
    
                                    //console.log(newLive);
                            });
                        }
                        //console.log(cart);
                    break;
                case "decrease":
                    if(cart[i].quantity > 1){
                        cart[i].quantity--;
                        cart[i].price = parseFloat(cart[i].price) - parseFloat(cart[i].price);
                        req.session.totalCartPrice = parseFloat(req.session.totalCartPrice) - parseFloat(cart[i].unitPrice);
                        //Increment the live frontQuantity
                        Live.findOneAndUpdate({product_id: cart[i].product},
                            {$inc: { frontQuantity: 1 }}, {new: true},function(err, newLive){
                                if(err) return next(err);

                                console.log(newLive);
                        });
                    }
                    console.log(req.session.totalCartPrice);
                    break;
                case "remove":
                    //Increment the live frontQuantity
                    Live.findOneAndUpdate({product_id: cart[i].product},
                        {$inc: { frontQuantity: cart[i].quantity }}, {new: true},function(err, newLive){
                            if(err) return next(err);

                            console.log(newLive);
                    });
                    req.session.totalCartPrice = parseFloat(req.session.totalCartPrice) - parseFloat(cart[i].price);
                    cart.splice(i, 1);
                    if(cart.length == 0){
                        delete req.session.cart;
                        req.session.totalCartPrice = 0;
                    }
                    console.log(req.session.totalCartPrice);
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

    //Product return to live
    var cart = req.session.cart;
    if(cart){
        for(var i = 0; i < cart.length; i++){
            //Increment the live frontQuantity
            Live.findOneAndUpdate({product_id: cart[i].product},
                {$inc: { frontQuantity: cart[i].quantity }}, {new: true},function(err, newLive){
                    if(err) return next(err);

                    console.log(newLive);
            });

        }
    }

    delete req.session.cart;
    res.redirect('/checkout');
});

//Product return to live
router.get('/return-to-live',function(req, res, next){
    //Product return to live
    //console.log(req.session.cookie.maxAge);
    // console.log(req.session);
    if(req.session.cookie.maxAge < 120000){
    var cart = req.session.cart;
    if(cart){
        for(var i = 0; i < cart.length; i++){
            
            //Increment the live frontQuantity
            Live.findOneAndUpdate({product_id: cart[i].product},
                {$inc: { frontQuantity: cart[i].quantity }}, {new: true},function(err, newLive){
                    if(err) res.send(err);

                    console.log(newLive);
            });

            //Remove cart
            delete req.session.cart;

            //Set Cookie
            req.session.cookie.maxAge = 0;

        }
        res.send({});

        // next();
    }
}else{
    res.send({});

    // next();
}
next();
});

//Export router
module.exports = router;