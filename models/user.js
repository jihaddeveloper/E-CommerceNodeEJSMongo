//  Author: Mohammad Jihad Hossain
//  Create Date: 02/01/2019
//  Modify Date: 15/06/2019
//  Description: User model schema for ECL E-Commerce

//Import library
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

//Schema
var UserSchema = new Schema({
  created: { type: Date, default: Date.now },

  email: { type: String, unique: true, loadClass: true },
  password: { type: String, min: 6, max: 20 },

  google: {
    id: {
      type: String
    },
    email: {
      type: String
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String
    }
  },

  name: { type: String },
  contact: { type: String },

  secretToken: { type: String },
  isActive: { type: Boolean, default: false },
  isValid: { type: Boolean, default: false },

  facebook: String,
  tokens: Array,

  profile: {
    name: { type: String },
    picture: { type: String }
  },

  avatar: { type: String },

  address: {
    name: { type: String },
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    district: { type: String },
    division: { type: String },
    country: { type: String },
    postalCode: { type: String }
  },
  billingAddress: [
    {
      billingAddressName: { type: String },
      billingAddress1: { type: String },
      billingAddress2: { type: String },
      billingAddressCity: { type: String },
      billingAddressDistrict: { type: String },
      billingAddressDivision: { type: String },
      billingAddressCountry: { type: String },
      billingAddressPostalCode: { type: String },
      billingAddressPhone: { type: String }
    }
  ],
  shippingAddress: [
    {
      shippingAddressName: { type: String },
      shippingAddress1: { type: String },
      shippingAddress2: { type: String },
      shippingAddressCity: { type: String },
      shippingAddressDistrict: { type: String },
      shippingAddressDivision: { type: String },
      shippingAddressPostalCode: { type: String },
      shippingAddressCountry: { type: String },
      shippingAddressPhone: { type: String }
    }
  ],

  shippingAddressSameAsbillingAddress: Boolean,

  history: [
    {
      paid: { type: Number, default: 0 },
      item: { type: Schema.Types.ObjectId, ref: "Product" },
      created: { type: Date, default: Date.now }
    }
  ],

  paymentMethod: { type: Schema.Types.ObjectId, ref: "PaymentMethod" },
  cardHolderName: { type: String, default: "" },
  creditCardLast4Digits: { type: String, default: "" },
  status: { type: Boolean, default: true },
  isSeller: { type: Boolean, default: false }
});

//Password Hashing
UserSchema.pre("save", async function(next) {
  try {
    //User schema is instantiated
    const user = this;

    //Check if the user has been modified to know if the password has already been hashed
    if (!user.isModified("password")) return next();

    //Password salting and hashing
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(this.password, salt);
    // Re-assign hashed version over original, plain text password
    this.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});

//Comparing Password
UserSchema.methods.comparePassword = async function(password) {
  try {
    //Copmparing givenPassword and savedPassword
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

//  Profile image save fro email
UserSchema.methods.gravatar = function(size) {
  if (!this.size) size = 200;
  if (!this.email) return "https://gravatar.com/avatar/?s" + size + "&d=retro";
  var md5 = crypto
    .createHash("md5")
    .update(this.email)
    .digest("hex");
  return "https://gravatar.com/avatar/" + md5 + "?s=" + size + "&d=retro";
};

module.exports = mongoose.model("User", UserSchema, "users");
