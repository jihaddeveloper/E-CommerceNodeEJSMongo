//  Author: Mohammad Jihad Hossain
//  Create Date: 19/08/2019
//  Modify Date: 19/08/2019
//  Description: Validation file for payment of ECL E-Commerce

const Validator = require("validator");
const isEmpty = require("./isEmpty");
const isMobilePhoneNumberBd = require("@muniftanjim/is-mobile-phone-number-bd")
  .default;

module.exports = function validatePaymentInput(data) {
  let validationErrors = {};

  data.shippingAddressName = !isEmpty(data.shippingAddressName)
    ? data.shippingAddressName
    : "";
  data.shippingAddress1 = !isEmpty(data.shippingAddress1)
    ? data.shippingAddress1
    : "";
  data.shippingAddress2 = !isEmpty(data.shippingAddress2)
    ? data.shippingAddress2
    : "";
  data.shippingAddressCity = !isEmpty(data.shippingAddressCity)
    ? data.shippingAddressCity
    : "";
  data.shippingAddressDistrict = !isEmpty(data.shippingAddressDistrict)
    ? data.shippingAddressDistrict
    : "";
  data.shippingAddressDivision = !isEmpty(data.shippingAddressDivision)
    ? data.shippingAddressDivision
    : "";
  data.shippingAddressPostalCode = !isEmpty(data.shippingAddressPostalCode)
    ? data.shippingAddressPostalCode
    : "";
  data.shippingAddressCountry = !isEmpty(data.shippingAddressCountry)
    ? data.shippingAddressCountry
    : "";
  data.shippingAddressPhone = !isEmpty(data.shippingAddressPhone)
    ? data.shippingAddressPhone
    : "";

  if (Validator.isEmpty(data.shippingAddressName)) {
    validationErrors.shippingAddressName = "Name is required";
  }

  if (
    !Validator.isLength(data.shippingAddressName, {
      min: 2,
      max: 30
    })
  ) {
    validationErrors.shippingAddressName =
      "Name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.shippingAddress1)) {
    validationErrors.shippingAddress1 = "Address1 is required";
  }

  if (Validator.isEmpty(data.shippingAddress2)) {
    validationErrors.shippingAddress2 = "Address2 is reqired";
  }

  if (Validator.isEmpty(data.shippingAddressCity)) {
    validationErrors.shippingAddressCity = "City is reqired";
  }

  if (Validator.isEmpty(data.shippingAddressDistrict)) {
    validationErrors.shippingAddressDistrict = "District is reqired";
  }

  if (Validator.isEmpty(data.shippingAddressDivision)) {
    validationErrors.shippingAddressDivision = "Division is reqired";
  }

  if (Validator.isEmpty(data.shippingAddressPostalCode)) {
    validationErrors.shippingAddressPostalCode = "Postalcode is reqired";
  }

  if (Validator.isEmpty(data.shippingAddressCountry)) {
    validationErrors.shippingAddressCountry = "Country is reqired";
  }

  if (Validator.isEmpty(data.shippingAddressPhone)) {
    validationErrors.shippingAddressPhone = "Phone is reqired";
  }

  if (!isMobilePhoneNumberBd(data.shippingAddressPhone)) {
    validationErrors.shippingAddressPhone = "Phone must be a valid number";
  }

  return {
    validationErrors: validationErrors,
    isValid: isEmpty(validationErrors)
  };
};
