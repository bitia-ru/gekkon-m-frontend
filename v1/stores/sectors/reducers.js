import * as R from 'ramda';
import * as acts from './constants/actions';
import DEFAULT_STORE_FORMAT from './constants/defaultStoreFormat';

const sectorsStoreReducer = (
  state = DEFAULT_STORE_FORMAT,
  action,
) => {
  const stateCopy = R.clone(state);
  switch (action.type) {
  case acts.LOAD_SECTORS_REQUEST:
    stateCopy.numOfActiveRequests += 1;
    return stateCopy;
  case acts.LOAD_SECTORS_FAILED:
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.LOAD_SECTOR_SUCCESS:
    stateCopy.sectors[action.sector.id] = action.sector;
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.LOAD_SECTORS:
    stateCopy.sectors = R.mergeDeepRight(
      stateCopy.sectors,
      R.fromPairs(R.map(sector => [sector.id, sector], action.sectors)),
    );
    return stateCopy;
  default:
    return state;
  }
};

export default sectorsStoreReducer;
