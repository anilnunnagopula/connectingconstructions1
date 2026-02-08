"use strict";

// server/middleware/validation.middleware.js
var _require = require("express-validator"),
    validationResult = _require.validationResult; // Middleware to check validation results


var validate = function validate(req, res, next) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Format errors
    var formattedErrors = errors.array().map(function (err) {
      return {
        field: err.path || err.param,
        message: err.msg
      };
    });
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors
    });
  }

  next();
};

module.exports = {
  validate: validate
};