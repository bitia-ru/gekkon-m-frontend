import Axios from 'axios';
import * as R from 'ramda';
import {
  loadSpotsRequest,
  loadSpotsFailed,
  loadSpotSuccess,
} from './actions';
import { loadSectors } from '../sectors/actions';
import numToStr from '../../../src/Constants/NumToStr';
import { setDefaultSelectedFilters, setDefaultSelectedPages } from '../../../src/actions';
import { DEFAULT_FILTERS } from '../../../src/Constants/DefaultFilters';

export const loadSpot = (url, params, currentSectorId, afterLoad) => (
  (dispatch, getState) => {
    const state = getState();
    const {
      selectedFilters,
      selectedPages,
    } = state;
    dispatch(loadSpotsRequest());

    Axios.get(url, { params, withCredentials: true })
      .then((response) => {
        const spot = response.data.payload;
        let infoData = [
          {
            count: response.data.metadata.num_of_sectors,
            label: numToStr(response.data.metadata.num_of_sectors, ['Зал', 'Зала', 'Залов']),
          },
          {
            count: response.data.metadata.num_of_routes,
            label: numToStr(response.data.metadata.num_of_routes, ['Трасса', 'Трассы', 'Трасс']),
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
        spot.infoData = infoData;
        spot.sectorIds = R.map(sector => sector.id, spot.sectors);
        dispatch(loadSpotSuccess(spot));
        if (!selectedFilters || selectedFilters[spot.id] === undefined) {
          dispatch(setDefaultSelectedFilters(
            spot.id,
            R.map(sector => sector.id, spot.sectors),
          ));
        }
        if (!selectedPages || selectedPages[spot.id] === undefined) {
          dispatch(setDefaultSelectedPages(
            spot.id,
            R.map(sector => sector.id, spot.sectors),
          ));
          const filters = R.merge(
            { sectorId: currentSectorId },
            (selectedFilters[spot.id] === undefined ? DEFAULT_FILTERS : {}),
          );
          if (afterLoad) {
            afterLoad(filters, 1, params.user_id);
          }
        } else if (afterLoad) {
          afterLoad({ sectorId: currentSectorId }, null, params.user_id);
        }
        dispatch(loadSectors(spot.sectors));
      }).catch((error) => {
        dispatch(loadSpotsFailed());
        // dispatch(pushError(error));
      });
  }
);
