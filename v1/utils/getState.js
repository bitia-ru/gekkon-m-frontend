import * as R from 'ramda';

const getState = state => (
  R.sum(
    R.map(
      store => store.numOfActiveRequests,
      [
        state.usersStore,
        state.spotsStore,
        state.sectorsStore,
        state.routesStore,
        state.routeMarkColorsStore,
      ],
    ),
  ) > 0
);

export default getState;
