const ensureNullIfUndefined = (value) => {
  return value === "undefined" ||
    value === undefined ||
    value == "" ||
    value == "null"
    ? null
    : value;
};

module.exports = {
  ensureNullIfUndefined,
};
