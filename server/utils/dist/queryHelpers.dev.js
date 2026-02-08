"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// server/utils/queryHelpers.js

/**
 * Apply .lean() to read-only queries for better performance
 * Use this for GET endpoints where you don't need Mongoose methods
 */
var applyLean = function applyLean(query) {
  return query.lean();
};
/**
 * Build base query with soft delete filter
 */


var buildBaseQuery = function buildBaseQuery() {
  var additionalFilters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _objectSpread({
    isDeleted: false
  }, additionalFilters);
};
/**
 * Pagination helper
 * @param {Object} query - Mongoose query object
 * @param {Number} page - Page number (default: 1)
 * @param {Number} limit - Items per page (default: 20)
 */


var paginate = function paginate(query) {
  var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;
  var skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};
/**
 * Get pagination metadata
 */


var getPaginationMeta = function getPaginationMeta(model, filters, page, limit) {
  var total, totalPages;
  return regeneratorRuntime.async(function getPaginationMeta$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(model.countDocuments(filters));

        case 2:
          total = _context.sent;
          totalPages = Math.ceil(total / limit);
          return _context.abrupt("return", {
            currentPage: page,
            totalPages: totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = {
  applyLean: applyLean,
  buildBaseQuery: buildBaseQuery,
  paginate: paginate,
  getPaginationMeta: getPaginationMeta
};