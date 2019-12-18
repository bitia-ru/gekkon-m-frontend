import { createStore, applyMiddleware } from 'redux';
import * as R from 'ramda';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import USERS_DEFAULT_STORE_FORMAT from './stores/users/constants/defaultStoreFormat';
import SPOTS_DEFAULT_STORE_FORMAT from './stores/spots/constants/defaultStoreFormat';
import SECTORS_DEFAULT_STORE_FORMAT from './stores/sectors/constants/defaultStoreFormat';
import ROUTES_DEFAULT_STORE_FORMAT from './stores/routes/constants/defaultStoreFormat';
import ROUTE_MARK_COLORS_DEFAULT_STORE_FORMAT from './stores/route_mark_colors/constants/defaultStoreFormat';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    const data = JSON.parse(serializedState);
    const state = {};

    try {
      state.selectedViewModes = R.clone(data.selectedViewModes);
      state.selectedFilters = R.clone(data.selectedFilters);

      state.routeMarkColorsStore = ROUTE_MARK_COLORS_DEFAULT_STORE_FORMAT;
      state.routeMarkColorsStore.routeMarkColors = R.clone(data.routeMarkColors);

      state.routesStore = ROUTES_DEFAULT_STORE_FORMAT;
      state.routesStore.routes = R.clone(data.routes);
      state.routesStore.filtrationResults = R.clone(data.filtrationResults);

      state.spotsStore = SPOTS_DEFAULT_STORE_FORMAT;
      state.spotsStore.spots = R.clone(data.spots);

      state.sectorsStore = SECTORS_DEFAULT_STORE_FORMAT;
      state.sectorsStore.sectors = R.clone(data.sectors);

      state.usersStore = USERS_DEFAULT_STORE_FORMAT;
      state.usersStore.users = R.clone(data.users);
      state.usersStore.sortedUserIds = R.clone(data.sortedUserIds);
    } catch (err) {
      // ignore error
    }

    return state;
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const data = {};
    data.selectedViewModes = R.clone(state.selectedViewModes);
    data.selectedFilters = R.clone(state.selectedFilters);

    data.routes = R.clone(state.routesStore.routes);
    data.filtrationResults = R.clone(state.routesStore.filtrationResults);

    data.spots = R.clone(state.spotsStore.spots);

    data.sectors = R.clone(state.sectorsStore.sectors);

    data.users = R.clone(state.usersStore.users);
    data.sortedUserIds = R.clone(state.usersStore.sortedUserIds);

    data.routeMarkColors = R.clone(state.routeMarkColorsStore.routeMarkColors);
    const serializedState = JSON.stringify(data);
    localStorage.setItem('reduxState', serializedState);
  } catch (_err) {
    // ignore write errors
  }
};

const store = createStore(
  rootReducer,
  loadState(),
  applyMiddleware(thunk),
);

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
