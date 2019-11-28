import * as R from 'ramda';

const getArrayFromObject = data => (
  R.map(e => e[1], R.toPairs(data))
);

export default getArrayFromObject;
