//  Author: Mohammad Jihad Hossain
//  Create Date: 13/06/2019
//  Modify Date: 19/08/2019
//  Description: Validation file for signup of ECL E-Commerce

const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data) {
  let validationErrors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (
    !Validator.isLength(data.name, {
      min: 2,
      max: 30
    })
  ) {
    validationErrors.name = "Name must be between 2 and 30 characters";
  }

  if (!Validator.isEmail(data.email)) {
    validationErrors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.name)) {
    validationErrors.name = "Name is required";
  }

  if (Validator.isEmpty(data.email)) {
    validationErrors.email = "Email is required";
  }

  if (Validator.isEmpty(data.password)) {
    validationErrors.password = "Password is reqired";
  }

  if (Validator.isEmpty(data.confirm_password)) {
    validationErrors.password2 = "Confirm Password is reqired";
  }

  if (!Validator.isAlphanumeric(data.password, "en-US")) {
    validationErrors.password = "Password must be an alphanumeric";
  }

  if (
    !Validator.isLength(data.password, {
      min: 6,
      max: 30
    })
  ) {
    validationErrors.password = "Password must be at least 6 characters";
  }

  if (!Validator.equals(data.password, data.confirm_password)) {
    validationErrors.confirm_password = "Passwords must be matched";
  }

  return {
    validationErrors: validationErrors,
    isValid: isEmpty(validationErrors)
  };
};
