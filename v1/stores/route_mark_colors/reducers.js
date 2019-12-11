import * as R from 'ramda';
import * as acts from './constants/actions';

const routeMarkColorsStoreReducer = (
  state = {
    numOfActiveRequests: 0,
    routeMarkColors: [],
  },
  action,
) => {
  const stateCopy = R.clone(state);
  switch (action.type) {
  case acts.LOAD_ROUTE_MARK_COLORS_REQUEST:
    stateCopy.numOfActiveRequests += 1;
    return stateCopy;
  case acts.LOAD_ROUTE_MARK_COLORS_FAILED:
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.LOAD_ROUTE_MARK_COLORS_SUCCESS:
    stateCopy.routeMarkColors = action.routeMarkColors;
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  default:
    return state;
  }
};

export default routeMarkColorsStoreReducer;
