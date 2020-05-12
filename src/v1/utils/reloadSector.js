import { avail } from './index';
import { ApiUrl } from '../Environ';
import { loadSector } from '../stores/sectors/utils';
import { NUM_OF_DAYS } from '../Constants/Route';

export const reloadSector = sectorId => (
  (dispatch, getState) => {
    const state = getState();
    const user = state.usersStore.users[state.usersStore.currentUserId];
    const params = {};
    if (avail(user)) {
      params.user_id = user.id;
    }
    params.numOfDays = NUM_OF_DAYS;
    dispatch(loadSector(`${ApiUrl}/v1/sectors/${sectorId}`, params));
  }
);
