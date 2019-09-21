//  Author: Mohammad Jihad Hossain
//  Create Date: 02/01/2019
//  Modify Date: 01/09/2019
//  Description: Product model schema for ECL E-Commerce

//  Library import
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Text = require("../node_modules/text/lib/text");
const nested = require("nested");
const Category = require("../models/category");
const User = require("../models/user");
const deepPopulate = require("mongoose-deep-populate")(mongoose);
const SubCategory = require("../models/subCategory");

//  Schema
var ProductSchema = new Schema(
  {
    subcategory: { type: Schema.Types.ObjectId, ref: "SubCategory" },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    pid: { type: String },
    name: { type: String, default: "" },
    productName: { type: String },
    model: { type: String, required: false },
    features: [
      {
        label: { type: Schema.Types.ObjectId, ref: "Specification" },
        value: { type: String }
      }
    ],
    warranty: { type: String, default: "" },
    description: { type: String, default: "None" },
    shippingInfo: {
      weight: { type: String, default: "None" },
      length: { type: String, default: "None" },
      height: { type: String, default: "None" },
      width: { type: String, default: "None" },
      freeShipping: { type: Boolean, default: "false" },
      additionalCharge: { type: Number },
      deliveryDate: { type: String, default: "None" }
    },
    image: { type: Array, default: [] },
    weight: { type: String, default: "" },
    serial_availablity: { type: Boolean },
    frontQuantity: { type: Number, default: 0 },
    live: {
      quantity: { type: Number, default: 0 },
      serial: { type: Array, default: [] },
      admin: { type: Schema.Types.ObjectId, ref: "users" },
      created: { type: Date, default: Date.now }
    },
    availablity: { type: Boolean, default: false },
    warranted: { type: Boolean },
    sellingPrice: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
    dealer: { type: Boolean, default: false },
    status: { type: Boolean, required: false },
    admin: { type: Schema.Types.ObjectId, ref: "users" },
    created: { type: Date, default: Date.now },
    HomePagetag: { type: String, default: "None" },
    relatedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    discount: { type: Schema.Types.ObjectId, ref: "Discount", default: null },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    faqs: [{ type: Schema.Types.ObjectId, ref: "Faq" }]
  },
  { toObject: { virtuals: true }, toJSOn: { virtual: true } }
);

//To show average rating
ProductSchema.virtual("averageRating").get(function() {
  var rating = 0;
  if (this.reviews.length == 0) {
    rating = 0;
  } else {
    this.reviews.map(review => {
      rating += review.rating;
    });
    rating = rating / this.reviews.length;
  }
  return rating;
});

module.exports = mongoose.model("Product", ProductSchema, "products");
