// server/utils/queryHelpers.js

/**
 * Apply .lean() to read-only queries for better performance
 * Use this for GET endpoints where you don't need Mongoose methods
 */
const applyLean = (query) => {
  return query.lean();
};

/**
 * Build base query with soft delete filter
 */
const buildBaseQuery = (additionalFilters = {}) => {
  return {
    isDeleted: false,
    ...additionalFilters,
  };
};

/**
 * Pagination helper
 * @param {Object} query - Mongoose query object
 * @param {Number} page - Page number (default: 1)
 * @param {Number} limit - Items per page (default: 20)
 */
const paginate = (query, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

/**
 * Get pagination metadata
 */
const getPaginationMeta = async (model, filters, page, limit) => {
  const total = await model.countDocuments(filters);
  const totalPages = Math.ceil(total / limit);

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

module.exports = {
  applyLean,
  buildBaseQuery,
  paginate,
  getPaginationMeta,
};
