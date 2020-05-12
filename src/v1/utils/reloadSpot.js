import { avail } from './index';
import { ApiUrl } from '../Environ';
import { loadSpot } from '../stores/spots/utils';

export const reloadSpot = spotId => (
  (dispatch, getState) => {
    const state = getState();
    const user = state.usersStore.users[state.usersStore.currentUserId];
    const params = {};
    if (avail(user)) {
      params.user_id = user.id;
    }
    dispatch(loadSpot(`${ApiUrl}/v1/spots/${spotId}`, params));
  }
);
