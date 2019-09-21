//  Author: Fathma siddique
//  last modified: 08/19/19
//  Description: discount model schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let DiscountSchema = new Schema({
  name: { type: String },
  created: { type: Date, default: Date.now },
  enabled: { type: Boolean, default: false },
  type: { type: String },
  usePercentage: { type: Boolean, default: false },
  discountPercent: { type: Number },
  discountAmount: { type: Number },
  maximunDiscountAmount: { type: Number },
  couponrequired: { type: Boolean, default: false },
  coupon: { type: String },
  days: { type: Number },
  maxNumber: { type: Number }
});
module.exports = mongoose.model("Discount", DiscountSchema, "discounts");
