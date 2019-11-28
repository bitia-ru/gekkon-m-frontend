import Axios from 'axios';
import store from '../store';
import { ApiUrl } from '../../src/Environ';
import {
  decreaseNumOfActiveRequests,
  increaseNumOfActiveRequests,
  setSector,
} from '../../src/actions';
import { NUM_OF_DAYS } from '../../src/Constants/Route';

export const reloadSector = (id, userId, afterSuccess, afterFail) => {
  const params = {};
  if (userId) {
    params.user_id = userId;
  }
  params.numOfDays = NUM_OF_DAYS;
  store.dispatch(increaseNumOfActiveRequests());
  Axios.get(`${ApiUrl}/v1/sectors/${id}`, { params })
    .then((response) => {
      store.dispatch(decreaseNumOfActiveRequests());
      store.dispatch(setSector(response.data.payload));
      if (afterSuccess) {
        afterSuccess(response);
      }
    }).catch((error) => {
      store.dispatch(decreaseNumOfActiveRequests());
      if (afterFail) {
        afterFail(error);
      }
    });
};
