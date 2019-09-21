//  Author: Mohammad Jihad Hossain
//  Create Date: 02/01/2019
//  Modify Date: 15/06/2019
//  Description: Category model schema for ECL E-Commerce

//  Library import
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Text = require("../node_modules/text/lib/text");
const keyword = require("keyword");

var CategorySchema = new Schema({
  name: { type: Text, es_type: "text", unique: true },
  subCategories: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],
  brands: [{ type: Schema.Types.ObjectId, ref: "Brand" }],
  enabled: Boolean,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Category", CategorySchema, "categories");
