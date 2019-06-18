import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import TabBar from '../TabBar/TabBar';
import SocialLinkButton from '../SocialLinkButton/SocialLinkButton';
import Button from '../Button/Button';
import FormField from '../FormField/FormField';
import CloseButton from '../CloseButton/CloseButton';
import { PASSWORD_MIN_LENGTH } from '../Constants/User';
import RE_EMAIL from '../Constants/Constraints';
import socialLinks from '../../img/social-links-sprite/social-links-sprite.svg';
import './SignUpForm.css';

export default class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
      passwordFromSms: '',
      email: '',
      password: '',
      repeatPassword: '',
      errors: {},
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

  onPhoneChange = (event) => {
    const { resetErrors } = this.props;
    this.resetErrors();
    resetErrors();
    this.setState({ phone: event.target.value });
  };

  onPasswordFromSmsChange = (event) => {
    const { resetErrors } = this.props;
    this.resetErrors();
    resetErrors();
    this.setState({ passwordFromSms: event.target.value });
  };

  onEmailChange = (event) => {
    const { resetErrors } = this.props;
    this.resetErrors();
    resetErrors();
    this.setState({ email: event.target.value });
    this.check('email', event.target.value);
  };

  onPasswordChange = (event) => {
    const { resetErrors } = this.props;
    this.resetErrors();
    resetErrors();
    this.setState({ password: event.target.value });
    this.check('password', event.target.value);
  };

  onRepeatPasswordChange = (event) => {
    const { resetErrors } = this.props;
    this.resetErrors();
    resetErrors();
    this.setState({ repeatPassword: event.target.value });
    this.check('repeatPassword', event.target.value);
  };

  check = (field, value) => {
    const { errors, password } = this.state;
    switch (field) {
    case 'email':
      if (value === '' || !R.test(RE_EMAIL, value)) {
        this.setState({ errors: R.merge(errors, { email: ['Неверный формат email'] }) });
        return false;
      }
      return true;
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
    const { email, password, repeatPassword } = this.state;
    const { onFormSubmit } = this.props;
    let res = !this.check('email', email);
    res += !this.check('password', password);
    res += !this.check('repeatPassword', repeatPassword);
    if (res > 0) {
      return;
    }
    onFormSubmit(type, data, passwordNew);
  };

  hasError = (field) => {
    const { errors } = this.state;
    const { formErrors } = this.props;
    return errors[field] || formErrors[field];
  };

  errorText = (field) => {
    const { errors } = this.state;
    const { formErrors } = this.props;
    return R.join(
      ', ',
      R.concat(errors[field] ? errors[field] : [], formErrors[field] ? formErrors[field] : []),
    );
  };

  closeForm = () => {
    const { resetErrors, closeForm } = this.props;
    this.resetErrors();
    resetErrors();
    closeForm();
  };

  firstTabContent = () => {
    const { phone, passwordFromSms } = this.state;
    const { isWaiting } = this.props;
    return (
      <form action="#" className="form">
        <FormField
          placeholder="Ваш телефон"
          id="your-phone"
          onChange={this.onPhoneChange}
          type="number"
          hasError={this.hasError('phone')}
          errorText={this.errorText('phone')}
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
          title="Зарегистрироваться"
          fullLength
          submit
          isWaiting={isWaiting}
          onClick={() => this.checkAndSubmit('phone', phone, passwordFromSms)}
        />
      </form>
    );
  };

  secondTabContent = () => {
    const { email, password, repeatPassword } = this.state;
    const { isWaiting } = this.props;
    return (
      <form action="#" className="form">
        <FormField
          placeholder="Ваш email"
          id="your-email"
          onChange={this.onEmailChange}
          type="text"
          hasError={this.hasError('email')}
          errorText={this.errorText('email')}
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
          title="Зарегистрироваться напрямую"
          fullLength
          submit
          isWaiting={isWaiting}
          onClick={() => this.checkAndSubmit('email', email, password, repeatPassword)}
        />
      </form>
    );
  };

  render() {
    const { enterWithVk } = this.props;
    return (
      <div className="modal-block-m">
        <div className="modal-block-m__inner">
          <div className="modal-block-m__container">
            <div className="modal-block-m__header">
              <div className="modal-block-m__header-btn">
                <CloseButton onClick={this.closeForm} />
              </div>
            </div>
            <h3 className="modal-block-m__title modal-block-m__title_form">
              Регистрация
            </h3>
            <TabBar
              contentList={[this.firstTabContent(), this.secondTabContent()]}
              activeList={[false, true]}
              activeTab={2}
              test={this.firstTabContent()}
              titleList={['Телефон', 'Email']}
            />
            <div className="modal-block-m__or">
              <div className="modal-block-m__or-inner">или</div>
            </div>
            <div className="modal-block-m__social">
              <ul className="social-links">
                <li>
                  <SocialLinkButton
                    onClick={() => enterWithVk('signUp')}
                    xlinkHref={`${socialLinks}#icon-vk`}
                    dark
                  />
                </li>
                <li>
                  <SocialLinkButton xlinkHref={`${socialLinks}#icon-facebook`} dark unactive />
                </li>
                <li>
                  <SocialLinkButton xlinkHref={`${socialLinks}#icon-twitter`} dark unactive />
                </li>
                <li>
                  <SocialLinkButton xlinkHref={`${socialLinks}#icon-inst`} dark unactive />
                </li>
                <li>
                  <SocialLinkButton xlinkHref={`${socialLinks}#icon-youtube`} dark unactive />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SignUpForm.propTypes = {
  isWaiting: PropTypes.bool,
  onFormSubmit: PropTypes.func.isRequired,
  enterWithVk: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  formErrors: PropTypes.object.isRequired,
  resetErrors: PropTypes.func.isRequired,
};

SignUpForm.defaultProps = {
  isWaiting: false,
};
