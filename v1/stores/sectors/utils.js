import Axios from 'axios';
import * as R from 'ramda';
import {
  loadSectorsRequest,
  loadSectorsFailed,
  loadSectorSuccess,
} from './actions';
import numToStr from '../../../src/Constants/NumToStr';

export const loadSector = (url, params, afterLoad) => (
  (dispatch) => {
    dispatch(loadSectorsRequest());

    Axios.get(url, { params, withCredentials: true })
      .then((response) => {
        const sector = response.data.payload;
        let infoData = [
          {
            count: response.data.metadata.num_of_routes,
            label: numToStr(response.data.metadata.num_of_routes, ['Трасса', 'Трассы', 'Трасс']),
          },
          {
            count: response.data.metadata.num_of_new_routes,
            label: numToStr(
              response.data.metadata.num_of_new_routes,
              ['Новая трасса', 'Новые трассы', 'Новых трасс'],
            ),
          },
        ];
        if (params.user_id) {
          infoData = R.append({
            count: response.data.metadata.num_of_unfulfilled,
            label: numToStr(
              response.data.metadata.num_of_unfulfilled,
              ['Невыполненная трасса', 'Невыполненные трассы', 'Невыполненных трасс'],
            ),
          }, infoData);
        }
        sector.infoData = infoData;
        dispatch(loadSectorSuccess(sector));
        if (afterLoad) {
          afterLoad(response);
        }
      }).catch((error) => {
        dispatch(loadSectorsFailed());
        // dispatch(pushError(error));
      });
  }
);
