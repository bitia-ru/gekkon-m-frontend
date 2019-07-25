import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import Axios from 'axios/index';
import bcrypt from 'bcryptjs';
import * as R from 'ramda';
import SALT_ROUNDS from './Constants/Bcrypt';
import { domain } from './Constants/Cookies';
import ApiUrl from './ApiUrl';
import { CLIENT_ID, REDIRECT_URI } from './Constants/Vk';
import RE_EMAIL from './Constants/Constraints';

export default class Authorization extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signUpFormVisible: false,
      logInFormVisible: false,
      profileFormVisible: window.location.hash === '#profile',
      resetPasswordFormVisible: false,
      signUpFormErrors: {},
      logInFormErrors: {},
      profileFormErrors: {},
      resetPasswordFormErrors: {},
      signUpIsWaiting: false,
      logInIsWaiting: false,
      resetPasswordIsWaiting: false,
      profileIsWaiting: false,
    };
  }

  logOut = () => {
    const {
      token,
      saveUser,
      removeToken,
      increaseNumOfActiveRequests,
      decreaseNumOfActiveRequests,
    } = this.props;
    increaseNumOfActiveRequests();
    Axios({
      url: `${ApiUrl}/v1/user_sessions/actions/log_out`,
      method: 'patch',
      data: { token },
      headers: { TOKEN: token },
    })
      .then(() => {
        decreaseNumOfActiveRequests();
        removeToken();
        saveUser({ id: null });
        if (this.afterLogOut) {
          this.afterLogOut();
        }
      }).catch((error) => {
        decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  signIn = (tokenCurrent, afterSignIn) => {
    const {
      token,
      saveUser,
      removeToken,
      increaseNumOfActiveRequests,
      decreaseNumOfActiveRequests,
    } = this.props;
    increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/users/self`, { headers: { TOKEN: (tokenCurrent || token) } })
      .then((response) => {
        decreaseNumOfActiveRequests();
        saveUser(response.data.payload);
        if (afterSignIn) {
          afterSignIn(response.data.payload);
        }
      }).catch(() => {
        decreaseNumOfActiveRequests();
        Cookies.remove('user_session_token', { path: '', domain: domain() });
        removeToken();
        saveUser({ id: null });
      });
  };

  signUp = () => {
    this.setState({ signUpFormVisible: true });
  };

  signUpResetErrors = () => {
    this.setState({ signUpFormErrors: {} });
  };

  logIn = () => {
    this.setState({ logInFormVisible: true });
  };

  logInResetErrors = () => {
    this.setState({ logInFormErrors: {} });
  };

  profileResetErrors = () => {
    this.setState({ profileFormErrors: {} });
  };

  resetPasswordResetErrors = () => {
    this.setState({ resetPasswordFormErrors: {} });
  };

  showToastr = (type, title, msg) => {
    switch (type) {
    case 'error':
      this.container.error(msg, title, { closeButton: true });
      break;
    case 'success':
      this.container.success(msg, title, { closeButton: true });
      break;
    case 'warning':
      this.container.warning(msg, title, { closeButton: true });
      break;
    default:
      break;
    }
  };

  displayError = (error) => {
    if (error.response.status === 404 && error.response.statusText === 'Not Found') {
      this.showToastr('error', 'Ошибка', error.response.data.message);
      return;
    }
    if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
      this.showToastr('error', 'Ошибка', error.response.data);
      return;
    }
    this.showToastr('error', 'Ошибка', 'Неожиданная ошибка');
  };

  submitSignUpForm = (type, data, password) => {
    const {
      saveUser,
      saveToken,
      increaseNumOfActiveRequests,
      decreaseNumOfActiveRequests,
    } = this.props;
    if (type === 'email') {
      this.setState({ signUpIsWaiting: true });
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      const hash = bcrypt.hashSync(password, salt);
      const params = { user: { password_digest: hash, email: data } };
      increaseNumOfActiveRequests();
      Axios.post(`${ApiUrl}/v1/users`, params)
        .then((response) => {
          decreaseNumOfActiveRequests();
          this.closeSignUpForm();
          saveUser(response.data.payload);
          saveToken(response.data.payload.user_session.token);
          this.setState({ signUpIsWaiting: false });
          this.showToastr(
            'success',
            'Вход выполнен',
            'Вам на почту было отправлено письмо. Для окончания регистрации перейдите по ссылке в письме.',
          );
          if (this.afterSubmitSignUpForm) {
            this.afterSubmitSignUpForm(response.data.payload.id);
          }
        }).catch((error) => {
          decreaseNumOfActiveRequests();
          if (error.response.status === 400 && error.response.statusText === 'Bad Request') {
            this.setState({ signUpFormErrors: error.response.data });
          } else {
            this.displayError(error);
          }
          this.setState({ signUpIsWaiting: false });
        });
    }
  };

  submitLogInForm = (type, data, password, rememberMe) => {
    const {
      saveToken,
      increaseNumOfActiveRequests,
      decreaseNumOfActiveRequests,
    } = this.props;
    if (type === 'email') {
      this.setState({ logInIsWaiting: true });
      let params;
      if (R.test(RE_EMAIL, data)) {
        params = { user_session: { user: { email: data } }, rememberMe };
      } else {
        params = { user_session: { user: { login: data } }, rememberMe };
      }
      increaseNumOfActiveRequests();
      Axios.get(`${ApiUrl}/v1/user_sessions/new`, { params })
        .then((resp) => {
          const hash = bcrypt.hashSync(password, resp.data);
          params.user_session.user.password_digest = hash;
          Axios.post(`${ApiUrl}/v1/user_sessions`, params)
            .then((response) => {
              decreaseNumOfActiveRequests();
              saveToken(response.data.payload.token);
              this.signIn(response.data.payload.token, () => {
                this.closeLogInForm();
                if (this.afterSubmitLogInForm) {
                  this.afterSubmitLogInForm(response.data.payload.user_id);
                }
                this.setState({ logInIsWaiting: false });
              });
            }).catch((error) => {
              decreaseNumOfActiveRequests();
              if (error.response.status === 400 && error.response.statusText === 'Bad Request') {
                this.setState({ logInFormErrors: error.response.data });
              } else {
                this.displayError(error);
              }
              this.setState({ logInIsWaiting: false });
            });
        }).catch((error) => {
          decreaseNumOfActiveRequests();
          const r = error.response;
          if (r.status === 404 && r.statusText === 'Not Found' && r.data.model === 'User') {
            this.setState({ logInFormErrors: { email: ['Пользователь не найден'] } });
          } else {
            this.displayError(error);
          }
          this.setState({ logInIsWaiting: false });
        });
    }
  };

  submitResetPasswordForm = (type, data, password) => {
    const { increaseNumOfActiveRequests, decreaseNumOfActiveRequests } = this.props;
    if (type === 'email') {
      this.setState({ resetPasswordIsWaiting: true });
      const url = new URL(window.location.href);
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      const hash = bcrypt.hashSync(password, salt);
      let params;
      if (R.test(RE_EMAIL, data)) {
        params = {
          user: { password_digest: hash, email: data },
          token: url.searchParams.get('reset_password_code'),
        };
      } else {
        params = {
          user: { password_digest: hash, login: data },
          token: url.searchParams.get('reset_password_code'),
        };
      }
      increaseNumOfActiveRequests();
      Axios({ url: `${ApiUrl}/v1/users/reset_password`, method: 'patch', data: params })
        .then(() => {
          decreaseNumOfActiveRequests();
          this.closeResetPasswordForm();
          this.submitLogInForm('email', data, password);
          this.setState({ resetPasswordIsWaiting: false });
        }).catch((error) => {
          decreaseNumOfActiveRequests();
          const r = error.response;
          if (r.status === 404 && r.statusText === 'Not Found' && r.data.model === 'User') {
            this.showToastr(
              'error',
              'Ошибка',
              'Срок действия ссылки для восстановления пароля истек или пользователь не найден',
            );
          } else {
            this.displayError(error);
          }
          this.setState({ resetPasswordIsWaiting: false });
        });
    }
  };

  submitProfileForm = (data, afterSuccess) => {
    const {
      user,
      token,
      saveUser,
      increaseNumOfActiveRequests,
      decreaseNumOfActiveRequests,
    } = this.props;
    this.setState({ profileIsWaiting: true });
    const dataCopy = R.clone(data);
    if (dataCopy.password) {
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      dataCopy.password_digest = bcrypt.hashSync(dataCopy.password, salt);
      delete dataCopy.password;
    }
    increaseNumOfActiveRequests();
    Axios({
      url: `${ApiUrl}/v1/users/${user.id}`,
      method: 'patch',
      data: dataCopy,
      headers: { TOKEN: token },
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        decreaseNumOfActiveRequests();
        saveUser(response.data.payload);
        this.setState({ profileIsWaiting: false });
        if (afterSuccess) {
          afterSuccess(response.data.payload);
        }
      }).catch((error) => {
        decreaseNumOfActiveRequests();
        if (error.response.status === 400 && error.response.statusText === 'Bad Request') {
          this.setState({ profileFormErrors: error.response.data });
        } else {
          this.displayError(error);
        }
        this.setState({ profileIsWaiting: false });
      });
  };

  closeSignUpForm = () => {
    this.setState({ signUpFormVisible: false });
  };

  closeLogInForm = () => {
    this.setState({ logInFormVisible: false });
  };

  closeResetPasswordForm = () => {
    this.setState({ resetPasswordFormVisible: false });
  };

  enterWithVk = (type) => {
    const { token } = this.props;
    this.w = window.open(`https://oauth.vk.com/authorize?client_id=${CLIENT_ID}&scope=email%2Cphotos&redirect_uri=${REDIRECT_URI}&response_type=code&v=5.74&state=${JSON.stringify({
      method: type,
      token: (token || ''),
    })}`, 'VK', 'resizable,scrollbars,status');
    window.addEventListener('message', this.afterVkEnter);
  };

  afterVkEnter = (ev) => {
    const { saveToken } = this.props;
    if (ev.data.result !== 'success') {
      return;
    }
    ev.source.close();
    const token = Cookies.get('user_session_token');
    saveToken(token);
    this.signIn(token);
    this.setState({ signUpFormVisible: false, logInFormVisible: false });
    window.removeEventListener('message', this.afterVkEnter);
  };

  removeVk = () => {
    const {
      user,
      token,
      increaseNumOfActiveRequests,
      decreaseNumOfActiveRequests,
      saveUser,
    } = this.props;
    this.setState({ profileIsWaiting: true });
    increaseNumOfActiveRequests();
    Axios({
      url: `${ApiUrl}/v1/users/${user.id}/integrations/vk`,
      method: 'delete',
      headers: { TOKEN: token },
    })
      .then((response) => {
        decreaseNumOfActiveRequests();
        saveUser(response.data.payload);
        this.setState({ profileIsWaiting: false });
      }).catch((error) => {
        decreaseNumOfActiveRequests();
        this.displayError(error);
        this.setState({ profileIsWaiting: false });
      });
  };

  resetPassword = (type, data) => {
    if (type === 'email') {
      const { increaseNumOfActiveRequests, decreaseNumOfActiveRequests } = this.props;
      let params;
      if (R.test(RE_EMAIL, data)) {
        params = { user: { email: data } };
      } else {
        params = { user: { login: data } };
      }
      increaseNumOfActiveRequests();
      Axios.get(`${ApiUrl}/v1/users/send_reset_password_mail`, { params })
        .then(() => {
          decreaseNumOfActiveRequests();
          this.showToastr(
            'success',
            'Восстановление пароля',
            'На почту было отправлено сообщение для восстановления пароля',
          );
        }).catch((error) => {
          decreaseNumOfActiveRequests();
          const r = error.response;
          if (r.status === 404 && r.statusText === 'Not Found' && r.data.model === 'User') {
            this.showToastr('error', 'Ошибка', 'Пользователь не найден');
          } else if (r.status === 400 && r.statusText === 'Bad Request' && r.data.email) {
            this.showToastr(
              'warning',
              'Восстановление пароля',
              'Без почты невозможно восстановить пароль. Обратитесь к администратору.',
            );
          } else {
            this.showToastr(
              'warning',
              'Восстановление пароля',
              'Не удалось отправить на почту сообщение для восстановления пароля',
            );
          }
        });
    }
  };
}

Authorization.propTypes = {
  user: PropTypes.object,
  token: PropTypes.string,
  saveUser: PropTypes.func,
  saveToken: PropTypes.func,
  removeToken: PropTypes.func,
  decreaseNumOfActiveRequests: PropTypes.func,
  increaseNumOfActiveRequests: PropTypes.func,
};

Authorization.defaultProps = {
  user: null,
  token: null,
  saveUser: null,
  saveToken: null,
  removeToken: null,
  decreaseNumOfActiveRequests: null,
  increaseNumOfActiveRequests: null,
};
