//  Author: Mohammad Jihad Hossain
//  Create Date: 15/06/2019
//  Modify Date: 15/06/2019
//  Description: WishList model schema for ECL E-Commerce

//Import library
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema
var WishListSchema = new Schema({
  created: { type: Date, default: Date.now },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  totalProductQuantity: { type: Number, default: 0 },
  totalPriceAmount: { type: Number, default: 0 },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      price: { type: Number, default: 0 },
      addedDate: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("WishList", WishListSchema, "wishLists");
