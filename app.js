//  Author: Mohammad Jihad Hossain
//  Create Date: 02/01/2019
//  Modify Date: 01/09/2019
//  Description: Main entry file for rest api project for ECL E-Commerce

//  Library import
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const path = require("path");
const async = require("async");
const cors = require("cors");

//Passport config
require("./config/passport");

//Main Application
const app = express();

//Loading secret keys
const secret = require("./config/secret");

//To make accessable the API to other application
app.use(
  cors()
  //   {
  //   origin: "http://localhost:3000",
  //   credentials: true
  // }
);

//Models
const Category = require("./models/category");
const SubCategory = require("./models/subCategory");
const Brand = require("./models/brand");
const Review = require("./models/review");
const Tax = require("./models/tax");
const User = require("./models/user");
const Product = require("./models/product");
const Discount = require("./models/discount");
const PaymentMethod = require("./models/paymentMethod");
const Supplier = require("./models/supplier");
const Feature = require("./models/feature");
const WishList = require("./models/wishList");
const Cart = require("./models/cart");
const SecondHandProduct = require("./models/secondHandProduct");
const SecondHandProductCategory = require("./models/secondHandProductCategory");
const SecondHandProductSubCategory = require("./models/secondHandProductSubCategory");
const SecondHandProductBrand = require("./models/secondHandProductBrand");
const Specification = require("./models/specification");
const Faq = require("./models/faq");
const Test = require("./models/test");

//MongoDB Connection
mongoose.connect(secret.database, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Conntected to MongoDB");
  }
});

//Middelwire
//Set Static folder
app.use(express.static(__dirname + "/public"));

//To see what route is excuted
app.use(morgan("dev"));

//To get input data from form or URL
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

//For cookie
app.use(cookieParser());

