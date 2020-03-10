import Api from '@/v2/utils/Api';

export const acts = {
  LOAD_SPOTS: 'LOAD_SPOTS_V3',
};

export const loadSpots = () => (
  (dispatch) => {
    Api.get(
      '/v1/spots',
      {
        success(payload) {
          dispatch({
            type: acts.LOAD_SPOTS,
            spots: payload,
          });
        },
        failed(error) {
          console.log(error);
        },
      },
    );
  }
);
