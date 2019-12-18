import * as R from 'ramda';

const getArrayByIds = (ids, data) => (
  R.map(p => p[1], R.filter(p => R.contains(parseInt(p[0], 10), ids), R.toPairs(data)))
);

export default getArrayByIds;
