//  Author: Mohammad Jihad Hossain
//  Create Date: 10/07/2019
//  Modify Date: 10/07/2019
//  Description: SecondHandProductSubCategory model schema for ECL E-Commerce

//  Library import
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Text = require("text/lib/text");

var SecondHandProductSubCategorySchema = new Schema({
  name: { type: Text, es_type: "text", unique: true },
  secondHandProductCategory: {
    type: Schema.Types.ObjectId,
    ref: "SecondHandProductCategory"
  },
  enabled: { type: Boolean, default: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model(
  "SecondHandProductSubCategory",
  SecondHandProductSubCategorySchema,
  "secondHandProductSubCategories"
);
