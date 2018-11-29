const router = require('express').Router();
const async = require('async');
const passportConfig = require('../config/passport');
var Product = require('../models/product');
var Cart = require('../models/cart');
var Review = require('../models/review');
const User = require('../models/user');

const stripe = require('stripe')('sk_test_v6upa8MEdWolNaz3cThw8uoT');


//Product mapping

var stream = Product.synchronize();
var count = 0;


stream.on('data',function() {
    count++;
})

stream.on('close',function() {
    console.log('Indexed ' + count + ' documents');
})

stream.on('err',function() {
    console.log(err);
})

Product.createMapping(function(err, mapping){
    if(err) {
        console.log('Error in creating mapping');
        console.log(err);
    }else {
        console.log('Mapping created');
        console.log(mapping);
    }
});


//Pagination function
function paginate(req, res, next){
    //Paginate product page
    var perPage = 9;
    var page = req.params.page;

    Product.find()
    .skip( perPage*page-page )
    .limit( perPage )
    .populate('category')
    .exec(function(err, products){
        if(err) return next(err);
        Product.count().exec(function(err, count){
            if(err) return next(err);
            res.render('main/productMain', { products: products, pages: count / perPage });
        });
    });
}









//Home Route
router.get('/', function(req, res, next){
    paginate(req, res, next);
});

//Pages
router.get('/page/:page', function(req, res, next){
    paginate(req, res, next);
});

//About Route
router.get('/about', function(req, res, next){
    res.render('main/about');
});

//Products Route home page
router.get('/products/:id', function(req, res, next){
    Product
    .find({ category: req.params.id })
    .populate('category')
    .populate('review')
    .exec(function(err, products){
        if(err) return next(err);
        res.render('main/category', { products: products });
    }); 
});

//Single product route
router.get('/product/:id', function(req, res, next){
    Product.findById({ _id: req.params.id })
    .populate('category')
    .deepPopulate('reviews.owner')
    .populate({ path:'reviews', populate: { path: 'reviews' }})
    .exec(function(err, product){
        if(err) return next(err);
        res.render('main/product', {product: product});
    });
});

//Single product route
// router.get('/product/:id', function(req, res, next){
//     Product.findById({ _id: req.params.id }, function(err, product){
//         if(err) return next(err);
//         res.render('main/product', {product: product});
//     });
// });


//Search route
router.post('/search', function(req, res, next){
    res.redirect('/search?q=' + req.body.q);
});



//Search
router.get('/search', function(req, res, next){
    if(req.query.q){
        Product.search({ query_string: { query: req.query.q } },
             function(err, results){
                 if(err) return next(err);
                 var data = results.hits.hits.map(function(hit){
                     return hit;
                 });
                 res.render('main/searchResult', {
                     query: req.query.q,
                     data: data
                 });
             });
    }
});

//Cart view
router.get('/cart', function(req, res, next){
    Cart.findOne({ owner: req.user._id })
    .populate('items.item')
    .exec(function(err, foundCart){
        if(err) return next(err);
        res.render('main/cart', { foundCart: foundCart, message: req.flash('remove') } );
    });
});

//Product added to cart
router.post('/product/:product_id', function(req, res, next){
    Cart.findOne({ owner: req.user._id }, function(err, cart){
        cart.items.push({ 
            item: req.body.product_id,
            price: parseFloat(req.body.priceValue),
            quantity: parseInt(req.body.quantity)
         });

         cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);

         cart.save(function(err){
             if(err) return next(err);
             return res.redirect('/product/'+ req.body.product_id);
         });
    });
});

//Product remove from cart
router.post('/remove', function(req, res, next){
    Cart.findOne({ owner: req.user._id }, function(err, foundCart){
        foundCart.items.pull(String(req.body.item));
        foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);

        foundCart.save(function(err, found){
            if(err) return next(err);
            req.flash('remove', 'Successfully removed');
            res.redirect('/cart');
        });
    });
});


//Post review to product
router.post('/add-review', passportConfig.isAuthenticated, function(req, res, next){
    User.findOne({ _id: req.user._id }, function(err, user) {
        if(err) return next(err);

        Product.findOne({ _id: req.body.product_id }, function(err, product){
            if(err) return next(err);

            let review = new Review();

            review.owner = req.user._id;
            if(req.body.title) review.title = req.body.title;
            if(req.body.description) review.description = req.body.description;
            review.rating = req.body.rating;

            product.reviews.push(review._id);
            product.save();

            review.save(function(err, newReview){
                if(err) return next(err);
                req.flash('success', 'Successfully added Review');
                return res.redirect('/add-review');
            });
        });

    });
});


//Payment Route
router.post('/payment', function(req, res, next){
    var stripeToken = req.body.stripeToken;
    var currentCharges = Math.round(req.body.stripeMoney * 100);

    stripe.customers.create({
        source: stripeToken,
    }).then(function(customer){
        return stripe.charges.create({
            amount: currentCharges,
            currency: 'usd',
            customer: customer.id
        });
    });

    res.redirect('/profile');
});

module.exports = router;