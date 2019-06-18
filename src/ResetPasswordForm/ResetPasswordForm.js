import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import TabBar from '../TabBar/TabBar';
import Button from '../Button/Button';
import FormField from '../FormField/FormField';
import CloseButton from '../CloseButton/CloseButton';
import { PASSWORD_MIN_LENGTH } from '../Constants/User';
import './ResetPasswordForm.css';

export default class ResetPasswordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordFromSms: '',
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

  onPasswordFromSmsChange = (event) => {
    const { resetErrors } = this.props;
    this.resetErrors();
    resetErrors();
    this.setState({ passwordFromSms: event.target.value });
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
    const { onFormSubmit } = this.props;
    let res = !this.check('password', password);
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
    const { passwordFromSms } = this.state;
    const { phone, isWaiting } = this.props;
    return (
      <form action="#" className="form">
        <FormField
          placeholder="Ваш телефон"
          id="your-phone"
          onChange={null}
          type="number"
          hasError={false}
          errorText=""
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
    const { password, repeatPassword } = this.state;
    const { email, isWaiting } = this.props;
    return (
      <form action="#" className="form">
        <FormField
          placeholder="Email / логин"
          id="your-email"
          onChange={null}
          type="text"
          hasError={false}
          errorText=""
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
  isWaiting: PropTypes.bool,
  phone: PropTypes.string,
  email: PropTypes.string,
  onFormSubmit: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  formErrors: PropTypes.object.isRequired,
  resetErrors: PropTypes.func.isRequired,
};

ResetPasswordForm.defaultProps = {
  isWaiting: false,
  phone: '',
  email: '',
};
