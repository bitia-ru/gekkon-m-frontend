import Api from '../../utils/Api';

export const acts = {
  UPDATE_USERS: 'UPDATE_USERS_V2',
  LOAD_USERS_REQUEST: 'LOAD_USERS_REQUEST_V2',
  LOAD_SPECIFIC_USER_REQUEST: 'LOAD_SPECIFIC_USER_REQUEST_V2',
  LOAD_USERS_FAILED: 'LOAD_USER_FAILED_V2',
  LOAD_USERS_SUCCESS: 'LOAD_USERS_SUCCESS_V2',
  LOAD_USERS: 'LOAD_USERS_V2',
};

export const loadSpecificUser = userId => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_SPECIFIC_USER_REQUEST,
      userId,
    });

    Api.get(
      `/v1/users/${userId}`,
      {
        success(payload) {
          dispatch({
            type: acts.LOAD_USERS_SUCCESS,
            user: payload,
          });
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_USERS_FAILED,
          });

          console.log(error);
        },
      },
    );
  }
);

export const updateUsers = users => (
  {
    type: acts.UPDATE_USERS,
    users,
  }
);

export const loadUsers = () => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_USERS_REQUEST,
    });

    Api.get(
      '/v1/users',
      {
        success(payload) {
          dispatch({
            type: acts.LOAD_USERS_SUCCESS,
            users: payload,
          });
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_USERS_FAILED,
          });

          console.log(error);
        },
      },
    );
  }
);
