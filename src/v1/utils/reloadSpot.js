import store from '../store';
import { avail } from './index';
import { ApiUrl } from '../Environ';
import { loadSpot } from '../stores/spots/utils';

const reloadSpot = (spotId) => {
  const state = store.getState();
  const user = state.usersStore.users[state.usersStore.currentUserId];
  const params = {};
  if (avail(user)) {
    params.user_id = user.id;
  }
  store.dispatch(loadSpot(`${ApiUrl}/v1/spots/${spotId}`, params));
};

export default reloadSpot;
