import * as acts from './Constants/Actions';

export const setRoutes = routes => ({
  type: acts.SET_ROUTES,
  routes,
});

export const setRoutesData = routesData => ({
  type: acts.SET_ROUTES_DATA,
  routesData,
});

export const setRoute = route => ({
  type: acts.SET_ROUTE,
  route,
});

export const setRouteData = (routeId, routeData) => ({
  type: acts.SET_ROUTE_DATA,
  routeId,
  routeData,
});

export const setRouteProperty = (routeId, routePropertyName, routePropertyData) => ({
  type: acts.SET_ROUTE_PROPERTY,
  routeId,
  routePropertyName,
  routePropertyData,
});

export const removeRoutePropertyById = (routeId, routePropertyName, routePropertyId) => ({
  type: acts.REMOVE_ROUTE_PROPERTY_BY_ID,
  routeId,
  routePropertyName,
  routePropertyId,
});

export const removeRoute = routeId => ({
  type: acts.REMOVE_ROUTE,
  routeId,
});

export const setRouteIds = routeIds => ({
  type: acts.SET_ROUTE_IDS,
  routeIds,
});

export const setSectorIds = sectorIds => ({
  type: acts.SET_SECTOR_IDS,
  sectorIds,
});

export const setSectors = sectors => ({
  type: acts.SET_SECTORS,
  sectors,
});

export const setSector = sector => ({
  type: acts.SET_SECTOR,
  sector,
});

export const setUsers = users => ({
  type: acts.SET_USERS,
  users,
});

export const saveUser = user => ({
  type: acts.SAVE_USER,
  user,
});

export const changeTab = tab => ({
  type: acts.CHANGE_TAB,
  tab,
});

export const saveToken = token => ({
  type: acts.SAVE_TOKEN,
  token,
});

export const removeToken = () => ({
  type: acts.REMOVE_TOKEN,
});

export const increaseNumOfActiveRequests = () => ({
  type: acts.INC_NUM_OF_ACTIVE_REQUESTS,
});

export const decreaseNumOfActiveRequests = () => ({
  type: acts.DEC_NUM_OF_ACTIVE_REQUESTS,
});

export const setSelectedPage = (spotId, sectorId, page) => ({
  type: acts.SET_SELECTED_PAGE,
  spotId,
  sectorId,
  page,
});

export const setDefaultSelectedPages = (spotId, sectorIds) => ({
  type: acts.SET_DEFAULT_SELECTED_PAGES,
  spotId,
  sectorIds,
});

export const setSelectedViewMode = (spotId, sectorId, viewMode) => ({
  type: acts.SET_SELECTED_VIEW_MODE,
  spotId,
  sectorId,
  viewMode,
});

export const setSelectedFilter = (spotId, sectorId, filterName, filterValue) => ({
  type: acts.SET_SELECTED_FILTER,
  spotId,
  sectorId,
  filterName,
  filterValue,
});

export const setDefaultSelectedFilters = (spotId, sectorIds) => ({
  type: acts.SET_DEFAULT_SELECTED_FILTERS,
  spotId,
  sectorIds,
});

export const loadFromLocalStorageSelectedFilters = () => ({
  type: acts.LOAD_FROM_LOCAL_STORAGE_SELECTED_FILTERS,
});

export const loadRouteMarkColors = routeMarkColors => ({
  type: acts.LOAD_ROUTE_MARK_COLORS,
  routeMarkColors,
});
