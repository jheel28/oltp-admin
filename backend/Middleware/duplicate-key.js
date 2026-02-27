const parseDuplicateKeyError = (err, fieldLabels = {}) => {
  if (err.code !== 11000 && err.code !== 11001) return null;
  const keyPattern = err.keyPattern || {};
  const field = Object.keys(keyPattern)[0];

  if (field) {
    const label = fieldLabels[field] || field;
    return `A record with this ${label} already exists. Please use a different value.`;
  }

  const match =
    (err.message || "").match(/index: \S+\$(\w+)_1/) ||
    (err.message || "").match(/index: (\w+)_1/);
  if (match) {
    const label = fieldLabels[match[1]] || match[1];
    return `A record with this ${label} already exists. Please use a different value.`;
  }

  return "A record with one or more of these values already exists.";
};

module.exports = { parseDuplicateKeyError };