//  Author: Mohammad Jihad Hossain
//  Create Date: 19/06/2019
//  Modify Date: 03/09/2019
//  Description: Cart model schema for ECL E-Commerce

//Import library
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema
var CartSchema = new Schema({
  created: { type: Date, default: Date.now },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  totalProductQuantity: { type: Number, default: 0 },
  totalPriceAmount: { type: Number, default: 0 },
  items: [
    {
      product_id: { type: Schema.Types.ObjectId, ref: "Product" },
      productName: { type: String },
      quantity: { type: Number, default: 0 },
      unitPrice: { type: Number, default: 0 },
      price: { type: Number, default: 0 },
      addedDate: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("Cart", CartSchema, "carts");
