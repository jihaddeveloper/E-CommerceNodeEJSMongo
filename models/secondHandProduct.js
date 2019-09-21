//  Author: Mohammad Jihad Hossain
//  Create Date: 10/07/2019
//  Modify Date: 11/07/2019
//  Description: SecondHandProduct model schema for ECL E-Commerce

//Import library
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema
var SecondHandProduct = new Schema({
  created: { type: Date, default: Date.now },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  secondHandProductCategory: {
    type: Schema.Types.ObjectId,
    ref: "SecondHandProductCategory"
  },
  secondHandProductSubCategory: {
    type: Schema.Types.ObjectId,
    ref: "SecondHandProductSubCategory"
  },
  secondHandProductBrand: {
    type: Schema.Types.ObjectId,
    ref: "SecondHandProductBrand"
  },
  model: { type: String },
  name: { type: String },
  condition: { type: String },
  quantity: { type: Number },
  price: { type: Number },
  description: {
    type: String
  },
  images: { type: Array },
  contact: {
    person: { type: String },
    phone1: { type: Number },
    phone2: { type: Number },
    email: { type: String },
    address: { type: String }
  },
  status: { type: Boolean, default: true },
  active: { type: Boolean, default: true },
  enabled: { type: Boolean, default: true },
  paid: { type: Boolean, default: false }
});

module.exports = mongoose.model(
  "SecondHandProduct",
  SecondHandProduct,
  "secondHandProducts"
);
