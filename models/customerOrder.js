//  Author: Mohammad Jihad Hossain
//  Create Date: 02/01/2019
//  Modify Date: 23/06/2019
//  Description: Customer Order schema model of ECL E-Commerce

//Library import
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var CustomerOrderSchema = new Schema({
  created: { type: Date, default: Date.now },
  orderId: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  cart: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number },
      unitPrice: { type: Number },
      price: { type: Number }
    }
  ],
  shippingAddress: {
    shippingAddressName: { type: String },
    shippingAddress1: { type: String },
    shippingAddress2: { type: String },
    shippingAddressCity: { type: String },
    shippingAddressDistrict: { type: String },
    shippingAddressDivision: { type: String },
    shippingAddressPostalCode: { type: String },
    shippingAddressCountry: { type: String },
    shippingAddressPhone: { type: String }
  },
  paymentMethod: { type: String },
  paymentId: { type: String },
  shippingCharge: { type: Number },
  totalAmount: { type: Number },
  currentStatus: { type: String, default: "New Order" },
  history: { type: Array },
  lastModified: { type: Date, default: Date.now }
});

module.exports = mongoose.model(
  "CustomerOrder",
  CustomerOrderSchema,
  "customerOrders"
);
