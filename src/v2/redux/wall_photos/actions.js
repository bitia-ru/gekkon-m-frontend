import Api from '../../utils/Api';
import toastHttpError from '@/v2/utils/toastHttpError';

export const acts = {
  LOAD_PHOTOS_REQUEST: 'LOAD_PHOTOS_REQUEST_V2',
  LOAD_PHOTOS_FAILED: 'LOAD_USER_FAILED_V2',
  LOAD_PHOTOS_SUCCESS: 'LOAD_PHOTOS_SUCCESS_V2',
  LOAD_PHOTO_SUCCESS: 'LOAD_PHOTO_SUCCESS_V2',
};

export const loadWallPhotos = sectorId => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_PHOTOS_REQUEST,
    });

    Api.get(
      `/v1/sectors/${sectorId}/wall_photos`,
      {
        success(payload) {
          dispatch({
            type: acts.LOAD_PHOTOS_SUCCESS,
            wall_photos: payload,
          });
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_PHOTOS_FAILED,
          });
          toastHttpError(error);
        },
      },
    );
  }
);

export const addWallPhoto = (params, afterSuccess, afterAll) => (
  (dispatch) => {
    dispatch({ type: acts.LOAD_PHOTOS_REQUEST });

    Api.post(
      '/v1/wall_photos',
      params,
      {
        method: 'post',
        type: 'form-multipart',
        success(payload) {
          dispatch({
            type: acts.LOAD_PHOTO_SUCCESS,
            wallPhoto: payload,
          });
          afterSuccess && afterSuccess(payload);
          afterAll && afterAll();
        },
        failed(error) {
          dispatch({ type: acts.LOAD_PHOTOS_FAILED });
          afterAll && afterAll();

          toastHttpError(error);
        },
      },
    );
  }
);
