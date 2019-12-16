import React from 'react';
import PropTypes from 'prop-types';
import bcrypt from 'bcryptjs';
import * as R from 'ramda';
import SALT_ROUNDS from './Constants/Bcrypt';
import { ApiUrl } from './Environ';
import { CLIENT_ID, REDIRECT_URI } from './Constants/Vk';
import RE_EMAIL from './Constants/Constraints';
import store from '../v1/store';
import {
  updateUser, signIn, removeVk, sendResetPasswordMail, logOut,
} from '../v1/stores/users/utils';

export default class BaseComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signUpFormVisible: false,
      logInFormVisible: false,
      profileFormVisible: window.location.hash === '#profile',
      resetPasswordFormVisible: false,
      profileFormErrors: {},
      profileIsWaiting: false,
    };
  }

  logOut = () => {
    store.dispatch(
      logOut(
        () => {
          localStorage.removeItem('reduxState');
          window.location.href = '/';
        },
      ),
    );
  };

  signUp = () => {
    this.setState({ signUpFormVisible: true });
  };

  logIn = () => {
    this.setState({ logInFormVisible: true });
  };

  profileResetErrors = () => {
    this.setState({ profileFormErrors: {} });
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
    this.w = window.open(`https://oauth.vk.com/authorize?client_id=${CLIENT_ID}&scope=email%2Cphotos&redirect_uri=${REDIRECT_URI}&response_type=code&v=5.74&state=${JSON.stringify({
      method: type,
    })}`, 'VK', 'resizable,scrollbars,status');
    window.addEventListener('message', this.afterVkEnter);
  };

  afterVkEnter = (ev) => {
    if (ev.data.result !== 'success') {
      return;
    }
    ev.source.close();
    store.dispatch(signIn());
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
};

BaseComponent.defaultProps = {
  user: null,
};
