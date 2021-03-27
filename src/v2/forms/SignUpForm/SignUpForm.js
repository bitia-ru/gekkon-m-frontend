import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import bcrypt from 'bcryptjs';
import SALT_ROUNDS from '@/v1/Constants/Bcrypt';
import TabBar from '@/v1/components/TabBar/TabBar';
import SocialLinkButton from '@/v1/components/SocialLinkButton/SocialLinkButton';
import Button from '@/v1/components/Button/Button';
import FormField from '@/v1/components/FormField/FormField';
import { PASSWORD_MIN_LENGTH } from '@/v1/Constants/User';
import RE_EMAIL from '@/v1/Constants/Constraints';
import { enterWithVk } from '../../utils/vk';
import { createUser } from '../../utils/users';
import Modal from '../../layouts/Modal';
import showToastr from '@/v2/utils/showToastr';
import toastHttpError from '@/v2/utils/toastHttpError';
import { StyleSheet, css } from '@/v2/aphrodite';

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
      passwordFromSms: '',
      email: '',
      password: '',
      repeatPassword: '',
      errors: {},
      isWaiting: false,
    };
  }

  resetErrors = () => {
    this.setState({ errors: {} });
  };

  onPhoneChange = (event) => {
    this.resetErrors();
    this.setState({ phone: event.target.value });
  };

  onPasswordFromSmsChange = (event) => {
    this.resetErrors();
    this.setState({ passwordFromSms: event.target.value });
  };

  onEmailChange = (event) => {
    this.resetErrors();
    this.setState({ email: event.target.value });
    this.check('email', event.target.value);
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
    case 'email':
      if (value === '' || !R.test(RE_EMAIL, value)) {
        this.setState({ errors: R.merge(errors, { email: ['Неверный формат email'] }) });
        return false;
      }
      return true;
    case 'password':
      if (value === '' || value.length < PASSWORD_MIN_LENGTH) {
        const msgErr = `Минимальная длина пароля ${PASSWORD_MIN_LENGTH} символов`;
        this.setState({ errors: R.merge(errors, { password: [msgErr] }) });
        return false;
      }
      return true;
    case 'repeatPassword':
      if (password !== value) {
        this.setState(
          { errors: R.merge(errors, { repeatPassword: ['Пароли не совпадают'] }) },
        );
        return false;
      }
      return true;
    default:
      return true;
    }
  };

  checkAndSubmit = (type, data, { success }) => {
    const { email, password, repeatPassword } = this.state;

    const errors = !this.check('email', email)
      + !this.check('password', password)
      + !this.check('repeatPassword', repeatPassword);

    if (errors > 0) {
      return;
    }

    this.onFormSubmit(type, data, repeatPassword, { success });
  };

  onFormSubmit = (type, data, password, { success: submitSuccess }) => {
    const { errors } = this.state;

    if (type === 'email') {
      this.setState({ isWaiting: true });

      const self = this;
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      const user = {
        password_digest: bcrypt.hashSync(password, salt),
        email: data,
      };

      createUser(
        user,
        {
          success() {
            showToastr(
              'Вам на почту было отправлено письмо. Для окончания регистрации перейдите по ссылке в письме.',
              {
                type: 'success',
                after: submitSuccess,
              },
            );
          },
          failed(error) {
            self.setState({ isWaiting: false });
            if (error.response && error.response.data) {
              self.setState({ errors: R.merge(errors, error.response.data) });
            } else {
              toastHttpError(error);
            }
          },
        },
      );
    }
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

  firstTabContent = () => {
    const { phone, passwordFromSms, isWaiting } = this.state;
    return (
      <form action="#">
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
    const {
      email, password, repeatPassword, isWaiting,
    } = this.state;
    return (
      <form action="#">
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
          onEnter={
            () => this.checkAndSubmit(
              'email',
              email,
              {
                success() {
                  window.location = '/';
                },
              },
            )
          }
          value={repeatPassword}
        />
        <Button
          size="medium"
          buttonStyle="normal"
          title="Зарегистрироваться напрямую"
          fullLength
          submit
          isWaiting={isWaiting}
          onClick={
            () => this.checkAndSubmit(
              'email',
              email,
              {
                success() {
                  window.location = '/';
                },
              },
            )
          }
        />
      </form>
    );
  };

  render() {
    const socialLinks = require(
      '../../../../img/social-links-sprite/social-links-sprite.svg',
    );
    return (
      <Modal>
        <h3 className={css(styles.modalBlockMTitle, styles.modalBlockMTitleForm)}>
          Регистрация
        </h3>
        <TabBar
          contentList={
            [
              this.firstTabContent(),
              this.secondTabContent(),
            ]
          }
          activeList={[false, true]}
          activeTab={2}
          titleList={['Телефон', 'Email']}
        />
        <div className={css(styles.modalBlockMOr)}>
          <div className={css(styles.modalBlockMOrInner)}>или</div>
        </div>
        <div>
          <ul className={css(styles.socialLinks)}>
            <li>
              <SocialLinkButton
                onClick={() => enterWithVk('signUp')}
                xlinkHref={`${socialLinks}#icon-vk`}
                dark
              />
            </li>
          </ul>
        </div>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBlockMTitle: {
    fontSize: '18px',
    color: '#1F1F1F',
    marginTop: 0,
    fontFamily: 'GilroyBold, sans-serif',
    marginBottom: '36px',
  },
  modalBlockMTitleForm: {
    fontSize: '24px',
    fontFamily: 'GilroyBold, sans-serif',
    lineHeight: '24px',
    textAlign: 'center',
    marginTop: '50px',
  },
  modalBlockMOr: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '17px',
    marginBottom: '17px',
    ':before': {
      position: 'absolute',
      content: '\'\'',
      width: '100%',
      left: 0,
      right: 0,
      top: '50%',
      height: '1px',
      backgroundColor: '#DEDCDC',
      zIndex: 1,
    },
  },
  modalBlockMOrInner: {
    paddingLeft: '12px',
    paddingRight: '12px',
    backgroundColor: '#ffffff',
    position: 'relative',
    zIndex: 3,
  },
  socialLinks: {
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    '> li': {
      listStyleType: 'none',
      marginRight: '8px',
      marginLeft: '8px',
    },
    '> li:first-child': { marginLeft: 0 },
    '> li:last-child': { marginRight: 0 },
  },
});

SignUpForm.propTypes = {
};

const mapDispatchToProps = dispatch => ({
  signUp: () => {},
});

export default withRouter(connect(null, mapDispatchToProps)(SignUpForm));
