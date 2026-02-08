"use strict";

// server/utils/validators.js
var _require = require("express-validator"),
    body = _require.body,
    param = _require.param,
    query = _require.query; // ===== AUTH VALIDATORS =====


var registerValidator = [body("name").trim().notEmpty().withMessage("Name is required").isLength({
  min: 2,
  max: 50
}).withMessage("Name must be 2-50 characters"), body("username").trim().notEmpty().withMessage("Username is required").isLength({
  min: 3,
  max: 30
}).withMessage("Username must be 3-30 characters").matches(/^[a-zA-Z0-9_-]+$/).withMessage("Username can only contain letters, numbers, _ and -"), body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Must be a valid email").normalizeEmail(), body("password").notEmpty().withMessage("Password is required").isLength({
  min: 6
}).withMessage("Password must be at least 6 characters").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage("Password must contain at least one uppercase, lowercase, and number"), body("role").notEmpty().withMessage("Role is required").isIn(["customer", "supplier"]).withMessage("Role must be either customer or supplier")];
var loginValidator = [body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Must be a valid email").normalizeEmail(), body("password").notEmpty().withMessage("Password is required"), body("role").notEmpty().withMessage("Role is required").isIn(["customer", "supplier"]).withMessage("Role must be either customer or supplier")];
var googleLoginValidator = [body("idToken").notEmpty().withMessage("ID token is required"), body("role").notEmpty().withMessage("Role is required").isIn(["customer", "supplier"]).withMessage("Role must be either customer or supplier")];
var forgotPasswordValidator = [body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Must be a valid email").normalizeEmail()];
var resetPasswordValidator = [param("token").notEmpty().withMessage("Reset token is required"), body("password").notEmpty().withMessage("Password is required").isLength({
  min: 6
}).withMessage("Password must be at least 6 characters").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage("Password must contain at least one uppercase, lowercase, and number")];
var updateProfileValidator = [body("name").optional().trim().isLength({
  min: 2,
  max: 50
}).withMessage("Name must be 2-50 characters"), body("username").optional().trim().isLength({
  min: 3,
  max: 30
}).withMessage("Username must be 3-30 characters").matches(/^[a-zA-Z0-9_-]+$/).withMessage("Username can only contain letters, numbers, _ and -"), body("email").optional().trim().isEmail().withMessage("Must be a valid email").normalizeEmail(), body("phoneNumber").optional().trim().matches(/^[0-9]{10}$/).withMessage("Phone number must be 10 digits"), body("currentPassword").optional().notEmpty().withMessage("Current password is required to change password"), body("newPassword").optional().isLength({
  min: 6
}).withMessage("New password must be at least 6 characters").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage("Password must contain at least one uppercase, lowercase, and number")]; // ===== PRODUCT VALIDATORS =====

var addProductValidator = [body("name").trim().notEmpty().withMessage("Product name is required").isLength({
  min: 3,
  max: 100
}).withMessage("Product name must be 3-100 characters"), body("description").trim().notEmpty().withMessage("Description is required").isLength({
  min: 10,
  max: 1000
}).withMessage("Description must be 10-1000 characters"), body("price").notEmpty().withMessage("Price is required").isFloat({
  min: 0
}).withMessage("Price must be a positive number"), body("category").trim().notEmpty().withMessage("Category is required"), body("stock").optional().isInt({
  min: 0
}).withMessage("Stock must be a non-negative integer")];
var productIdValidator = [param("id").notEmpty().withMessage("Product ID is required").isMongoId().withMessage("Invalid product ID")]; // ===== ORDER VALIDATORS =====

var createOrderValidator = [body("items").isArray({
  min: 1
}).withMessage("Order must contain at least one item"), body("items.*.productId").notEmpty().withMessage("Product ID is required").isMongoId().withMessage("Invalid product ID"), body("items.*.quantity").notEmpty().withMessage("Quantity is required").isInt({
  min: 1
}).withMessage("Quantity must be at least 1"), body("shippingAddress").trim().notEmpty().withMessage("Shipping address is required").isLength({
  min: 10,
  max: 200
}).withMessage("Address must be 10-200 characters"), body("phoneNumber").trim().notEmpty().withMessage("Phone number is required").matches(/^[0-9]{10}$/).withMessage("Phone number must be 10 digits")];
var orderIdValidator = [param("id").notEmpty().withMessage("Order ID is required").isMongoId().withMessage("Invalid order ID")]; // ===== PAGINATION VALIDATORS =====

var paginationValidator = [query("page").optional().isInt({
  min: 1
}).withMessage("Page must be a positive integer"), query("limit").optional().isInt({
  min: 1,
  max: 100
}).withMessage("Limit must be between 1 and 100")];
module.exports = {
  // Auth
  registerValidator: registerValidator,
  loginValidator: loginValidator,
  googleLoginValidator: googleLoginValidator,
  forgotPasswordValidator: forgotPasswordValidator,
  resetPasswordValidator: resetPasswordValidator,
  updateProfileValidator: updateProfileValidator,
  // Products
  addProductValidator: addProductValidator,
  productIdValidator: productIdValidator,
  // Orders
  createOrderValidator: createOrderValidator,
  orderIdValidator: orderIdValidator,
  // Pagination
  paginationValidator: paginationValidator
};