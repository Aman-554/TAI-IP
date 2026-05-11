/**
 * Build a MongoDB sort object from a query string param.
 * e.g. "-createdAt,title" => { createdAt: -1, title: 1 }
 */
export const buildSort = (sortStr = '-createdAt') => {
  return sortStr.split(',').reduce((acc, field) => {
    if (field.startsWith('-')) acc[field.slice(1)] = -1;
    else acc[field] = 1;
    return acc;
  }, {});
};

/**
 * Pick only allowed fields from an object.
 */
export const filterObject = (obj, ...allowedFields) => {
  return allowedFields.reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
    return acc;
  }, {});
};

/**
 * Generate a random integer between min and max (inclusive).
 */
export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Paginate a Mongoose query.
 * Returns { data, pagination }.
 */
export const paginate = async (query, page = 1, limit = 12) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    query.skip(skip).limit(limit),
    query.model.countDocuments(query.getFilter()),
  ]);
  return {
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};
