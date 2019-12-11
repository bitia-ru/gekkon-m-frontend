import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import bcrypt from 'bcryptjs';
import * as R from 'ramda';
import SALT_ROUNDS from './Constants/Bcrypt';
import { ApiUrl } from './Environ';
import { CLIENT_ID, REDIRECT_URI } from './Constants/Vk';
import RE_EMAIL from './Constants/Constraints';
import store from '../v1/store';
import {
  logIn, signUp, resetPassword, updateUser, signIn, removeVk, sendResetPasswordMail, logOut,
} from '../v1/stores/users/utils';
import { loadToken } from '../v1/stores/users/actions';

export default class BaseComponent extends React.Component {
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
    store.dispatch(logOut(this.afterLogOut));
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
    if (type === 'email') {
      this.setState({ signUpIsWaiting: true });
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      const hash = bcrypt.hashSync(password, salt);
      const params = { user: { password_digest: hash, email: data } };
      store.dispatch(
        signUp(
          params,
          (response) => {
            this.closeSignUpForm();
            this.showToastr(
              'success',
              'Вход выполнен',
              'Вам на почту было отправлено письмо. Для окончания регистрации перейдите по ссылке в письме.',
            );
            if (this.afterSubmitSignUpForm) {
              this.afterSubmitSignUpForm(response.data.payload.id);
            }
          },
          () => this.setState({ signUpIsWaiting: false }),
          error => this.setState({ signUpFormErrors: error.response.data }),
        ),
      );
    }
  };

  submitLogInForm = (type, data, password, rememberMe) => {
    if (type === 'email') {
      this.setState({ logInIsWaiting: true });
      let params;
      if (R.test(RE_EMAIL, data)) {
        params = { user_session: { user: { email: data } }, rememberMe };
      } else {
        params = { user_session: { user: { login: data } }, rememberMe };
      }
      store.dispatch(logIn(
        params,
        password,
        () => this.setState({ logInIsWaiting: false }),
        (resp) => {
          this.closeLogInForm();
          if (this.afterSubmitLogInForm) {
            this.afterSubmitLogInForm(resp.data.payload.user_id);
          }
          this.setState({ logInIsWaiting: false });
        },
        err => this.setState({ logInFormErrors: err }),
      ));
    }
  };

  submitResetPasswordForm = (type, data, password) => {
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
      store.dispatch(
        resetPassword(
          params,
          () => {
            this.closeResetPasswordForm();
            this.submitLogInForm('email', data, password);
          },
          () => {
            this.showToastr(
              'error',
              'Ошибка',
              'Срок действия ссылки для восстановления пароля истек или пользователь не найден',
            );
          },
          () => this.setState({ resetPasswordIsWaiting: false }),
        ),
      );
    }
  };

  submitProfileForm = (data, afterSuccess) => {
    const { user } = this.props;
    this.setState({ profileIsWaiting: true });
    const dataCopy = R.clone(data);
    if (dataCopy.password) {
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      dataCopy.password_digest = bcrypt.hashSync(dataCopy.password, salt);
      delete dataCopy.password;
    }
    store.dispatch(
      updateUser(
        `${ApiUrl}/v1/users/${user.id}`,
        dataCopy,
        afterSuccess,
        error => this.setState({ profileFormErrors: error.response.data }),
        () => this.setState({ profileIsWaiting: false }),
      ),
    );
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

  openProfileForm = () => {
    const { history } = this.props;
    history.push('#profile');
    this.setState({ profileFormVisible: true });
  };

  closeProfileForm = () => {
    const { history, match } = this.props;
    history.push(match.url);
    this.setState({ profileFormVisible: false });
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
    if (ev.data.result !== 'success') {
      return;
    }
    ev.source.close();
    const token = Cookies.get('user_session_token');
    store.dispatch(loadToken(token));
    store.dispatch(signIn(token));
    this.setState({ signUpFormVisible: false, logInFormVisible: false });
    window.removeEventListener('message', this.afterVkEnter);
  };

  removeVk = () => {
    const { user } = this.props;
    this.setState({ profileIsWaiting: true });
    store.dispatch(
      removeVk(
        `${ApiUrl}/v1/users/${user.id}/integrations/vk`,
        () => this.setState({ profileIsWaiting: false }),
      ),
    );
  };

  resetPassword = (type, data) => {
    if (type === 'email') {
      let params;
      if (R.test(RE_EMAIL, data)) {
        params = { user: { email: data } };
      } else {
        params = { user: { login: data } };
      }
      store.dispatch(
        sendResetPasswordMail(params, this.showToastr),
      );
    }
  };
}

BaseComponent.propTypes = {
  user: PropTypes.object,
  token: PropTypes.string,
};

BaseComponent.defaultProps = {
  user: null,
  token: null,
};
