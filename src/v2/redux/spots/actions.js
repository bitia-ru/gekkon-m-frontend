import * as R from 'ramda';
import Api from '../../utils/Api';
import toastHttpError from '@/v2/utils/toastHttpError';
import numToStr from '@/v1/Constants/NumToStr';
import { setDefaultSelectedFilters } from '@/v2/redux/selectedFilters/actions';
import { setDefaultSelectedPages } from '@/v1/actions';
import { loadSectors } from '@/v1/stores/sectors/actions';

export const acts = {
  LOAD_SPOTS_SUCCESS: 'LOAD_SPOTS_SUCCESS_V2',
  LOAD_SPOTS_REQUEST: 'LOAD_SPOTS_REQUEST_V2',
  LOAD_SPOTS_FAILED: 'LOAD_SPOTS_FAILED_V2',
  LOAD_SPOT_SUCCESS: 'LOAD_SPOT_SUCCESS_V2',
};

export const loadSpotsRequest = () => ({
  type: acts.LOAD_SPOTS_REQUEST,
});

export const loadSpotsFailed = () => ({
  type: acts.LOAD_SPOTS_FAILED,
});

export const loadSpotSuccess = spot => ({
  type: acts.LOAD_SPOT_SUCCESS,
  spot,
});

export const loadSpots = () => (
  (dispatch) => {
    dispatch({ type: acts.LOAD_SPOTS_REQUEST });

    Api.get(
      '/v1/spots',
      {
        success(payload) {
          dispatch({ type: acts.LOAD_SPOTS_SUCCESS, spots: payload });
        },
        failed(error) {
          dispatch({ type: acts.LOAD_SPOTS_FAILED });

          toastHttpError(error);
        },
      },
    );
  }
);

export const loadSpot = (id, params = {}) => (
  (dispatch, getState) => {
    const state = getState();
    const {
      selectedFilters,
      selectedPages,
    } = state;
    dispatch(loadSpotsRequest());

    Api.get(
      `/v1/spots/${id}`,
      {
        params,
        success(payload, metadata) {
          const spot = payload;

          let infoData = [
            {
              count: metadata.num_of_sectors,
              label: numToStr(metadata.num_of_sectors, ['Зал', 'Зала', 'Залов']),
            },
            {
              count: metadata.num_of_routes,
              label: numToStr(metadata.num_of_routes, ['Трасса', 'Трассы', 'Трасс']),
            },
          ];

          if (params.user_id) {
            infoData = R.append({
              count: metadata.num_of_unfulfilled,
              label: numToStr(
                metadata.num_of_unfulfilled,
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
          }
          dispatch(loadSectors(spot.sectors));
        },
        failed(error) {
          dispatch(loadSpotsFailed());
          toastHttpError(error);
        },
      },
    );
  }
);
