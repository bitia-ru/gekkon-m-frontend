import store from '../store';
import { avail } from './index';
import { ApiUrl } from '../Environ';
import { loadSector } from '../stores/sectors/utils';
import { NUM_OF_DAYS } from '../Constants/Route';

const reloadSector = (sectorId) => {
  const state = store.getState();
  const user = state.usersStore.users[state.usersStore.currentUserId];
  const params = {};
  if (avail(user)) {
    params.user_id = user.id;
  }
  params.numOfDays = NUM_OF_DAYS;
  store.dispatch(loadSector(`${ApiUrl}/v1/sectors/${sectorId}`, params));
};

export default reloadSector;
