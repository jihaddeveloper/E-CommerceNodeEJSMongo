const router = require('express').Router();
const async = require('async');
const passportConfig = require('../config/passport');
var Product = require('../models/product');
var Review = require('../models/review');
const User = require('../models/user');


//Product Filtering
var unique = require("array-unique");

//For Stripe payment
const stripe = require('stripe')('sk_test_v6upa8MEdWolNaz3cThw8uoT');


//Pagination function
function paginate(req, res, next) {
    //Paginate product page
    var perPage = 3;
    var page = req.params.page;


    Product.find({
            isActive: true
        })
        .skip(perPage * page - page)
        .limit(perPage)
        .populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        })
        .populate('brand')
        .exec(function (err, products) {
            if (err) return next(err);
            //console.log(products);
            Product.count().exec(function (err, count) {
                if (err) return next(err);
                res.render('main/productMain', {
                    products: products,
                    pages: count / perPage,
                    message: '',
                    errors: req.flash('errors')
                });
            });
        });
}


//Home Route
router.get('/', function (req, res, next) {

    //For returning to same page
    req.session.returnTo = req.originalUrl;

    paginate(req, res, next);
});

//Home

//New Product
//Deals/Discount Product
//Top selled Product

//Pages
router.get('/page/:page', function (req, res, next) {
    paginate(req, res, next);
});

//About Route
router.get('/about', function (req, res, next) {
    res.render('main/about');
});


//Single product load
router.get('/product/:id', function (req, res, next) {

    req.session.returnTo = req.originalUrl;

    Product.findOne({
            _id: req.params.id
        })
        .populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        })
        .populate('brand')
        .populate('reviews.review')
        .exec(function (err, product) {

            if (err) return next(err);
            res.render('main/product', {
                product: product,
                features: product.features,
                message: '',
                errors: req.flash('errors')
            });
        });

});


//Product Features Filtering
get_array_of_obj = (unique_arr, feat) => {
    var last = [];
    var temp = [];
    for (var i = 0; i < unique_arr.length; i++) {

        for (var j = 0; j < feat.length; j++) {
            if (feat[j].label === unique_arr[i]) {
                temp.push(feat[j].value);
            }
        }
        var obj = '{"label":"' + unique_arr[i] + '","values":[';
        for (var n = 0; n < unique(temp).length; n++) {
            obj += '"' + unique(temp)[n] + '"';
            if (unique(temp).length - 1 > n) {
                obj += ",";
            }
        }
        obj += "]}";

        var jsn = JSON.parse(obj);

        last.push(jsn);
        temp = [];
    }
    return last;
};

//Category Filter Function
function categoryfilterpage(req, res, obj) {

    var resultArray = [];
    var array = [];
    var feat = [];

    var unique_arr = [];

    Product.find(obj)
        .populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        })
        .populate('brand')
        .populate('subcategory.category')
        .exec(function (err, docs) {

            if (err) {
                res.send(err);
            } else {
                for (var i = 0; i < docs.length; i++) {
                    for (var j = 0; j < docs[i].features.length; j++) {
                        array.push(docs[i].features[j].label);

                        feat.push(docs[i].features[j]);
                    }
                }
                unique_arr = unique(array);
                var last = get_array_of_obj(unique_arr, feat);
                for (var i = 0; i < docs.length; i += 3) {
                    resultArray.push(docs.slice(i, i + 3));
                }

                console.log(docs.length);

                res.render("main/category", {
                    title: "Products",
                    category: req.params.id,
                    products: resultArray,
                    dropdown_label: last,
                    number: last.length
                });
            }
        });
}



//Categorywise Products load
router.get('/products/category/:id', function (req, res, next) {

    req.session.returnTo = req.originalUrl;

    var obj = {
        category: req.params.id,
        isActive: true
    };
    categoryfilterpage(req, res, obj);
});


