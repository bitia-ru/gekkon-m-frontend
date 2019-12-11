import * as acts from './constants/actions';

export const loadRoutesRequest = () => ({
  type: acts.LOAD_ROUTES_REQUEST,
});

export const loadRoutesFailed = () => ({
  type: acts.LOAD_ROUTES_FAILED,
});

export const loadRouteSuccess = route => ({
  type: acts.LOAD_ROUTE_SUCCESS,
  route,
});

export const loadRoutesSuccess = routes => ({
  type: acts.LOAD_ROUTES_SUCCESS,
  routes,
});

export const loadRouteDataSuccess = (routeId, routeData) => ({
  type: acts.LOAD_ROUTE_DATA_SUCCESS,
  routeId,
  routeData,
});

export const loadRoutePropertySuccess = (routeId, routePropertyName, routePropertyData) => ({
  type: acts.LOAD_ROUTE_PROPERTY_SUCCESS,
  routeId,
  routePropertyName,
  routePropertyData,
});

export const removeRoutePropertyByIdSuccess = (routeId, routePropertyName, routePropertyId) => ({
  type: acts.REMOVE_ROUTE_PROPERTY_BY_ID_SUCCESS,
  routeId,
  routePropertyName,
  routePropertyId,
});

export const removeRouteSuccess = routeId => ({
  type: acts.REMOVE_ROUTE_SUCCESS,
  routeId,
});

export const loadFiltrationResults = (filtersKey, filtrationResults) => ({
  type: acts.LOAD_FILTRATION_RESULTS,
  filtersKey,
  filtrationResults,
});
