import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import TabBar from '../TabBar/TabBar';
import SocialLinkButton from '../SocialLinkButton/SocialLinkButton';
import Button from '../Button/Button';
import FormField from '../FormField/FormField';
import CloseButton from '../CloseButton/CloseButton';
import CheckBox from '../CheckBox/CheckBox';
import './LogInForm.css';
import RE_EMAIL from '../../Constants/Constraints';
import { logIn } from '../../stores/users/utils';

class LogInForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
      passwordEnter: '',
      email: '',
      password: '',
      errors: {},
      rememberMe: true,
      isWaiting: false,
    };
    this.mouseOver = false;
  }

  resetErrors = () => {
    this.setState({ errors: {} });
  };

  onPhoneChange = (event) => {
    this.resetErrors();
    this.setState({ phone: event.target.value });
  };

  onPasswordEnterChange = (event) => {
    this.resetErrors();
    this.setState({ passwordEnter: event.target.value });
  };

  onEmailChange = (event) => {
    this.resetErrors();
    this.setState({ email: event.target.value });
  };

  onPasswordChange = (event) => {
    this.resetErrors();
    this.setState({ password: event.target.value });
    this.check('password', event.target.value);
  };

  onRememberMeChange = () => {
    this.setState((prevState) => {
      const state = R.clone(prevState);
      state.rememberMe = !state.rememberMe;
      return state;
    });
  };

  check = (field, value) => {
    const { errors } = this.state;
    switch (field) {
    case 'password':
      if (value.length === 0) {
        this.setState({
          errors: R.merge(errors, { password_digest: ['Пароль не может быть пустым'] }),
        });
        return false;
      }
      return true;
    default:
      return true;
    }
  };

  checkAndSubmit = (type, data, passwordNew) => {
    const { password, rememberMe } = this.state;
    const res = !this.check('password', password);
    if (res > 0) {
      return;
    }
    this.onFormSubmit(type, data, passwordNew, rememberMe);
  };

  onFormSubmit = (type, data, password, rememberMe) => {
    if (type !== 'email') {
      throw `Argument error: value ${type} for argument type is invalid.`;
    }
    const { errors } = this.state;
    const { logIn: logInProp } = this.props;
    const { location } = window;
    this.setState({ isWaiting: true });
    let params;
    if (R.test(RE_EMAIL, data)) {
      params = {
        user_session: { user: { email: data } },
        rememberMe,
      };
    } else {
      params = {
        user_session: { user: { login: data } },
        rememberMe,
      };
    }
    logInProp(
      params,
      password,
      () => location.reload(),
      () => this.setState({ isWaiting: false }),
      err => this.setState({ errors: R.merge(errors, err) }),
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

  resetPassword = (type) => {
    const { phone, email } = this.state;
    const { resetPassword } = this.props;
    if (type === 'phone') {
      if (phone === '') {
        this.setState({ errors: { phone: ['Введите телефон'] } });
      } else {
        resetPassword('phone', phone);
      }
    }
    if (type === 'email') {
      if (email === '') {
        this.setState({ errors: { email: ['Введите почту / логин'] } });
      } else {
        resetPassword('email', email);
      }
    }
  };

  firstTabContent = () => {
    const {
      isWaiting, phone, passwordEnter, rememberMe,
    } = this.state;
    return (
      <form action="#" className="form">
        <FormField
          placeholder="Телефон"
          id="phone"
          onChange={this.onPhoneChange}
          type="number"
          hasError={this.hasError('phone')}
          errorText={this.errorText('phone')}
          value={phone}
        />
        <FormField
          placeholder="Пароль"
          id="password-enter"
          onChange={this.onPasswordEnterChange}
          type="text"
          hasError={this.hasError('passwordEnter')}
          errorText={this.errorText('passwordEnter')}
          value={passwordEnter}
        />
        <Button
          size="medium"
          buttonStyle="normal"
          title="Войти"
          fullLength
          submit
          isWaiting={isWaiting}
          onClick={() => this.checkAndSubmit('phone', phone, passwordEnter)}
        />
        <div className="modal-block__settings">
          <CheckBox
            id="rememberMeTab1"
            onChange={this.onRememberMeChange}
            checked={rememberMe}
            title="Запомнить меня"
          />
          <a
            role="link"
            tabIndex="0"
            style={{ outline: 'none' }}
            className="modal-block__link"
            onClick={() => this.resetPassword('phone')}
          >
            Забыли пароль?
          </a>
        </div>
      </form>
    );
  };

  secondTabContent = () => {
    const {
      isWaiting, email, password, rememberMe,
    } = this.state;
    return (
      <form action="#" className="form">
        <FormField
          placeholder="Email / логин"
          id="email"
          onChange={this.onEmailChange}
          type="text"
          hasError={this.hasError('email')}
          errorText={this.errorText('email')}
          value={email}
        />
        <FormField
          placeholder="Пароль"
          id="password"
          onChange={this.onPasswordChange}
          type="password"
          hasError={this.hasError('password_digest')}
          errorText={this.errorText('password_digest')}
          onEnter={() => this.checkAndSubmit('email', email, password)}
          value={password}
        />
        <Button
          size="medium"
          buttonStyle="normal"
          title="Войти"
          fullLength
          submit
          isWaiting={isWaiting}
          onClick={() => this.checkAndSubmit('email', email, password)}
        />
        <div className="modal-block-m__settings">
          <CheckBox
            id="rememberMeTab2"
            onChange={this.onRememberMeChange}
            checked={rememberMe}
            title="Запомнить меня"
          />
          <a
            role="link"
            tabIndex="0"
            style={{ outline: 'none' }}
            className="modal-block-m__link"
            onClick={() => this.resetPassword('email')}
          >
            Забыли пароль?
          </a>
        </div>
      </form>
    );
  };

  render() {
    const { enterWithVk } = this.props;
    const socialLinks = require(
      '../../../../img/social-links-sprite/social-links-sprite.svg',
    ).default;
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
              Вход в систему
            </h3>
            <TabBar
              contentList={[this.firstTabContent(), this.secondTabContent()]}
              activeList={[false, true]}
              activeTab={2}
              test={this.firstTabContent()}
              titleList={['Телефон', 'Email / логин']}
            />
            <div className="modal-block-m__or">
              <div className="modal-block-m__or-inner">или</div>
            </div>
            <div className="modal-block-m__social">
              <ul className="social-links">
                <li>
                  <SocialLinkButton
                    onClick={() => enterWithVk('logIn')}
                    xlinkHref={`${socialLinks}#icon-vk`}
                    dark
                  />
                </li>
                { false
                    && <>
                      <li><SocialLinkButton xlinkHref={`${socialLinks}#icon-twitter`} dark unactive /></li>
                      <li><SocialLinkButton xlinkHref={`${socialLinks}#icon-youtube`} dark unactive /></li>
                    </>
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LogInForm.propTypes = {
  enterWithVk: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  logIn: (
    params, password, afterLogInSuccess, afterLogInFail, onFormError,
  ) => dispatch(
    logIn(params, password, afterLogInSuccess, afterLogInFail, onFormError),
  ),
});

export default withRouter(connect(null, mapDispatchToProps)(LogInForm));