//Categorywise Products filtering
router.post('/products/category/filter/:id', (req, res, next) => {

    req.session.returnTo = req.originalUrl;

    var num1 = req.body.number;
    var sr = [];

    sr.push({
        category: req.params.id
    });
    if (req.body.brand != "0") {
        sr.push({
            brand: req.body.brand

        });
    }
    if (req.body.price != "0") {
        var array_range = req.body.price.split("-");
        sr.push({
            $and: [{
                    unitPrice: {
                        $gt: parseInt(array_range[0], 10)
                    }
                },
                {
                    unitPrice: {
                        $lt: parseInt(array_range[1], 10)
                    }
                }
            ]
        });
    }
    if (num1 > 0) {
        if (req.body.v0 != "0") {
            sr.push({
                "features.value": req.body.v0
            });
        }
        if (num1 > 1) {
            if (req.body.v1 != "0") {
                sr.push({
                    "features.value": req.body.v1
                });
            }
            if (num1 > 2) {
                if (req.body.v2 != "0") {
                    sr.push({
                        "features.value": req.body.v2
                    });
                }
                if (num1 > 3) {
                    if (req.body.v3 != "0") {
                        sr.push({
                            "features.value": req.body.v3
                        });
                    }
                    if (num1 > 4) {
                        if (req.body.v4 != "0") {
                            sr.push({
                                "features.value": req.body.v4
                            });
                        }
                        if (num1 > 5) {
                            if (req.body.v5 != "0") {
                                sr.push({
                                    "features.value": req.body.v5
                                });
                            }
                            if (num1 > 6) {
                                if (req.body.v6 != "0") {
                                    sr.push({
                                        "features.value": req.body.v6
                                    });
                                }
                                if (num1 > 7) {
                                    if (req.body.v7 != "0") {
                                        sr.push({
                                            "features.value": req.body.v7
                                        });
                                    }
                                    if (num1 > 8) {
                                        if (req.body.v8 != "0") {
                                            sr.push({
                                                "features.value": req.body.v8
                                            });
                                        }
                                        if (num1 > 9) {
                                            if (req.body.v9 != "0") {
                                                sr.push({
                                                    "features.value": req.body.v9
                                                });
                                            }
                                            if (num1 > 10) {
                                                if (req.body.v10 != "0") {
                                                    sr.push({
                                                        "features.value": req.body.v10
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    var brnd = [];
    var resultArray = [];

    Product.find({
            $and: sr
        })
        .populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        })
        .populate('brand')
        .exec(
            function (err, docs) {
                if (err) {
                    res.send(err);
                } else {
                    var feat = [];
                    var array = [];
                    for (var i = 0; i < docs.length; i++) {
                        for (var j = 0; j < docs[i].features.length; j++) {
                            array.push(docs[i].features[j].label);
                            feat.push(docs[i].features[j]);
                        }
                    }
                    unique_arr = unique(array);
                    var last = get_array_of_obj(unique_arr, feat);

                    for (var i = 0; i < docs.length; i += 3) {
                        resultArray.push(docs.slice(i, i + 3));
                    }

                    res.render("main/category", {
                        title: "Products",
                        category: req.params.id,
                        products: resultArray,
                        dropdown_label: last,
                        number: last.length
                    });
                }
            }
        );

});


//SubCategory Filter Function
function subCategoryFilterPage(req, res, obj) {

    var resultArray = [];
    var array = [];
    var feat = [];

    var unique_arr = [];

    Product.find(obj)
        .populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        })
        .populate('brand')
        .populate('subcategory.category')
        .exec(function (err, docs) {

            if (err) {
                res.send(err);
            } else {

                for (var i = 0; i < docs.length; i++) {
                    for (var j = 0; j < docs[i].features.length; j++) {
                        array.push(docs[i].features[j].label);

                        feat.push(docs[i].features[j]);
                    }
                }
                unique_arr = unique(array);
                var last = get_array_of_obj(unique_arr, feat);
                for (var i = 0; i < docs.length; i += 3) {
                    resultArray.push(docs.slice(i, i + 3));
                }

                res.render("main/subCategory", {
                    title: "Products",
                    subcategory: req.params.id,
                    products: resultArray,
                    dropdown_label: last,
                    number: last.length
                });
            }
        });
}


//SubCategory wise Products load
router.get('/products/subCategory/:id', function (req, res, next) {

    req.session.returnTo = req.originalUrl;

    var obj = {
        subcategory: req.params.id,
        isActive: true
    };
    subCategoryFilterPage(req, res, obj)

});

//Subcategorywise Products filtering.
router.post('/products/subCategory/filter/:id', (req, res, next) => {

    req.session.returnTo = req.originalUrl;

    var num1 = req.body.number;
    var sr = [];

    sr.push({
        subcategory: req.params.id
    });

    if (req.body.brand != "0") {
        sr.push({
            brand: req.body.brand

        });
    }
    if (req.body.price != "0") {
        var array_range = req.body.price.split("-");
        sr.push({
            $and: [{
                    unitPrice: {
                        $gt: parseInt(array_range[0], 10)
                    }
                },
                {
                    unitPrice: {
                        $lt: parseInt(array_range[1], 10)
                    }
                }
            ]
        });
    }
    if (num1 > 0) {
        if (req.body.v0 != "0") {
            sr.push({
                "features.value": req.body.v0
            });
        }
        if (num1 > 1) {
            if (req.body.v1 != "0") {
                sr.push({
                    "features.value": req.body.v1
                });
            }
            if (num1 > 2) {
                if (req.body.v2 != "0") {
                    sr.push({
                        "features.value": req.body.v2
                    });
                }
                if (num1 > 3) {
                    if (req.body.v3 != "0") {
                        sr.push({
                            "features.value": req.body.v3
                        });
                    }
                    if (num1 > 4) {
                        if (req.body.v4 != "0") {
                            sr.push({
                                "features.value": req.body.v4
                            });
                        }
                        if (num1 > 5) {
                            if (req.body.v5 != "0") {
                                sr.push({
                                    "features.value": req.body.v5
                                });
                            }
                            if (num1 > 6) {
                                if (req.body.v6 != "0") {
                                    sr.push({
                                        "features.value": req.body.v6
                                    });
                                }
                                if (num1 > 7) {
                                    if (req.body.v7 != "0") {
                                        sr.push({
                                            "features.value": req.body.v7
                                        });
                                    }
                                    if (num1 > 8) {
                                        if (req.body.v8 != "0") {
                                            sr.push({
                                                "features.value": req.body.v8
                                            });
                                        }
                                        if (num1 > 9) {
                                            if (req.body.v9 != "0") {
                                                sr.push({
                                                    "features.value": req.body.v9
                                                });
                                            }
                                            if (num1 > 10) {
                                                if (req.body.v10 != "0") {
                                                    sr.push({
                                                        "features.value": req.body.v10
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    var brnd = [];
    var resultArray = [];

    Product.find({
            $and: sr
        })
        .populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        })
        .populate('brand')
        .exec(
            function (err, docs) {
                if (err) {
                    res.send(err);
                } else {
                    var feat = [];
                    var array = [];
                    for (var i = 0; i < docs.length; i++) {
                        for (var j = 0; j < docs[i].features.length; j++) {
                            array.push(docs[i].features[j].label);
                            feat.push(docs[i].features[j]);
                        }
                    }
                    unique_arr = unique(array);
                    var last = get_array_of_obj(unique_arr, feat);

                    for (var i = 0; i < docs.length; i += 3) {
                        resultArray.push(docs.slice(i, i + 3));
                    }

                    res.render("main/subCategory", {
                        title: "Products",
                        subcategory: req.params.id,
                        products: resultArray,
                        dropdown_label: last,
                        number: last.length
                    });
                }
            }
        );
});


//Brand Filter Function
function brandFilterPage(req, res, obj) {

    var resultArray = [];
    var array = [];
    var feat = [];

    var unique_arr = [];

    Product.find(obj)
        .populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        })
        .populate('brand')
        .populate('subcategory.category')
        .exec(function (err, docs) {
            if (err) {
                res.send(err);
            } else {
                for (var i = 0; i < docs.length; i++) {
                    for (var j = 0; j < docs[i].features.length; j++) {
                        array.push(docs[i].features[j].label);

                        feat.push(docs[i].features[j]);
                    }
                }
                unique_arr = unique(array);
                var last = get_array_of_obj(unique_arr, feat);
                for (var i = 0; i < docs.length; i += 3) {
                    resultArray.push(docs.slice(i, i + 3));
                }

                res.render("main/brand", {
                    title: "Products",
                    brand: req.params.id,
                    products: resultArray,
                    dropdown_label: last,
                    number: last.length
                });
            }
        });
}


// Category, SubCategory, Brand wise Products load
router.get('/products/:category_id/:subcategory_id/:brand_id', function (req, res, next) {

    req.session.returnTo = req.originalUrl;

    var obj = {
        category: req.params.category_id,
        subcategory: req.params.subcategory_id,
        brand: req.params.brand_id,
        isActive: true
    };
    brandFilterPage(req, res, obj)
});

// Category, Brand wise Products load
router.get('/products/:category_id/:brand_id', function (req, res, next) {

    req.session.returnTo = req.originalUrl;

    var obj = {
        category: req.params.category_id,
        brand: req.params.brand_id,
        isActive: true
    };
    brandFilterPage(req, res, obj)
});


//Brand wise Products filtering
router.post('/products/brands/filter/:id', (req, res, next) => {

    req.session.returnTo = req.originalUrl;

    var num1 = req.body.number;
    var sr = [];


    if (req.body.brand != "0") {
        sr.push({
            brand: req.body.brand

        });
    }
    if (req.body.price != "0") {
        var array_range = req.body.price.split("-");
        sr.push({
            $and: [{
                    unitPrice: {
                        $gt: parseInt(array_range[0], 10)
                    }
                },
                {
                    unitPrice: {
                        $lt: parseInt(array_range[1], 10)
                    }
                }
            ]
        });
    }
    if (num1 > 0) {
        if (req.body.v0 != "0") {
            sr.push({
                "features.value": req.body.v0
            });
        }
        if (num1 > 1) {
            if (req.body.v1 != "0") {
                sr.push({
                    "features.value": req.body.v1
                });
            }
            if (num1 > 2) {
                if (req.body.v2 != "0") {
                    sr.push({
                        "features.value": req.body.v2
                    });
                }
                if (num1 > 3) {
                    if (req.body.v3 != "0") {
                        sr.push({
                            "features.value": req.body.v3
                        });
                    }
                    if (num1 > 4) {
                        if (req.body.v4 != "0") {
                            sr.push({
                                "features.value": req.body.v4
                            });
                        }
                        if (num1 > 5) {
                            if (req.body.v5 != "0") {
                                sr.push({
                                    "features.value": req.body.v5
                                });
                            }
                            if (num1 > 6) {
                                if (req.body.v6 != "0") {
                                    sr.push({
                                        "features.value": req.body.v6
                                    });
                                }
                                if (num1 > 7) {
                                    if (req.body.v7 != "0") {
                                        sr.push({
                                            "features.value": req.body.v7
                                        });
                                    }
                                    if (num1 > 8) {
                                        if (req.body.v8 != "0") {
                                            sr.push({
                                                "features.value": req.body.v8
                                            });
                                        }
                                        if (num1 > 9) {
                                            if (req.body.v9 != "0") {
                                                sr.push({
                                                    "features.value": req.body.v9
                                                });
                                            }
                                            if (num1 > 10) {
                                                if (req.body.v10 != "0") {
                                                    sr.push({
                                                        "features.value": req.body.v10
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    var brnd = [];
    var resultArray = [];

    Product.find({
            $and: sr
        })
        .populate({
            path: "subcategory",
            populate: {
                path: "category"
            }
        })
        .populate('brand')
        .exec(
            function (err, docs) {
                if (err) {
                    res.send(err);
                } else {
                    var feat = [];
                    var array = [];
                    for (var i = 0; i < docs.length; i++) {
                        for (var j = 0; j < docs[i].features.length; j++) {
                            array.push(docs[i].features[j].label);
                            feat.push(docs[i].features[j]);
                        }
                    }
                    unique_arr = unique(array);
                    var last = get_array_of_obj(unique_arr, feat);

                    for (var i = 0; i < docs.length; i += 3) {
                        resultArray.push(docs.slice(i, i + 3));
                    }

                    res.render("main/brand", {
                        title: "Products",
                        brand: req.params.id,
                        products: resultArray,
                        dropdown_label: last,
                        number: last.length
                    });
                }
            }
        );

});




//Custom Search 
//Search route
router.post('/search', function (req, res, next) {
    res.redirect('/search?q=' + req.body.q);
});

//Text making function 
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//Search function
router.get('/search', function (req, res, next) {
    if (req.query.q) {
        const regex = new RegExp(escapeRegex(req.query.q), 'gi');
        Product.find({
                $or: [{
                        "name": regex
                    },
                    {
                        "categoryName": regex
                    },
                    {
                        "subCategoryName": regex
                    },
                    {
                        "brandName": regex
                    },
                    {
                        "model": regex
                    },
                    {
                        "description": regex
                    }
                ],
            })
            .populate({
                path: "subcategory",
                populate: {
                    path: "category"
                }
            })
            .populate('brand')
            .exec(function (err, results) {
                if (err) return next(err);
                res.render('main/searchResult', {
                    query: req.query.q,
                    data: results
                });
            });
    } else {
        paginate(req, res, next);
    }
});
//Custom Search

//Cart view (Database)
router.get('/cart', function (req, res, next) {
    Cart.findOne({
            owner: req.user._id
        })
        .populate('items.item')
        .exec(function (err, foundCart) {
            if (err) return next(err);
            res.render('main/cart', {
                foundCart: foundCart,
                user: req.user,
                message: req.flash('remove')
            });
        });
});



//Procced to checkout
router.get('/procced-checkout', function (req, res, next) {
    if (!req.session.sessionCart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new SessionCart(req.session.sessionCart);
    res.render('main/checkoutPage', {
        totalPrice: cart.totalPrice
    });
});


//Payment Ready Page
router.post('/paymentReady', function (req, res, next) {

});

module.exports = router;