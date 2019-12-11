import * as acts from './constants/actions';

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
