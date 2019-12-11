import * as acts from './constants/actions';

export const loadRouteMarkColorsRequest = () => ({
  type: acts.LOAD_ROUTE_MARK_COLORS_REQUEST,
});

export const loadRouteMarkColorsFailed = () => ({
  type: acts.LOAD_ROUTE_MARK_COLORS_FAILED,
});

export const loadRouteMarkColorsSuccess = routeMarkColors => ({
  type: acts.LOAD_ROUTE_MARK_COLORS_SUCCESS,
  routeMarkColors,
});
