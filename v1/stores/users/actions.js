import * as acts from './constants/actions';

export const loadUsersRequest = () => ({
  type: acts.LOAD_USERS_REQUEST,
});

export const loadUsersFailed = () => ({
  type: acts.LOAD_USERS_FAILED,
});

export const loadUsersSuccess = users => ({
  type: acts.LOAD_USERS_SUCCESS,
  users,
});

export const loadUserSuccess = user => ({
  type: acts.LOAD_USER_SUCCESS,
  user,
});

export const loadSortedUserIds = sortedUserIds => ({
  type: acts.LOAD_SORTED_USER_IDS,
  sortedUserIds,
});

export const logOutUser = () => ({
  type: acts.LOGOUT_USER,
});

export const logOutUserSuccess = () => ({
  type: acts.LOGOUT_USER_SUCCESS,
});

export const resetPasswordSuccess = () => ({
  type: acts.RESET_PASSWORD_SUCCESS,
});

export const sendResetPasswordMailSuccess = () => ({
  type: acts.SEND_RESET_PASSWORD_MAIL_SUCCESS,
});

export const logInSuccess = () => ({
  type: acts.LOGIN_SUCCESS,
});
