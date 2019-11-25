//  Author: Mohammad Jihad Hossain
//  Create Date: 27/11/2019
//  Modify Date: 29/11/2019
//  Description: Restful API testing

//Library import
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var TestSchema = new Schema({
  name: { type: String },
  email: { type: String, unique: true, loadClass: true },
  password: { type: String, min: 6, max: 20 },
  images: { type: Array },
  image: { type: String }
});

module.exports = mongoose.model("Test", TestSchema, "tests");
