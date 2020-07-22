import { combineReducers } from 'redux';
import * as R from 'ramda';
import * as acts from './Constants/Actions';
import { DEFAULT_FILTERS } from './Constants/DefaultFilters';
import routeMarkColorsStoreReducer from './stores/route_mark_colors/reducers';
import usersStoreReducer from './stores/users/reducers';
import routesStoreReducer from './stores/routes/reducers';
import sectorsStoreReducer from './stores/sectors/reducers';
import newsStoreReducer from './stores/news/reducers';
import { default as usersReducerV2 } from '@/v2/redux/users/reducer';
import { default as userSessionReducerV2 } from '@/v2/redux/user_session/reducer';
import { default as spotsStoreReducerV2 } from '@/v2/redux/spots/reducer';

const tabReducer = (state = 1, action) => {
  switch (action.type) {
  case acts.CHANGE_TAB:
    return action.tab;
  default:
    return state;
  }
};

const selectedPagesReducer = (state = {}, action) => {
  let sectorsDefaultPages;
  switch (action.type) {
  case acts.SET_DEFAULT_SELECTED_PAGES:
    sectorsDefaultPages = R.map(sectorId => [sectorId, 1], action.sectorIds);
    return {
      ...state,
      [action.spotId]: {
        0: 1,
        ...R.fromPairs(sectorsDefaultPages),
      },
    };
  case acts.SET_SELECTED_PAGE:
    return {
      ...state,
      [action.spotId]: {
        ...state[action.spotId],
        [action.sectorId]: action.page,
      },
    };
  default:
    return state;
  }
};

const selectedViewModesReducer = (state = {}, action) => {
  switch (action.type) {
  case acts.SET_SELECTED_VIEW_MODE:
    return {
      ...state,
      [action.spotId]: {
        ...state[action.spotId],
        [action.sectorId]: action.viewMode,
      },
    };
  default:
    return state;
  }
};

const selectedFiltersReducer = (state = {}, action) => {
  let selectedFilters;
  let routeFilters;
  switch (action.type) {
  case acts.SET_DEFAULT_SELECTED_FILTERS:
    selectedFilters = state === null ? {} : { ...state };
    routeFilters = localStorage.getItem('routeFilters');
    if (routeFilters) {
      selectedFilters = JSON.parse(routeFilters);
    }
    if (selectedFilters[action.spotId] === undefined) {
      const defaultFilters = {
        ...DEFAULT_FILTERS,
        wasChanged: false,
      };
      const sectorsDefaultFilters = R.map(
        sectorId => [sectorId, defaultFilters],
        action.sectorIds,
      );
      selectedFilters[action.spotId] = {
        0: defaultFilters,
        ...R.fromPairs(sectorsDefaultFilters),
      };
    }
    return selectedFilters;
  case acts.SET_SELECTED_FILTER:
    selectedFilters = { ...state };
    if (action.sectorId === 0) {
      const spotSelectedFilters = { ...selectedFilters[action.spotId] };
      selectedFilters[action.spotId] = R.map(
        (filters) => {
          const filtersCopy = { ...filters };
          if (!filtersCopy.wasChanged) {
            return action.filters;
          }
          return filtersCopy;
        },
        spotSelectedFilters,
      );
    } else {
      selectedFilters[action.spotId][action.sectorId] = action.filters;
      selectedFilters[action.spotId][action.sectorId].wasChanged = true;
    }
    return selectedFilters;
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
  spotsStoreV2: spotsStoreReducerV2,
  sectorsStore: sectorsStoreReducer,
  routesStore: routesStoreReducer,
  newsStore: newsStoreReducer,
  usersStoreV2: usersReducerV2,
  userSessionV2: userSessionReducerV2,
});
