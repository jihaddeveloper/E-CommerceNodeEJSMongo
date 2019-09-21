//  Author: Mohammad Jihad Hossain
//  Create Date: 02/01/2019
//  Modify Date: 06/02/2019
//  Description: Admin controller for all routes of Cart project for ECL E-Commerce

//Library import
const router = require("express").Router();
const passport = require("passport");
const passportConfig = require("../config/passport");

//Model import
const Category = require("../models/category");
const Product = require("../models/product");

//Image saving tools
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const mongo = require("mongodb");

mongoose.Promise = global.Promise;

//Database connection
const mongoo =
  "mongodb://jihad:abc1234@ds245647.mlab.com:45647/e-commerce_db_v12";
const conn = mongoose.createConnection(mongoo);

let gfs;
conn.once("open", function() {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("fs");
});
var filename;

// create storage engine
const storage = new GridFsStorage({
  url: mongoo,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
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

//Product load form
router.get("/product-load", passportConfig.isAuthenticated, function(
  req,
  res,
  next
) {
  res.render("admin/productLoadForm", { message: req.flash("success") });
});

//Product saving function
router.post(
  "/regiSave/:category/:num",
  upload.single("imagePath"),
  (req, res) => {
    var num = parseInt(req.params.num, 10);

    var data = [];
    if (num > 0) {
      data.push(
        JSON.parse(
          '{"label":"' +
            req.body.feature1_label +
            '","value":"' +
            req.body.feature1_value +
            '"}'
        )
      );
      if (num > 1) {
        data.push(
          JSON.parse(
            '{"label":"' +
              req.body.feature2_label +
              '","value":"' +
              req.body.feature2_value +
              '"}'
          )
        );
        if (num > 2) {
          data.push(
            JSON.parse(
              '{"label":"' +
                req.body.feature3_label +
                '","value":"' +
                req.body.feature3_value +
                '"}'
            )
          );
          if (num > 3) {
            data.push(
              JSON.parse(
                '{"label":"' +
                  req.body.feature4_label +
                  '","value":"' +
                  req.body.feature4_value +
                  '"}'
              )
            );
            if (num > 4) {
              data.push(
                JSON.parse(
                  '{"label":"' +
                    req.body.feature5_label +
                    '","value":"' +
                    req.body.feature5_value +
                    '"}'
                )
              );
              if (num > 5) {
                data.push(
                  JSON.parse(
                    '{"label":"' +
                      req.body.feature6_label +
                      '","value":"' +
                      req.body.feature6_value +
                      '"}'
                  )
                );
                if (num > 6) {
                  data.push(
                    JSON.parse(
                      '{"label":"' +
                        req.body.feature7_label +
                        '","value":"' +
                        req.body.feature7_value +
                        '"}'
                    )
                  );
                  if (num > 7) {
                    data.push(
                      JSON.parse(
                        '{"label":"' +
                          req.body.feature8_label +
                          '","value":"' +
                          req.body.feature8_value +
                          '"}'
                      )
                    );
                    if (num > 8) {
                      data.push(
                        JSON.parse(
                          '{"label":"' +
                            req.body.feature9_label +
                            '","value":"' +
                            req.body.feature9_value +
                            '"}'
                        )
                      );
                      if (num > 9) {
                        data.push(
                          JSON.parse(
                            '{"label":"' +
                              req.body.feature10_label +
                              '","value":"' +
                              req.body.feature10_value +
                              '"}'
                          )
                        );
                        if (num > 10) {
                          data.push(
                            JSON.parse(
                              '{"label":"' +
                                req.body.feature11_label +
                                '","value":"' +
                                req.body.feature11_value +
                                '"}'
                            )
                          );
                          if (num > 11) {
                            data.push(
                              JSON.parse(
                                '{"label":"' +
                                  req.body.feature12_label +
                                  '","value":"' +
                                  req.body.feature12_value +
                                  '"}'
                              )
                            );
                            if (num > 12) {
                              data.push(
                                JSON.parse(
                                  '{"label":"' +
                                    req.body.feature13_label +
                                    '","value":"' +
                                    req.body.feature13_value +
                                    '"}'
                                )
                              );
                              if (num > 13) {
                                data.push(
                                  JSON.parse(
                                    '{"label":"' +
                                      req.body.feature14_label +
                                      '","value":"' +
                                      req.body.feature14_value +
                                      '"}'
                                  )
                                );
                                if (num > 14) {
                                  data.push(
                                    JSON.parse(
                                      '{"label":"' +
                                        req.body.feature15_label +
                                        '","value":"' +
                                        req.body.feature15_value +
                                        '"}'
                                    )
                                  );
                                  if (num > 15) {
                                    data.push(
                                      JSON.parse(
                                        '{"label":"' +
                                          req.body.feature16_label +
                                          '","value":"' +
                                          req.body.feature16_value +
                                          '"}'
                                      )
                                    );
                                    if (num > 16) {
                                      data.push(
                                        JSON.parse(
                                          '{"label":"' +
                                            req.body.feature17_label +
                                            '","value":"' +
                                            req.body.feature17_value +
                                            '"}'
                                        )
                                      );
                                      if (num > 17) {
                                        data.push(
                                          JSON.parse(
                                            '{"label":"' +
                                              req.body.feature18_label +
                                              '","value":"' +
                                              req.body.feature18_value +
                                              '"}'
                                          )
                                        );
                                        if (num > 18) {
                                          data.push(
                                            JSON.parse(
                                              '{"label":"' +
                                                req.body.feature19_label +
                                                '","value":"' +
                                                req.body.feature19_value +
                                                '"}'
                                            )
                                          );
                                          if (num > 19) {
                                            data.push(
                                              JSON.parse(
                                                '{"label":"' +
                                                  req.body.feature20_label +
                                                  '","value":"' +
                                                  req.body.feature20_value +
                                                  '"}'
                                              )
                                            );
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
                  }
                }
              }
            }
          }
        }
      }
    }
    var pro = new Promise(function(resolve, reject) {
      const readstream = gfs.createReadStream(req.file.filename);
      readstream.on("data", chunk => {
        arr = chunk.toString("base64");
        resolve();
      });
    });
    pro.then(() => {
      Category.findOne({ name: req.body.category }, function(err, ncategory) {
        if (err) return next(err);
        newCategoryID = ncategory._id;

        console.log(newCategoryID);
        newProduct = {
          name: req.body.title,
          category: newCategoryID,
          price: req.body.price,
          image: arr,
          user: req.user.id,
          brand: req.body.brand,
          model: req.body.model,
          warranty: req.body.warranty,
          features: data,
          pinned: "",
          home: ""
        };

        new Product(newProduct).save().then(product => {
          req.flash("success_msg", "Product added.");
          res.redirect("/products/home");
        });
      });
    });
    pro.then(() => {
      gfs.remove({ filename: req.file.filename }, err => {
        if (err) console.log(err);
      });
    });
  }
);

// router.post('/product-load', upload.single("image"), passportConfig.isAuthenticated, function(req, res, next){
//     User.findOne({ _id: req.user._id }, function(err, user) {
//         if(err) return next(err);

//         Category.findOne({ name: req.body.categoryName }, function(err, category){

//             if(err) return next(err);
//             var newCategory = category;

//             let product = new Product();

//             product.category = newCategory._id;
//             product.name = req.body.name;
//             product.price = req.body.price;
//             product.description = req.body.description;
//             product.owner = req.user._id;
//             //product.image = req.file.location;

//             product.save(function(err, product){
//                 if(err) return next(err);
//                 req.flash('success', 'Successfully added Product');
//                 return res.redirect('/product-load');
//             });
//         });

//     });
// });

// //Add category form
// router.get('/add-category', passportConfig.isAuthenticated, function(req, res, next){
//     res.render('admin/addCategory', { message: req.flash('success') });
// });

// //Add category
// router.post('/add-category', passportConfig.isAuthenticated, function(req, res, next){
//     var category = new Category();

//     category.name = req.body.name;

//     category.save(function(err){
//         if(err) return next(err);
//         req.flash('success', 'Successfully added a category');
//         return res.redirect('/add-category');
//     });
// });

module.exports = router;
