//  Author: Mohammad Jihad Hossain
//  Create Date: 28/08/2019
//  Modify Date: 28/08/2019
//  Description: Review model schema for ECL E-Commerce


//Library import
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  comment: { type: String, default: "" },
  rating: { type: Number, default: 0 },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", ReviewSchema, "reviews");
