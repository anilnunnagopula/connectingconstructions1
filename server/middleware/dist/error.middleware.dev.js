"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// server/middleware/error.middleware.js
// 404 handler - Route not found
var notFound = function notFound(req, res, next) {
  var error = new Error("Route not found - ".concat(req.originalUrl));
  res.status(404);
  next(error);
}; // Global error handler


var errorHandler = function errorHandler(err, req, res, next) {
  // Set status code (default to 500 if not set)
  var statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  var message = err.message; // Mongoose bad ObjectId (cast error)

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = "Resource not found - Invalid ID";
  } // Mongoose duplicate key error


  if (err.code === 11000) {
    statusCode = 400;
    var field = Object.keys(err.keyPattern)[0];
    message = "".concat(field.charAt(0).toUpperCase() + field.slice(1), " already exists");
  } // Mongoose validation error


  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map(function (val) {
      return val.message;
    }).join(", ");
  } // JWT errors


  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  } // Log error in development


  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  res.status(statusCode).json(_objectSpread({
    success: false,
    message: message
  }, process.env.NODE_ENV === "development" && {
    stack: err.stack
  }));
};

module.exports = {
  notFound: notFound,
  errorHandler: errorHandler
};