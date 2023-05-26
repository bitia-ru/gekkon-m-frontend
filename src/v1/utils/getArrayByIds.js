import * as R from 'ramda';

const getArrayByIds = (ids, data) => (
  R.pipe(
    R.map(id => data[id]),
    R.filter(e => e !== undefined),
  )(ids)
);

export default getArrayByIds;
