import * as R from 'ramda';

const getObjectFromArray = data => (
  R.fromPairs(R.map(e => [e.id, e], data))
);

export default getObjectFromArray;
