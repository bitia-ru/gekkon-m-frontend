import * as R from 'ramda';
import * as acts from './constants/actions';

const usersStoreReducer = (
  state = {
    numOfActiveRequests: 0,
    users: {},
    currentUserId: undefined,
    currentUserToken: null,
    sortedUserIds: [],
  },
  action,
) => {
  const stateCopy = R.clone(state);
  switch (action.type) {
  case acts.LOAD_USERS_REQUEST:
    stateCopy.numOfActiveRequests += 1;
    return stateCopy;
  case acts.LOAD_USERS_FAILED:
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.LOAD_USERS_SUCCESS:
    stateCopy.users = R.mergeDeepRight(
      stateCopy.users,
      R.fromPairs(R.map(user => [user.id, user], action.users)),
    );
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.LOAD_USER_SUCCESS:
    stateCopy.currentUserId = action.user.id;
    stateCopy.users[action.user.id] = action.user;
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.LOAD_TOKEN_SUCCESS:
    stateCopy.currentUserToken = action.token;
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.LOAD_TOKEN:
    stateCopy.currentUserToken = action.token;
    return stateCopy;
  case acts.LOAD_SORTED_USER_IDS:
    stateCopy.sortedUserIds = action.sortedUserIds;
    return stateCopy;
  case acts.LOGOUT_USER:
    stateCopy.currentUserToken = null;
    stateCopy.currentUserId = null;
    return stateCopy;
  case acts.LOGOUT_USER_SUCCESS:
    stateCopy.currentUserToken = null;
    stateCopy.currentUserId = null;
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.RESET_PASSWORD_SUCCESS:
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  case acts.SEND_RESET_PASSWORD_MAIL_SUCCESS:
    stateCopy.numOfActiveRequests -= 1;
    return stateCopy;
  default:
    return state;
  }
};

export default usersStoreReducer;
