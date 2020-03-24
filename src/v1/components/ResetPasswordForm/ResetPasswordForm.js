import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import bcrypt from 'bcryptjs';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TabBar from '../TabBar/TabBar';
import Button from '../Button/Button';
import FormField from '../FormField/FormField';
import CloseButton from '../CloseButton/CloseButton';
import { PASSWORD_MIN_LENGTH } from '../../Constants/User';
import './ResetPasswordForm.css';
import SALT_ROUNDS from '../../Constants/Bcrypt';
import RE_EMAIL from '../../Constants/Constraints';
import { logIn, resetPassword } from '../../stores/users/utils';
import showToastr from '@/v2/utils/showToastr';

class ResetPasswordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordFromSms: '',
      password: '',
      repeatPassword: '',
      errors: {},
      isWaiting: false,
    };
    this.mouseOver = false;
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.closeForm();
    }
  };

  resetErrors = () => {
    this.setState({ errors: {} });
  };

  onPasswordFromSmsChange = (event) => {
    this.resetErrors();
    this.setState({ passwordFromSms: event.target.value });
  };

  onPasswordChange = (event) => {
    this.resetErrors();
    this.setState({ password: event.target.value });
    this.check('password', event.target.value);
  };

  onRepeatPasswordChange = (event) => {
    this.resetErrors();
    this.setState({ repeatPassword: event.target.value });
    this.check('repeatPassword', event.target.value);
  };

  check = (field, value) => {
    const { errors, password } = this.state;
    switch (field) {
    case 'password':
      if (value === '' || value.length < PASSWORD_MIN_LENGTH) {
        this.setState({
          errors: R.merge(
            errors,
            { password: [`Минимальная длина пароля ${PASSWORD_MIN_LENGTH} символов`] },
          ),
        });
        return false;
      }
      return true;
    case 'repeatPassword':
      if (password !== value) {
        this.setState({ errors: R.merge(errors, { repeatPassword: ['Пароли не совпадают'] }) });
        return false;
      }
      return true;
    default:
      return true;
    }
  };

  checkAndSubmit = (type, data, passwordNew) => {
    const { password, repeatPassword } = this.state;
    let res = !this.check('password', password);
    res += !this.check('repeatPassword', repeatPassword);
    if (res > 0) {
      return;
    }
    this.onFormSubmit(type, data, passwordNew);
  };

  onFormSubmit = (type, data, password) => {
    if (type !== 'email') {
      throw `Argument error: value ${type} for argument type is invalid.`;
    }
    const { resetPassword: resetPasswordProp } = this.props;
    this.setState({ isWaiting: true });
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
    resetPasswordProp(
      params,
      () => {
        this.logIn(data, password);
      },
      () => {
        this.setState({ isWaiting: false });
        showToastr(
          'Срок действия ссылки для восстановления пароля истек или пользователь не найден',
          {
            type: 'error',
          },
        );
      },
    );
  };

  logIn = (data, password) => {
    const { logIn: logInProp } = this.props;
    let params;
    if (R.test(RE_EMAIL, data)) {
      params = { user_session: { user: { email: data } } };
    } else {
      params = { user_session: { user: { login: data } } };
    }
    logInProp(
      params,
      password,
      () => {
        window.location.href = '/';
      },
    );
  };

  hasError = (field) => {
    const { errors } = this.state;
    return errors[field];
  };

  errorText = (field) => {
    const { errors } = this.state;
    return R.join(
      ', ',
      errors[field] ? errors[field] : [],
    );
  };

  closeForm = () => {
    const { closeForm } = this.props;
    this.resetErrors();
    closeForm();
  };

  firstTabContent = () => {
    const { passwordFromSms, isWaiting } = this.state;
    const { phone } = this.props;
    return (
      <form action="#" className="form">
        <FormField
          placeholder="Ваш телефон"
          id="your-phone"
          onChange={null}
          type="number"
          disabled
          value={phone}
        />
        <FormField
          placeholder="Пароль из смс"
          id="password-from-sms"
          onChange={this.onPasswordFromSmsChange}
          type="text"
          hasError={this.hasError('passwordFromSms')}
          errorText={this.errorText('passwordFromSms')}
          value={passwordFromSms}
        />
        <Button
          size="medium"
          buttonStyle="normal"
          title="Восстановить"
          fullLength
          submit
          isWaiting={isWaiting}
          onClick={() => this.checkAndSubmit('phone', phone, passwordFromSms)}
        />
      </form>
    );
  };

  secondTabContent = () => {
    const { password, repeatPassword, isWaiting } = this.state;
    const { email } = this.props;
    return (
      <form action="#" className="form">
        <FormField
          placeholder="Email / логин"
          id="your-email"
          onChange={null}
          type="text"
          disabled
          value={email}
        />
        <FormField
          placeholder="Придумайте пароль"
          id="password"
          onChange={this.onPasswordChange}
          type="password"
          hasError={this.hasError('password')}
          errorText={this.errorText('password')}
          value={password}
        />
        <FormField
          placeholder="Повторите пароль"
          id="repeat-password"
          onChange={this.onRepeatPasswordChange}
          type="password"
          hasError={this.hasError('repeatPassword')}
          errorText={this.errorText('repeatPassword')}
          onEnter={() => this.checkAndSubmit('email', email, password, repeatPassword)}
          value={repeatPassword}
        />
        <Button
          size="medium"
          buttonStyle="normal"
          title="Сохранить"
          fullLength
          submit
          isWaiting={isWaiting}
          onClick={() => this.checkAndSubmit('email', email, password, repeatPassword)}
        />
      </form>
    );
  };

  render() {
    return (
      <div className="modal-block-m">
        <div className="modal-block-m__inner">
          <div className="modal-block-m__container">
            <div className="modal-block-m__header">
              <div className="modal-block-m__header-btn">
                <CloseButton onClick={this.closeForm} />
              </div>
            </div>
            <h3 className="modal-block__title modal-block-m__title_form">
              Установка нового пароля
            </h3>
            <TabBar
              contentList={[this.firstTabContent(), this.secondTabContent()]}
              activeList={[false, true]}
              activeTab={2}
              test={this.firstTabContent()}
              titleList={['Телефон', 'Email']}
            />
          </div>
        </div>
      </div>
    );
  }
}

ResetPasswordForm.propTypes = {
  phone: PropTypes.string,
  email: PropTypes.string,
  closeForm: PropTypes.func.isRequired,
};

ResetPasswordForm.defaultProps = {
  phone: '',
  email: '',
};

const mapDispatchToProps = dispatch => ({
  resetPassword: (
    params, afterSuccess, afterFail, afterAll,
  ) => dispatch(
    resetPassword(params, afterSuccess, afterFail, afterAll),
  ),
  logIn: (
    params, password, afterLogInSuccess, afterLogInFail, onFormError,
  ) => dispatch(
    logIn(params, password, afterLogInSuccess, afterLogInFail, onFormError),
  ),
});

export default withRouter(connect(null, mapDispatchToProps)(ResetPasswordForm));
