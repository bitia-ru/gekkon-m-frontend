import { combineReducers } from 'redux';
import * as R from 'ramda';
import * as acts from './Constants/Actions';
import { DEFAULT_FILTERS } from './Constants/DefaultFilters';

const routesReducer = (state = {}, action) => {
  switch (action.type) {
  case acts.SET_ROUTES:
    return R.mergeDeepRight(
      state,
      R.fromPairs(R.map(route => [route.id, route], action.routes)),
    );
  case acts.SET_ROUTES_DATA:
    return R.mergeDeepRight(
      state,
      R.fromPairs(R.map(data => [data.routeId, data.content], action.routesData)),
    );
  case acts.SET_ROUTE:
    return R.mergeDeepRight(
      state,
      R.fromPairs([[action.route.id, action.route]]),
    );
  case acts.SET_ROUTE_DATA:
    return R.mergeDeepRight(
      state,
      R.fromPairs([[action.routeId, action.routeData]]),
    );
  case acts.SET_ROUTE_PROPERTY:
    return R.mergeDeepRight(
      state,
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
  case acts.REMOVE_ROUTE_PROPERTY_BY_ID:
    return R.dissocPath(
      [`${action.routeId}`, action.routePropertyName, `${action.routePropertyId}`],
      state,
    );
  case acts.REMOVE_ROUTE:
    return R.dissoc(action.routeId, state);
  default:
    return state;
  }
};

const routeIdsReducer = (state = [], action) => {
  switch (action.type) {
  case acts.SET_ROUTE_IDS:
    return action.routeIds;
  default:
    return state;
  }
};

const sectorsReducer = (state = {}, action) => {
  switch (action.type) {
  case acts.SET_SECTORS:
    return R.mergeDeepRight(
      state,
      R.fromPairs(R.map(sector => [sector.id, sector], action.sectors)),
    );
  case acts.SET_SECTOR:
    return R.mergeDeepRight(
      state,
      R.fromPairs([[action.sector.id, action.sector]]),
    );
  default:
    return state;
  }
};

const sectorIdsReducer = (state = [], action) => {
  switch (action.type) {
  case acts.SET_SECTOR_IDS:
    return action.sectorIds;
  default:
    return state;
  }
};

const usersReducer = (state = [], action) => {
  switch (action.type) {
  case acts.SET_USERS:
    return action.users;
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
    localStorage.setItem('viewModes', JSON.stringify(selectedViewModes));
    return selectedViewModes;
  default:
    if (R.equals(state, {})) {
      selectedViewModes = localStorage.getItem('viewModes');
      selectedViewModes = selectedViewModes ? JSON.parse(selectedViewModes) : {};
    } else {
      selectedViewModes = R.clone(state);
    }
    return selectedViewModes;
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
      localStorage.setItem('routeFilters', JSON.stringify(selectedFilters));
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
    localStorage.setItem('routeFilters', JSON.stringify(selectedFilters));
    return R.clone(selectedFilters);
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
  routeIds: routeIdsReducer,
  sectors: sectorsReducer,
  sectorIds: sectorIdsReducer,
  user: userReducer,
  users: usersReducer,
  tab: tabReducer,
  token: tokenReducer,
  numOfActiveRequests: numOfActiveRequestsReducer,
  selectedPages: selectedPagesReducer,
  selectedFilters: selectedFiltersReducer,
  routeMarkColors: routeMarkColorsReducer,
  selectedViewModes: selectedViewModesReducer,
});
