//  Author: Mohammad Jihad Hossain
//  Create Date: 11/07/2019
//  Modify Date: 29/07/2019
//  Description: SecondHandProduct controller file of ECL E-Commerce

//Library import
const router = require("express").Router();
const async = require("async");
const passport = require("passport");
const passportConfig = require("../config/passport");
const secretConfig = require("../config/secret");
const randomString = require("randomstring");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

//Image saving library
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const path = require("path");
const crypto = require("crypto");

//Model import
const User = require("../models/user");
const SecondHandProduct = require("../models/secondHandProduct");
const SecondHandProductCategory = require("../models/secondHandProductCategory");
const SecondHandProductSubCategory = require("../models/secondHandProductSubCategory");
const SecondHandProductBrand = require("../models/secondHandProductBrand");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//Import secret file
const secret = require("../config/secret");

//Second-hand product selling for customer

//Add Category
router.get("/add-category", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  res.render("accounts/addCategory", {
    message: req.flash("success"),
    errors: ""
  });
});

router.post("/add-category", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  //New category obeject
  var category = new SecondHandProductCategory();

  category.name = req.body.category;

  category.save(function(err) {
    if (err) return next(err);
    req.flash("success", "Successfully added a category");
    return res.redirect("/add-category");
  });
});

//Add Sub Category
router.get("/add-subcategory", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  res.render("accounts/addSubCategory", {
    message: req.flash("success"),
    errors: ""
  });
});

router.post("/add-subcategory", passportConfig.isAuthenticated, async function(
  req,
  res,
  next
) {
  (async () => {
    //Input read from frontend
    var categoryId = req.body.category;
    var subcategoryname = req.body.subcategory;

    //New subcategory object
    var subcategory = new SecondHandProductSubCategory();

    //Set values to object
    subcategory.name = subcategoryname;
    subcategory.secondHandProductCategory = categoryId;

    //Save new subcategory
    await subcategory.save(async function(err, newsubcategory) {
      if (err) return next(err);

      //Find the selected category
      var existingCategory = await SecondHandProductCategory.findOne({
        _id: categoryId
      });

      //Push the new subcategory to Selected category
      existingCategory.secondHandProductSubCategories.push(newsubcategory._id);

      //Save category with new subcategory
      existingCategory.save(function(err, newcategory) {
        if (err) return next(err);

        req.flash("success", "Successfully added a subcategory");
        return res.redirect("/add-subcategory");
      });
    });
  })();
});

//Add Brand
router.get("/add-brand", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  res.render("accounts/addBrand", {
    message: req.flash("success"),
    errors: ""
  });
});

router.post("/add-brand", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  //New subcategory obeject
  var brand = new SecondHandProductBrand();

  brand.name = req.body.brand;

  brand.save(function(err) {
    if (err) return next(err);
    req.flash("success", "Successfully added a brand");
    return res.redirect("/add-brand");
  });
});

//Add product from user, form load
router.get("/add-product", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  res.render("accounts/addProduct", {
    message: req.flash("success"),
    errors: ""
  });
});

//Image saving storage part
var filename;
// create storage engine
const storage = new GridFsStorage({
  url: secret.database,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        //console.log(buf);
        if (err) return reject(err);
        filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "fs"
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

//Add product from user function
router.post(
  "/add-product2",
  upload.array("images"),
  passportConfig.isAuthenticated,
  function(req, res, next) {
    // console.log("kfdsjgkfdhgjkhfdkghfdkgh");
    // console.log(req.files);
    User.findOne({ _id: req.user._id }, function(err, user) {
      if (err) return next(err);
      //Product object
      let product = new SecondHandProduct();

      //Image
      var img_arr = [];
      req.files.map(async image => {
        img_arr.push(
          `https://ecom-admin.herokuapp.com/image/${image.filename}`
        );
      });

      //Product obeject
      product.owner = req.user._id;
      product.secondHandProductCategory = req.body.category;
      product.secondHandProductSubCategory = req.body.subcategory;
      product.secondHandProductBrand = req.body.brand;
      product.condition = req.body.condition;
      product.model = req.body.model;
      product.name = req.body.name;
      product.quantity = req.body.quantity;
      product.price = req.body.price;
      product.description = req.body.description;
      product.images = img_arr;
      product.contact.person = req.body.person;
      product.contact.phone1 = req.body.phone1;
      product.contact.phone2 = req.body.phone2;
      product.contact.email = req.body.email;
      product.contact.address = req.body.address;
      product.save(function(err, product) {
        if (err) return next(err);
        req.flash("success", "Successfully added product");
        return res.redirect("/add-product");
      });
    });
  }
);

//View product to customer
router.get("/my-product", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  SecondHandProduct.find({ owner: req.user._id })
    .populate("secondHandProductCategory")
    .populate("secondHandProductSubCategory")
    .populate("secondHandProductBrand")
    .exec(function(err, products) {
      if (err) return next(err);
      //console.log(products);
      res.render("accounts/myProduct", {
        products: products,
        moment: moment,
        errors: "",
        message: ""
      });
    });
});

//View all second hand product
router.get("/all-secondhandproduct", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  SecondHandProduct.find({ active: true })
    .populate("secondHandProductCategory")
    .populate("secondHandProductSubCategory")
    .populate("secondHandProductBrand")
    .exec(function(err, products) {
      if (err) return next(err);
      //console.log(products);
      res.render("main/allSecondHandProduct", {
        products: products,
        moment: moment,
        errors: "",
        message: ""
      });
    });
});

//Edit my product form
router.get("/edit-myproduct", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {});

//Edit my product
router.post("/edit-myproduct", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {});

module.exports = router;
