//  Author: Mohammad Jihad Hossain
//  Create Date: 10/07/2019
//  Modify Date: 11/07/2019
//  Description: SecondHandProductBrand model schema for ECL E-Commerce

//  Library import
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Text = require("text/lib/text");

var SecondHandProductBrandSchema = new Schema({
  name: { type: Text, es_type: "text", unique: true },
  enabled: { type: Boolean, default: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model(
  "SecondHandProductBrand",
  SecondHandProductBrandSchema,
  "secondHandProductBrands"
);
