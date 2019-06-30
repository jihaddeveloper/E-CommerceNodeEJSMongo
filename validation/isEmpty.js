//  Author: Mohammad Jihad Hossain
//  Create Date: 13/06/2019
//  Modify Date: 13/06/2019
//  Description: Validation file to check of empty field of ECL E-Commerce

//Defination of isEmpty function
const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

module.exports = isEmpty;
