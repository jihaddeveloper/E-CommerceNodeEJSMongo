//  Author: Mohammad Jihad Hossain
//  Create Date: 17/08/2019
//  Modify Date: 17/08/2019
//  Description: Validation file for login of ECL E-Commerce

const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateLoginInput(data) {
  let validationErrors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email)) {
    validationErrors.email = "Email is required";
  }

  if (Validator.isEmpty(data.password)) {
    validationErrors.password = "Password is reqired";
  }

  return {
    validationErrors: validationErrors,
    isValid: isEmpty(validationErrors)
  };
};
