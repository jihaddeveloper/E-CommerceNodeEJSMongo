//  Author: Mohammad Jihad Hossain
//  Create Date: 10/07/2019
//  Modify Date: 10/07/2019
//  Description: SecondHandProductCategory model schema for ECL E-Commerce

//  Library import
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Text = require("../node_modules/text/lib/text");

var SecondHandProductCategorySchema = new Schema({
  name: { type: Text, es_type: "text", unique: true },
  secondHandProductSubCategories: [
    { type: Schema.Types.ObjectId, ref: "SecondHandProductSubCategory" }
  ],
  enabled: { type: Boolean, default: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model(
  "SecondHandProductCategory",
  SecondHandProductCategorySchema,
  "secondHandProductCategories"
);
