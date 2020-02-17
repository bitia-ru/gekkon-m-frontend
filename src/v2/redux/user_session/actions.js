import Api from '../../utils/Api';
import { acts as usersActs } from '../users/actions';


export const acts = {
  LOAD_USER_SESSION_REQUEST: 'LOAD_USER_SESSION_REQUEST',
  LOAD_USER_SESSION_FAILED: 'LOAD_USER_SESSION_FAILED',
  LOAD_USER_SESSION_SUCCESS: 'LOAD_USER_SESSION_SUCCESS',
};


export const loadUserSession = () => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_USER_SESSION_REQUEST,
    });

    Api.get(
      '/v1/users/self',
      {
        success(payload) {
          dispatch({
            type: acts.LOAD_USER_SESSION_SUCCESS,
            user_session: { user_id: payload.id },
          });
          dispatch({
            type: usersActs.LOAD_USERS,
            user: payload,
          });
        },
        failed() {
          dispatch({
            type: acts.LOAD_USER_SESSION_FAILED,
          });
        },
      },
    );
  }
);
