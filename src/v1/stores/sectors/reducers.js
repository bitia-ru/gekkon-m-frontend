import * as R from 'ramda';
import * as acts from './constants/actions';
import DEFAULT_STORE_FORMAT from './constants/defaultStoreFormat';

const sectorsStoreReducer = (
  state = DEFAULT_STORE_FORMAT,
  action,
) => {
  switch (action.type) {
  case acts.LOAD_SECTORS_REQUEST:
    return {
      ...state,
      numOfActiveRequests: state.numOfActiveRequests + 1,
    };
  case acts.LOAD_SECTORS_FAILED:
    return {
      ...state,
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.LOAD_SECTOR_SUCCESS:
    return {
      ...state,
      sectors: {
        ...state.sectors,
        [action.sector.id]: action.sector,
      },
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.LOAD_SECTORS:
    return {
      ...state,
      sectors: R.mergeDeepRight(
        state.sectors,
        R.fromPairs(R.map(sector => [sector.id, sector], action.sectors)),
      ),
    };
  default:
    return state;
  }
};

export default sectorsStoreReducer;
