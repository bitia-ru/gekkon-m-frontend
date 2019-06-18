import * as acts from './Constants/Actions';

export const loadRoutes = (spotId, sectorId, routes) => ({
  type: acts.LOAD_ROUTES,
  spotId,
  sectorId,
  routes,
});

export const updateRoute = (spotId, sectorId, id, route) => ({
  type: acts.UPDATE_ROUTE,
  spotId,
  sectorId,
  id,
  route,
});

export const addRoute = (spotId, sectorId, route) => ({
  type: acts.ADD_ROUTE,
  spotId,
  sectorId,
  route,
});

export const loadSectors = sectors => ({
  type: acts.LOAD_SECTORS,
  sectors,
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
