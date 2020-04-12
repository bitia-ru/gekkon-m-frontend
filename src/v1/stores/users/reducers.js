import * as R from 'ramda';
import * as acts from './constants/actions';
import DEFAULT_STORE_FORMAT from './constants/defaultStoreFormat';

const usersStoreReducer = (
  state = DEFAULT_STORE_FORMAT,
  action,
) => {
  switch (action.type) {
  case acts.LOAD_USERS_REQUEST:
    return {
      ...state,
      numOfActiveRequests: state.numOfActiveRequests + 1,
    };
  case acts.LOAD_USERS_FAILED:
    return {
      ...state,
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.LOAD_USERS_SUCCESS:
    return {
      ...state,
      users: R.mergeDeepRight(
        state.users,
        R.fromPairs(R.map(user => [user.id, user], action.users)),
      ),
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.LOAD_USER_SUCCESS:
    return {
      ...state,
      currentUserId: action.user.id,
      users: {
        ...state.users,
        [action.user.id]: action.user,
      },
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.LOAD_SORTED_USER_IDS:
    return {
      ...state,
      sortedUserIds: action.sortedUserIds,
    };
  case acts.LOGOUT_USER_SUCCESS:
    return {
      ...state,
      currentUserId: null,
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.RESET_PASSWORD_SUCCESS:
    return {
      ...state,
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.SEND_RESET_PASSWORD_MAIL_SUCCESS:
    return {
      ...state,
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  case acts.LOGIN_SUCCESS:
    return {
      ...state,
      numOfActiveRequests: state.numOfActiveRequests - 1,
    };
  default:
    return state;
  }
};

export default usersStoreReducer;
