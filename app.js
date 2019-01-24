const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const path = require('path');
const async = require('async');

const app = express();



const secret = require('./config/secret');
var cartLength = require('./middlewares/cartLengthMiddleware');

//Models
var Category = require('./models/category');
var SubCategory = require('./models/subCategory');
var Brand = require('./models/brand');
var Order = require('./models/order');
var Review = require('./models/review');
var Tax = require('./models/tax');
var User = require('./models/user');
var Cart = require('./models/cart');
var Product = require('./models/product');
var Discount = require('./models/discount');
var PaymentMethod = require('./models/paymentMethod');
var Supplier = require('./models/supplier');
var SessionCart = require('./models/sessionCart');
var Feature = require('./models/feature');
var Live = require('./models/live');
var Inventory = require('./models/live');



//MongoDB Connection
mongoose.connect(secret.database, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Conntected to MongoDB');
    }
});

//Middelwire
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

//Session Configuration
app.use(session({
    cookie: {
        maxAge: 24 * 60 * 60000
        // hours*mins*miliseconds
    },
    resave: false,
    saveUninitialized: false,
    secret: secret.secretKey,
    store: new MongoStore({
        mongooseConnection: secret.database,
        url: secret.database,
        autoReconnect: true
    })
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());



//Flash Masseges
app.use(flash());





//View engine
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');



//User 
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

//Cart length
app.use(cartLength);


//Category load
app.use(function (req, res, next) {
    var sub_arr = [];
    Category.find()
    .populate('subCategories')
    .populate('brands')
    .populate({
        path: "subCategories",
        populate: {
            path: "brands"
        }
    }).exec(function(err, categories){
        res.locals.categories = categories;
        next();
    })
});


//SubCategory load
app.use(function (req, res, next) {
    SubCategory.find({}, function (err, subCategories) {
        if (err) return next(err);
        res.locals.subCategories = subCategories;
        next();
    });
});

//Brand load
app.use(function (req, res, next) {
    Brand.find({}, function (err, brands) {
        if (err) return next(err);
        res.locals.brands = brands;
        next();
    });
});

//Cart Items Modal view
app.use(function (req, res, next) {
    if (req.user) {
        var id = req.user._id;
        Cart.findOne({
                owner: id
            })
            .populate('items.item')
            .exec(function (err, userCart) {
                if (err) return next(err);
                res.locals.userCart = userCart;
                res.locals.userCartTotalAmount = userCart.total;
                next();
            });
    } else {
        res.locals.userCart = null;
        res.locals.userCartTotalAmount = 0;
        next();
    }
});

//Make Seesion avaiable to every page
app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

// //Session cart items modal view
// app.use(function(req, res, next){
//     if(!req.session.sessionCart){
//         res.locals.sessionCartModal = null;
//     }else{
//         var newsessionCart = new SessionCart(req.session.sessionCart);
//         res.locals.sessionCartModal = newsessionCart.generateArray();
//     }
// });


//Controllers Import
var mainCon = require('./routes/mainController');
var userCon = require('./routes/userController');
var adminCon = require('./routes/adminController');
var apiCon = require('./api/api');


//Routes
app.use(mainCon);
app.use(userCon);
app.use(adminCon);
app.use('/api', apiCon);


app.listen(secret.port, function (err) {
    if (err) throw err;
    console.log('Server is Running on http://127.0.0.1:5000/');
})