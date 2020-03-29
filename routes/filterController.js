//  Author: Mohammad Jihad Hossain
//  Create Date: 26/08/2019
//  Modify Date: 28/03/2020
//  Description: Main controller file of ECL E-Commerce

// Library import
const router = require("express").Router();
const async = require("async");
const passportConfig = require("../config/passport");
var unique = require("array-unique");

//Model import
var Product = require("../models/product");
var Review = require("../models/review");
const User = require("../models/user");

//Function to get unique features among all products for filtering.
var get_array_of_obj = (unique_arr, feat) => {
  // console.log(unique_arr);
  // console.log(feat);

  var last = [];
  var temp = [];
  for (var i = 0; i < unique_arr.length; i++) {
    for (var j = 0; j < feat.length; j++) {
      if (feat[j].label.name === unique_arr[i]) {
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

    //console.log(obj);

    var jsn = JSON.parse(obj);

    last.push(jsn);
    temp = [];
  }

  return last;
};

//Category Filter
//Filter function for category wise products
function categoryfilterpage(req, res, obj) {
  var resultArray = [];
  var array = [];
  var feat = [];

  var unique_arr = [];

  Product.find(obj)
    .populate("category")
    .populate("subcategory")
    .populate("brand")
    .populate("features.label")
    .exec(function(err, docs) {
      if (err) {
        res.send(err);
      } else {
        for (var i = 0; i < docs.length; i++) {
          for (var j = 0; j < docs[i].features.length; j++) {
            //Checking for applicable features
            if (docs[i].features[j].label.filtering) {
              array.push(docs[i].features[j].label.name);

              feat.push(docs[i].features[j]);
            }
          }
        }

        unique_arr = unique(array);
        var last = get_array_of_obj(unique_arr, feat);
        for (var i = 0; i < docs.length; i++) {
          resultArray.push(docs.slice(i, i + docs.length));
        }

        //console.log(docs.length);

        res.render("filter/categoryFilterPage", {
          title: "Products",
          category: req.params.id,
          products: resultArray,
          dropdown_label: last,
          number: last.length
        });
      }
    });
}

//Category wise products view with filter function
router.get("/products/category/:id", function(req, res, next) {
  req.session.returnTo = req.originalUrl;

  var obj = {
    category: req.params.id,
    isActive: true
  };
  categoryfilterpage(req, res, obj);
});

//Category wise products view for filter input
router.post("/products/category/filter/:id", (req, res, next) => {
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
      $and: [
        {
          sellingPrice: {
            $gt: parseInt(array_range[0], 10)
          }
        },
        {
          sellingPrice: {
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

  var resultArray = [];

  Product.find({
    $and: sr
  })
    .populate("category")
    .populate("subcategory")
    .populate("brand")
    .populate("features.label")
    .exec(function(err, docs) {
      if (err) {
        res.send(err);
      } else {
        var feat = [];
        var array = [];
        for (var i = 0; i < docs.length; i++) {
          for (var j = 0; j < docs[i].features.length; j++) {
            //Checking for applicable features
            if (docs[i].features[j].label.filtering) {
              array.push(docs[i].features[j].label.name);

              feat.push(docs[i].features[j]);
            }
          }
        }
        unique_arr = unique(array);
        var last = get_array_of_obj(unique_arr, feat);

        for (var i = 0; i < docs.length; i++) {
          resultArray.push(docs.slice(i, i + docs.length));
        }

        res.render("filter/categoryFilterPage", {
          title: "Products",
          category: req.params.id,
          products: resultArray,
          dropdown_label: last,
          number: last.length
        });
      }
    });
});
//Category Filter

//SubCategory Filter
//Filter function for subcategory wise products
function subCategoryFilterPage(req, res, obj) {
  var resultArray = [];
  var array = [];
  var feat = [];

  var unique_arr = [];

  Product.find(obj)
    .populate("category")
    .populate("subcategory")
    .populate("brand")
    .populate("features.label")
    .exec(function(err, docs) {
      if (err) {
        res.send(err);
      } else {
        for (var i = 0; i < docs.length; i++) {
          for (var j = 0; j < docs[i].features.length; j++) {
            //Checking for applicable features
            if (docs[i].features[j].label.filtering) {
              array.push(docs[i].features[j].label.name);

              feat.push(docs[i].features[j]);
            }
          }
        }
        unique_arr = unique(array);
        var last = get_array_of_obj(unique_arr, feat);
        for (var i = 0; i < docs.length; i++) {
          resultArray.push(docs.slice(i, i + docs.length));
        }

        res.render("filter/subCategoryFilterPage", {
          title: "Products",
          subcategory: req.params.id,
          products: resultArray,
          dropdown_label: last,
          number: last.length
        });
      }
    });
}

//SubCategory wise products view with filter function
router.get("/products/subCategory/:id", function(req, res, next) {
  req.session.returnTo = req.originalUrl;

  var obj = {
    subcategory: req.params.id,
    isActive: true
  };
  subCategoryFilterPage(req, res, obj);
});

//Subcategory wise products view for filter input
router.post("/products/subCategory/filter/:id", (req, res, next) => {
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
      $and: [
        {
          sellingPrice: {
            $gt: parseInt(array_range[0], 10)
          }
        },
        {
          sellingPrice: {
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

  var resultArray = [];

  Product.find({
    $and: sr
  })
    .populate("category")
    .populate("subcategory")
    .populate("brand")
    .populate("features.label")
    .exec(function(err, docs) {
      if (err) {
        res.send(err);
      } else {
        var feat = [];
        var array = [];
        for (var i = 0; i < docs.length; i++) {
          for (var j = 0; j < docs[i].features.length; j++) {
            //Checking for applicable features
            if (docs[i].features[j].label.filtering) {
              array.push(docs[i].features[j].label.name);

              feat.push(docs[i].features[j]);
            }
          }
        }
        unique_arr = unique(array);
        var last = get_array_of_obj(unique_arr, feat);

        for (var i = 0; i < docs.length; i++) {
          resultArray.push(docs.slice(i, i + docs.length));
        }

        res.render("filter/subCategoryFilterPage", {
          title: "Products",
          subcategory: req.params.id,
          products: resultArray,
          dropdown_label: last,
          number: last.length
        });
      }
    });
});
//SubCategory Filter

//Brand Filter
//Brand Category Filter Function
function brandCategoryFilterPage(req, res, obj) {
  var resultArray = [];
  var array = [];
  var feat = [];

  var unique_arr = [];

  Product.find(obj)
    .populate("category")
    .populate("subcategory")
    .populate("brand")
    .populate("features.label")
    .exec(function(err, docs) {
      if (err) {
        res.send(err);
      } else {
        for (var i = 0; i < docs.length; i++) {
          for (var j = 0; j < docs[i].features.length; j++) {
            //Checking for applicable features
            if (docs[i].features[j].label.filtering) {
              array.push(docs[i].features[j].label.name);

              feat.push(docs[i].features[j]);
            }
          }
        }
        unique_arr = unique(array);
        var last = get_array_of_obj(unique_arr, feat);
        for (var i = 0; i < docs.length; i++) {
          resultArray.push(docs.slice(i, i + docs.length));
        }

        res.render("filter/brandCategoryFilterPage", {
          title: "Products",
          category: req.params.category_id,
          //subcategory: req.params.subcategory_id,
          brand: req.params.brand_id,
          products: resultArray,
          dropdown_label: last,
          number: last.length
        });
      }
    });
}

// Category, Brand wise products view with filter function
router.get("/products/:category_id/:brand_id", function(req, res, next) {
  req.session.returnTo = req.originalUrl;

  var obj = {
    category: req.params.category_id,
    brand: req.params.brand_id,
    isActive: true
  };
  brandCategoryFilterPage(req, res, obj);
});

// Category, Brand wise products view for filter input
router.post(
  "/products/brands/filter/:category_id/:brand_id",
  (req, res, next) => {
    req.session.returnTo = req.originalUrl;

    var num1 = req.body.number;
    var sr = [];

    sr.push({
      category: req.params.category_id
    });

    if (req.body.brand != "0") {
      sr.push({
        brand: req.body.brand
      });
    }
    if (req.body.price != "0") {
      var array_range = req.body.price.split("-");
      sr.push({
        $and: [
          {
            sellingPrice: {
              $gt: parseInt(array_range[0], 10)
            }
          },
          {
            sellingPrice: {
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
      .populate("category")
      .populate("subcategory")
      .populate("brand")
      .populate("features.label")
      .exec(function(err, docs) {
        if (err) {
          res.send(err);
        } else {
          var feat = [];
          var array = [];
          for (var i = 0; i < docs.length; i++) {
            for (var j = 0; j < docs[i].features.length; j++) {
              //Checking for applicable features
              if (docs[i].features[j].label.filtering) {
                array.push(docs[i].features[j].label.name);

                feat.push(docs[i].features[j]);
              }
            }
          }
          unique_arr = unique(array);
          var last = get_array_of_obj(unique_arr, feat);

          for (var i = 0; i < docs.length; i++) {
            resultArray.push(docs.slice(i, i + docs.length));
          }

          res.render("filter/brandCategoryFilterPage", {
            title: "Products",
            category: req.params.category_id,
            brand: req.params.brand_id,
            products: resultArray,
            dropdown_label: last,
            number: last.length
          });
        }
      });
  }
);

//Brand SubCategory Category Filter Function
function brandCategorySubCategoryFilterPage(req, res, obj) {
  var resultArray = [];
  var array = [];
  var feat = [];

  var unique_arr = [];

  Product.find(obj)
    .populate("category")
    .populate("subcategory")
    .populate("brand")
    .populate("features.label")
    .exec(function(err, docs) {
      if (err) {
        res.send(err);
      } else {
        for (var i = 0; i < docs.length; i++) {
          for (var j = 0; j < docs[i].features.length; j++) {
            //Checking for applicable features
            if (docs[i].features[j].label.filtering) {
              array.push(docs[i].features[j].label.name);

              feat.push(docs[i].features[j]);
            }
          }
        }
        unique_arr = unique(array);
        var last = get_array_of_obj(unique_arr, feat);
        for (var i = 0; i < docs.length; i++) {
          resultArray.push(docs.slice(i, i + docs.length));
        }

        res.render("filter/brandCategorySubcategoryFilterPage", {
          title: "Products",
          category: req.params.category_id,
          subcategory: req.params.subcategory_id,
          brand: req.params.brand_id,
          products: resultArray,
          dropdown_label: last,
          number: last.length
        });
      }
    });
}

// Category, SubCategory, Brand wise products view with filter function
router.get("/products/:category_id/:subcategory_id/:brand_id", function(
  req,
  res,
  next
) {
  req.session.returnTo = req.originalUrl;

  var obj = {
    category: req.params.category_id,
    subcategory: req.params.subcategory_id,
    brand: req.params.brand_id,
    isActive: true
  };
  brandCategorySubCategoryFilterPage(req, res, obj);
});

// Category, SubCategory, Brand wise products view for filter input
router.post(
  "/products/brands/filter/:category_id/:subcategory_id/:brand_id",
  function(req, res, next) {
    req.session.returnTo = req.originalUrl;

    var num1 = req.body.number;
    var sr = [];

    sr.push({
      category: req.params.category_id,
      subcategory: req.params.subcategory_id
    });

    if (req.body.brand != "0") {
      sr.push({
        brand: req.body.brand
      });
    }
    if (req.body.price != "0") {
      var array_range = req.body.price.split("-");
      sr.push({
        $and: [
          {
            sellingPrice: {
              $gt: parseInt(array_range[0], 10)
            }
          },
          {
            sellingPrice: {
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

    var resultArray = [];

    Product.find({
      $and: sr
    })
      .populate("category")
      .populate("subcategory")
      .populate("brand")
      .populate("features.label")
      .exec(function(err, docs) {
        if (err) {
          res.send(err);
        } else {
          var feat = [];
          var array = [];
          for (var i = 0; i < docs.length; i++) {
            for (var j = 0; j < docs[i].features.length; j++) {
              //Checking for applicable features
              if (docs[i].features[j].label.filtering) {
                array.push(docs[i].features[j].label.name);

                feat.push(docs[i].features[j]);
              }
            }
          }
          unique_arr = unique(array);
          var last = get_array_of_obj(unique_arr, feat);

          for (var i = 0; i < docs.length; i++) {
            resultArray.push(docs.slice(i, i + docs.length));
          }

          res.render("filter/brandCategorySubcategoryFilterPage", {
            title: "Products",
            category: req.params.category_id,
            subcategory: req.params.subcategory_id,
            brand: req.params.brand_id,
            products: resultArray,
            dropdown_label: last,
            number: last.length
          });
        }
      });
  }
);
//Brand Filter

module.exports = router;
