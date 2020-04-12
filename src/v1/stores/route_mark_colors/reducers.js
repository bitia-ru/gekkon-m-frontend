import * as R from 'ramda';
import * as acts from './constants/actions';
import DEFAULT_STORE_FORMAT from './constants/defaultStoreFormat';

const routeMarkColorsStoreReducer = (
  state = DEFAULT_STORE_FORMAT,
  action,
) => {
  switch (action.type) {
  case acts.LOAD_ROUTE_MARK_COLORS_REQUEST:
    return {
      ...state,
      numOfActiveRequests: state.numOfActiveRequests + 1,
    };
  case acts.LOAD_ROUTE_MARK_COLORS_FAILED:
    return {
      ...state,
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.LOAD_ROUTE_MARK_COLORS_SUCCESS:
    return {
      ...state,
      routeMarkColors: action.routeMarkColors,
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  default:
    return state;
  }
};

export default routeMarkColorsStoreReducer;
