import { combineReducers } from 'redux';
import * as R from 'ramda';
import * as acts from './Constants/Actions';
import { DEFAULT_FILTERS } from './Constants/DefaultFilters';
import routeMarkColorsStoreReducer from './stores/route_mark_colors/reducers';
import usersStoreReducer from './stores/users/reducers';
import routesStoreReducer from './stores/routes/reducers';
import sectorsStoreReducer from './stores/sectors/reducers';
import spotsStoreReducer from './stores/spots/reducers';

const tabReducer = (state = 1, action) => {
  switch (action.type) {
  case acts.CHANGE_TAB:
    return action.tab;
  default:
    return state;
  }
};

const selectedPagesReducer = (state = {}, action) => {
  let selectedPages;
  let sectorsDefaultPages;
  switch (action.type) {
  case acts.SET_DEFAULT_SELECTED_PAGES:
    selectedPages = R.clone(state);
    sectorsDefaultPages = R.map(sectorId => [sectorId, 1], action.sectorIds);
    selectedPages[action.spotId] = R.merge({ 0: 1 }, R.fromPairs(sectorsDefaultPages));
    return selectedPages;
  case acts.SET_SELECTED_PAGE:
    selectedPages = R.clone(state);
    selectedPages[action.spotId][action.sectorId] = action.page;
    return selectedPages;
  default:
    return state;
  }
};

const selectedViewModesReducer = (state = {}, action) => {
  let selectedViewModes;
  switch (action.type) {
  case acts.SET_SELECTED_VIEW_MODE:
    selectedViewModes = R.clone(state);
    selectedViewModes[action.spotId] = selectedViewModes[action.spotId] || {};
    selectedViewModes[action.spotId][action.sectorId] = action.viewMode;
    return selectedViewModes;
  default:
    return state;
  }
};

const selectedFiltersReducer = (state = {}, action) => {
  let selectedFilters;
  let routeFilters;
  switch (action.type) {
  case acts.SET_DEFAULT_SELECTED_FILTERS:
    selectedFilters = state === null ? {} : R.clone(state);
    routeFilters = localStorage.getItem('routeFilters');
    if (routeFilters) {
      selectedFilters = JSON.parse(routeFilters);
    }
    if (selectedFilters[action.spotId] === undefined) {
      const defaultFilters = R.merge(DEFAULT_FILTERS, { wasChanged: false });
      const sectorsDefaultFilters = R.map(
        sectorId => [sectorId, R.clone(defaultFilters)],
        action.sectorIds,
      );
      const spotFilters = R.merge(
        { 0: R.clone(defaultFilters) },
        R.fromPairs(sectorsDefaultFilters),
      );
      selectedFilters[action.spotId] = spotFilters;
    }
    return R.clone(selectedFilters);
  case acts.SET_SELECTED_FILTER:
    selectedFilters = R.clone(state);
    if (action.sectorId === 0) {
      const spotSelectedFilters = R.clone(selectedFilters[action.spotId]);
      selectedFilters[action.spotId] = R.map((filters) => {
        const filtersCopy = R.clone(filters);
        if (!filtersCopy.wasChanged) {
          filtersCopy[action.filterName] = action.filterValue;
        }
        return filtersCopy;
      }, spotSelectedFilters);
    } else {
      selectedFilters[action.spotId][action.sectorId][action.filterName] = action.filterValue;
      selectedFilters[action.spotId][action.sectorId].wasChanged = true;
    }
    return R.clone(selectedFilters);
  default:
    return state;
  }
};

export default combineReducers({
  tab: tabReducer,
  selectedPages: selectedPagesReducer,
  selectedFilters: selectedFiltersReducer,
  selectedViewModes: selectedViewModesReducer,
  routeMarkColorsStore: routeMarkColorsStoreReducer,
  usersStore: usersStoreReducer,
  spotsStore: spotsStoreReducer,
  sectorsStore: sectorsStoreReducer,
  routesStore: routesStoreReducer,
});
