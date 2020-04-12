import * as R from 'ramda';
import * as acts from './constants/actions';
import DEFAULT_STORE_FORMAT from './constants/defaultStoreFormat';

const spotsStoreReducer = (
  state = DEFAULT_STORE_FORMAT,
  action,
) => {
  switch (action.type) {
  case acts.LOAD_SPOTS_REQUEST:
    return {
      ...state,
      numOfActiveRequests: state.numOfActiveRequests + 1,
    };
  case acts.LOAD_SPOTS_FAILED:
    return {
      ...state,
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.LOAD_SPOT_SUCCESS:
    return {
      ...state,
      spots: {
        ...state.spots,
        [action.spot.id]: action.spot,
      },
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  default:
    return state;
  }
};

export default spotsStoreReducer;