//Session Configuration
app.use(
  session({
    cookie: {
      // year*day*hour*min*sec*milisecond
      maxAge: 1 * 1 * 24 * 60 * 60 * 1000, // maxage setted to 24 hours
      expires: new Date(Date.now() + 1 * 1 * 24 * 60 * 60 * 1000),
      httpOnly: true
    },
    resave: false,
    saveUninitialized: false,
    secret: secret.secretKey,
    store: new MongoStore({
      mongooseConnection: secret.database,
      url: secret.database,
      autoReconnect: true
    })
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Flash Masseges
app.use(flash());
app.use(function(req, res, next) {
  res.locals.message = req.flash("message");
  res.locals.errors = req.flash("errors");
  next();
});

//View engine
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

//User
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

//Cart
app.get("*", function(req, res, next) {
  res.locals.cart = req.session.cart;
  res.locals.totalCartItem = req.session.totalCartItem;
  res.locals.totalCartPrice = req.session.totalCartPrice;
  next();
});

//For Store Product
//Category load
app.use(function(req, res, next) {
  var sub_arr = [];
  Category.find({ enabled: true })
    .populate("subCategories")
    .populate("brands")
    .populate({
      path: "subCategories",
      populate: {
        path: "brands"
      }
    })
    .exec(function(err, categories) {
      res.locals.categories = categories;
      next();
    });
});

//SubCategory load
app.use(function(req, res, next) {
  SubCategory.find({ enabled: true }, function(err, subCategories) {
    if (err) return next(err);
    res.locals.subCategories = subCategories;
    next();
  });
});

//Brand load
app.use(function(req, res, next) {
  Brand.find({ enabled: true }, function(err, brands) {
    if (err) return next(err);
    res.locals.brands = brands;
    next();
  });
});

//For Second Hand Product
//Category load
app.use(function(req, res, next) {
  var sub_arr = [];
  SecondHandProductCategory.find({ enabled: true })
    .populate("secondHandProductSubCategories")
    .exec(function(err, secondHandProductCategories) {
      res.locals.secondHandProductCategories = secondHandProductCategories;
      next();
    });
});

//Sub Category load
app.use(function(req, res, next) {
  SecondHandProductSubCategory.find({ enabled: true }, function(
    err,
    secondHandProductSubCategories
  ) {
    if (err) return next(err);
    res.locals.secondHandProductSubCategories = secondHandProductSubCategories;
    next();
  });
});

//Brand load
app.use(function(req, res, next) {
  SecondHandProductBrand.find({ enabled: true }, function(
    err,
    secondHandProductBrands
  ) {
    if (err) return next(err);
    res.locals.secondHandProductBrands = secondHandProductBrands;
    next();
  });
});

//Make Seesion avaiable to every page
app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.cart = req.session.cart;
  res.locals.pcBuilder = req.session.pcBuilder;
  res.locals.pcBuilderTotalPrice = req.session.pcBuilderTotalPrice;
  next();
});

//PC Builder
//Load All Mother Board
app.use(function(req, res, next) {
  Product.find(
    {
      category: "5d47d056b044e60004c90115",
      subcategory: "5d47d0b8b044e60004c9011c",
      isActive: true
    },
    function(err, allMotherBoard) {
      if (err) return next(err);
      res.locals.allMotherBoard = allMotherBoard;
      next();
    }
  );
});

//Load All Processor
app.use(function(req, res, next) {
  Product.find(
    {
      category: "5d47d056b044e60004c90115",
      subcategory: "5c7664545db0ec00044cac7b",
      isActive: true
    },
    function(err, allCPU) {
      if (err) return next(err);
      res.locals.allCPU = allCPU;
      next();
    }
  );
});

//Load All RAM
app.use(function(req, res, next) {
  Product.find(
    {
      category: "5d47d056b044e60004c90115",
      subcategory: "5d47d633b044e60004c9017b",
      isActive: true
    },
    function(err, allRAM) {
      if (err) return next(err);
      res.locals.allRAM = allRAM;
      next();
    }
  );
});

//Load All HDD
app.use(function(req, res, next) {
  Product.find(
    {
      category: "5d47d32fb044e60004c9013a",
      subcategory: "5d47d34db044e60004c9013b",
      isActive: true
    },
    function(err, allHDD) {
      if (err) return next(err);
      res.locals.allHDD = allHDD;
      next();
    }
  );
});

//Load All Casing
app.use(function(req, res, next) {
  Product.find(
    {
      category: "5c7664485db0ec00044cac7a",
      subcategory: "5c85ed38e8d2040004b4ea0f",
      isActive: true
    },
    function(err, allCasing) {
      if (err) return next(err);
      res.locals.allCasing = allCasing;
      next();
    }
  );
});

//Load All Keyboard
app.use(function(req, res, next) {
  Product.find(
    {
      category: "5c76728b5db0ec00044cad01",
      subcategory: "5c7a33595e0337000400991e",
      isActive: true
    },
    function(err, allKeyboard) {
      if (err) return next(err);
      res.locals.allKeyboard = allKeyboard;
      next();
    }
  );
});
//PC Builder

//Controllers Import
const mainCon = require("./routes/mainController");
const userCon = require("./routes/userController");
const adminCon = require("./routes/adminController");
const apiCon = require("./api/api");
const cartCon = require("./routes/cartController");
const orderCon = require("./routes/orderController");
const stripeCon = require("./routes/paymentController");
const pcBuilderCon = require("./routes/pcBuilderController");
const wishListCon = require("./routes/wishListController");
const secHandProductCon = require("./routes/secondHandProductController");
const filterCon = require("./routes/filterController");
const reviewCon = require("./routes/reviewController");
const faqCon = require("./routes/faqController");
const testCon = require("./routes/testController");

//Routes
app.use(mainCon);
app.use(userCon);
app.use(adminCon);
app.use("/api", apiCon);
app.use(cartCon);
app.use(orderCon);
app.use(stripeCon);
app.use(pcBuilderCon);
app.use(wishListCon);
app.use(secHandProductCon);
app.use(filterCon);
app.use(reviewCon);
app.use(faqCon);
app.use(testCon);

app.listen(secret.port, function(err) {
  if (err) throw err;
  console.log("Server is Running on http://127.0.0.1:3000/");
});
