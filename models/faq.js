//  Author: Mohammad Jihad Hossain
//  Create Date: 28/08/2019
//  Modify Date: 28/08/2019
//  Description: Faq model schema for ECL E-Commerce

//Library import
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FaqSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  name: { type: String, default: "" },
  question: { type: String, default: "" },
  answers: [
    {
      owner: { type: Schema.Types.ObjectId, ref: "User" },
      answer: { type: String, default: "" },
      created: { type: Date, default: Date.now }
    }
  ],
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Faq", FaqSchema, "faqs");
