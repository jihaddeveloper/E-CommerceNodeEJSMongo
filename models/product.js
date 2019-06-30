const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Text = require("../node_modules/text/lib/text");
const nested = require("nested");
const Category = require("../models/category");
const User = require("../models/user");
const deepPopulate = require("mongoose-deep-populate")(mongoose);
const SubCategory = require("../models/subCategory");

var ProductSchema = new Schema({
  subcategory: { type: Schema.Types.ObjectId, ref: "SubCategory" },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  brand: { type: Schema.Types.ObjectId, ref: "Brand" },
  pid: { type: String },
  name: { type: String, default: "" },
  productName: { type: String },
  model: { type: String, required: false },
  features: { type: Array, required: false },
  warranty: { type: String, default: "" },
  description: { type: String, default: "None" },
  shippingInfo: { type: String, default: "None" },
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
  warranted: { type: Boolean },
  sellingPrice: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false },
  availablity: { type: Boolean, default: false },
  dealer: { type: Boolean, default: false },
  status: { type: Boolean, required: false },
  admin: { type: Schema.Types.ObjectId, ref: "users" },
  created: { type: Date, default: Date.now }
});

ProductSchema.virtual("avarageRating").get(function() {
  var rating = 0;
  if (this.reviews.length == 0) {
    rating = 0;
  } else {
    this.reviews.map(reviw => {
      rating += reviw.rating;
    });
    rating = rating / this.reviews.length;
  }
  return rating;
});

module.exports = mongoose.model("Product", ProductSchema, "products");
