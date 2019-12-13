const getFromFilters = (filters, paramName, defaultValue) => (
  (filters[paramName] === null || filters[paramName] === undefined)
    ? defaultValue
    : filters[paramName]
);

export default getFromFilters;
