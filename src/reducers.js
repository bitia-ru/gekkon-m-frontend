import { combineReducers } from 'redux';
import * as R from 'ramda';
import * as acts from './Constants/Actions';
import { DEFAULT_FILTERS } from './Constants/DefaultFilters';

const routesReducer = (state = {}, action) => {
  let index;
  switch (action.type) {
  case acts.LOAD_ROUTES:
    return {
      ...state,
      [action.spotId]: ({
        ...state[action.spotId],
        [action.sectorId]: action.routes,
      } || {}),
    };
  case acts.ADD_ROUTE:
    return {
      ...state,
      [action.spotId]: ({
        ...state[action.spotId],
        [action.sectorId]: R.append(
          action.route,
          state[action.spotId][action.sectorId],
        ),
      } || {}),
    };
  case acts.UPDATE_ROUTE:
    index = R.findIndex(R.propEq('id', action.id))(state[action.spotId][action.sectorId]);
    return {
      ...state,
      [action.spotId]: {
        ...state[action.spotId],
        [action.sectorId]: {
          ...state[action.spotId][action.sectorId],
          [index]: action.route,
        },
      },
    };
  default:
    return state;
  }
};

const sectorsReducer = (state = [], action) => {
  switch (action.type) {
  case acts.LOAD_SECTORS:
    return action.sectors;
  default:
    return state;
  }
};

const userReducer = (state = {}, action) => {
  switch (action.type) {
  case acts.SAVE_USER:
    return action.user;
  default:
    return state;
  }
};

const tabReducer = (state = 1, action) => {
  switch (action.type) {
  case acts.CHANGE_TAB:
    return action.tab;
  default:
    return state;
  }
};

const tokenReducer = (state = null, action) => {
  switch (action.type) {
  case acts.SAVE_TOKEN:
    return action.token;
  case acts.REMOVE_TOKEN:
    return null;
  default:
    return state;
  }
};

const numOfActiveRequestsReducer = (state = 0, action) => {
  switch (action.type) {
  case acts.INC_NUM_OF_ACTIVE_REQUESTS:
    return state + 1;
  case acts.DEC_NUM_OF_ACTIVE_REQUESTS:
    return state - 1;
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
      [action.spotId]: R.merge({ 0: 1 }, R.fromPairs(sectorsDefaultPages)),
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
  let selectedViewModes;
  switch (action.type) {
  case acts.SET_SELECTED_VIEW_MODE:
    selectedViewModes = {
      ...state,
      [action.spotId]: ({
        ...state[action.spotId],
        [action.sectorId]: action.viewMode,
      } || {}),
    };
    localStorage.setItem('viewModes', JSON.stringify(selectedViewModes));
    return selectedViewModes;
  default:
    if (R.equals(state, {})) {
      selectedViewModes = localStorage.getItem('viewModes');
      selectedViewModes = selectedViewModes ? JSON.parse(selectedViewModes) : {};
    } else {
      selectedViewModes = {
        ...state,
      };
    }
    return selectedViewModes;
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
      const defaultFilters = R.merge(DEFAULT_FILTERS, { wasChanged: false });
      const sectorsDefaultFilters = R.map(
        sectorId => [sectorId, { ...defaultFilters }],
        action.sectorIds,
      );
      const spotFilters = R.merge(
        { 0: { ...defaultFilters } },
        R.fromPairs(sectorsDefaultFilters),
      );
      selectedFilters[action.spotId] = spotFilters;
      localStorage.setItem('routeFilters', JSON.stringify(selectedFilters));
    }
    return { ...selectedFilters };
  case acts.SET_SELECTED_FILTER:
    selectedFilters = { ...state };
    if (action.sectorId === 0) {
      const spotSelectedFilters = { ...selectedFilters[action.spotId] };
      selectedFilters[action.spotId] = R.map((filters) => {
        const filtersCopy = { ...filters };
        if (!filtersCopy.wasChanged) {
          filtersCopy[action.filterName] = action.filterValue;
        }
        return filtersCopy;
      }, spotSelectedFilters);
    } else {
      selectedFilters[action.spotId][action.sectorId][action.filterName] = action.filterValue;
      selectedFilters[action.spotId][action.sectorId].wasChanged = true;
    }
    localStorage.setItem('routeFilters', JSON.stringify(selectedFilters));
    return { ...selectedFilters };
  case acts.LOAD_FROM_LOCAL_STORAGE_SELECTED_FILTERS:
    routeFilters = localStorage.getItem('routeFilters');
    if (routeFilters === undefined) {
      routeFilters = {};
    } else {
      routeFilters = JSON.parse(routeFilters);
    }
    return routeFilters;
  default:
    return state;
  }
};

const routeMarkColorsReducer = (state = [], action) => {
  switch (action.type) {
  case acts.LOAD_ROUTE_MARK_COLORS:
    return action.routeMarkColors;
  default:
    return state;
  }
};

export default combineReducers({
  routes: routesReducer,
  sectors: sectorsReducer,
  user: userReducer,
  tab: tabReducer,
  token: tokenReducer,
  numOfActiveRequests: numOfActiveRequestsReducer,
  selectedPages: selectedPagesReducer,
  selectedFilters: selectedFiltersReducer,
  routeMarkColors: routeMarkColorsReducer,
  selectedViewModes: selectedViewModesReducer,
});
