const router = require('express').Router();

var Product = require('../models/product');

//Pagination function
function paginate(req, res, next){
    //Paginate product page
    var perPage = 12;
    var page = req.params.page;

    Product.find()
    .skip( perPage*page )
    .limit( perPage )
    .populate('category')
    .exec(function(err, products){
        if(err) return next(err);
        Product.count().exec(function(err, count){
            if(err) return next(err);
            res.render('main/productMain', { products: products, pages: count/perPage });
        });
    });
}

//Home Route
router.get('/', function(req, res, next){
    if(req.user){
        paginate(req, res, next);
    }else{
        res.render('main/home');
    }
});

//Pages
router.get('/page/:page', function(req, res, next){
    paginate(req, res, next);
});

//About Route
router.get('/about', function(req, res, next){
    res.render('main/about');
});

//Products Route
router.get('/products/:id', function(req, res, next){
    Product
    .find({ category: req.params.id })
    .populate('category')
    .exec(function(err, products){
        if(err) return next(err);
        res.render('main/category', { products: products });
    }); 
});

//Single product route
router.get('/product/:id', function(req, res, next){
    Product.findById({ _id: req.params.id }, function(err, product){
        if(err) return next(err);
        res.render('main/product', {product: product});
    });
});

//Search product mapping
Product.createMapping(function(err, mapping){
    if(err) {
        console.log('Error in creating mapping');
        console.log(err);
    }else {
        console.log('Mapping created');
        console.log(mapping);
    }
});

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

//Search route
router.post('/search', function(req, res, next){
    res.redirect('/search?q=' + req.body.q);
});

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

module.exports = router;