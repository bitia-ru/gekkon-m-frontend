import * as R from 'ramda';
import * as acts from './constants/actions';
import DEFAULT_STORE_FORMAT from './constants/defaultStoreFormat';

const routesStoreReducer = (
  state = DEFAULT_STORE_FORMAT,
  action,
) => {
  const stateCopy = R.clone(state);
  switch (action.type) {
  case acts.LOAD_ROUTES_REQUEST:
    stateCopy.numOfActiveRequests += 1;
    return stateCopy;
  case acts.LOAD_ROUTES_FAILED:
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.LOAD_FILTRATION_RESULTS:
    stateCopy.filtrationResults[action.filtersKey] = action.filtrationResults;
    return stateCopy;
  case acts.LOAD_ROUTE_SUCCESS:
    stateCopy.routes[action.route.id] = action.route;
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.LOAD_ROUTES_SUCCESS:
    stateCopy.routes = R.mergeDeepRight(
      stateCopy.routes,
      R.fromPairs(R.map(route => [route.id, route], action.routes)),
    );
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.LOAD_ROUTE_DATA_SUCCESS:
    stateCopy.routes = R.mergeDeepRight(
      stateCopy.routes,
      R.fromPairs([[action.routeId, action.routeData]]),
    );
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.LOAD_ROUTE_PROPERTY_SUCCESS:
    stateCopy.routes = R.mergeDeepRight(
      stateCopy.routes,
      R.fromPairs(
        [[
          action.routeId,
          R.fromPairs(
            [[
              action.routePropertyName,
              R.fromPairs([[action.routePropertyData.id, action.routePropertyData]]),
            ]],
          ),
        ]],
      ),
    );
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.REMOVE_ROUTE_PROPERTY_BY_ID_SUCCESS:
    stateCopy.routes = R.dissocPath(
      [`${action.routeId}`, action.routePropertyName, `${action.routePropertyId}`],
      stateCopy.routes,
    );
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.REMOVE_ROUTE_SUCCESS:
    stateCopy.routes = R.dissoc(action.routeId, stateCopy.routes);
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  default:
    return state;
  }
};

export default routesStoreReducer;
