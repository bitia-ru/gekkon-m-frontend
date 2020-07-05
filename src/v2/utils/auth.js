import bcrypt from 'bcryptjs';
import * as R from 'ramda';
import Api from '@/v2/utils/Api';


export const createUserSession = (
  loginCredential, // TODO: check structure: should be {login:...} or {email:...}
  password,
  longDuration,
  afterLogInSuccess,
  afterLogInFail,
) => {
  Api.get(
    '/v1/user_sessions/new',
    {
      params: { user_session: { user: loginCredential } },
      success(payload) {
        Api.post(
          '/v1/user_sessions',
          {
            user_session: {
              user: {
                ...loginCredential,
                password_digest: bcrypt.hashSync(password, payload),
              },
            },
            rememberMe: longDuration,
          },
          {
            success() {
              afterLogInSuccess && afterLogInSuccess();
            },
            failed(error) {
              let errorDetails;
              if (error && error.response && error.response.status === 400) {
                errorDetails = error.response.data;
              } else {
                //  dispatch(pushError(error));
              }
              afterLogInFail && afterLogInFail(errorDetails);
            },
          },
        );
      },
      failed(error) {
        const resp = error.response;
        let errorDetails;
        if (resp && resp.status === 404 && R.path(['data', 'model'], resp) === 'User') {
          errorDetails = { email: ['Пользователь не найден'] };
        } else {
          //  dispatch(pushError(error));
        }
        afterLogInFail && afterLogInFail(errorDetails);
      },
    },
  );
};

export const closeUserSession = () => {
  Api.patch(
    '/v1/user_sessions/actions/log_out',
    null,
    {
      success() {
        window.location.reload(true);
      },
      failed() {
        window.location.reload(true);
      },
    },
  );
};
