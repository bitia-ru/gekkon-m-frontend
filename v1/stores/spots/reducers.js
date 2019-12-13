import * as R from 'ramda';
import * as acts from './constants/actions';
import DEFAULT_STORE_FORMAT from './constants/defaultStoreFormat';

const spotsStoreReducer = (
  state = DEFAULT_STORE_FORMAT,
  action,
) => {
  const stateCopy = R.clone(state);
  switch (action.type) {
  case acts.LOAD_SPOTS_REQUEST:
    stateCopy.numOfActiveRequests += 1;
    return stateCopy;
  case acts.LOAD_SPOTS_FAILED:
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.LOAD_SPOT_SUCCESS:
    stateCopy.spots[action.spot.id] = action.spot;
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  default:
    return state;
  }
};

export default spotsStoreReducer;
