import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bcrypt from 'bcryptjs';
import * as R from 'ramda';
import SocialLinkButton from '../SocialLinkButton/SocialLinkButton';
import Button from '../Button/Button';
import FormField from '../FormField/FormField';
import CloseButton from '../CloseButton/CloseButton';
import SALT_ROUNDS from '../Constants/Bcrypt';
import { PASSWORD_MIN_LENGTH } from '../Constants/User';
import RE_EMAIL from '../Constants/Constraints';
import './Profile.css';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    const { user } = this.props;
    this.state = {
      name: user.name ? user.name : '',
      login: user.login ? user.login : '',
      phone: user.phone ? user.phone : '',
      password: '',
      email: user.email ? user.email : '',
      repeatPassword: '',
      avatar: user.avatar ? user.avatar.url : null,
      avatarFile: null,
      errors: {},
      fieldsOld: {},
    };
    this.mouseOver = false;
  }

  componentDidMount() {
    const {
      name, login, phone, password, email, avatar,
    } = this.state;
    this.setState({
      fieldsOld: {
        name,
        login,
        phone,
        password,
        email,
        avatar,
      },
    });
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

  saveStartFieldsValues = (user) => {
    this.setState({
      name: user.name ? user.name : '',
      login: user.login ? user.login : '',
      phone: user.phone ? user.phone : '',
      password: '',
      email: user.email ? user.email : '',
      avatar: user.avatar ? user.avatar.url : null,
      repeatPassword: '',
      avatarFile: null,
      fieldsOld: {
        name: user.name ? user.name : '',
        login: user.login ? user.login : '',
        phone: user.phone ? user.phone : '',
        password: '',
        email: user.email ? user.email : '',
        avatar: user.avatar ? user.avatar.url : null,
      },
    });
  };

  fieldsChanged = () => {
    const {
      name, login, phone, password, email, avatar, fieldsOld,
    } = this.state;
    const fields = {
      name,
      login,
      phone,
      password,
      email,
      avatar,
    };
    return fieldsOld && JSON.stringify(fields) !== JSON.stringify(fieldsOld);
  };

  resetErrors = () => {
    this.setState({ errors: {} });
  };

  onPhoneChange = (event) => {
    const { resetErrors } = this.props;
    this.resetErrors();
    resetErrors();
    this.setState({ phone: event.target.value });
    this.check('phone', event.target.value);
  };

  onNameChange = (event) => {
    const { resetErrors } = this.props;
    this.resetErrors();
    resetErrors();
    this.setState({ name: event.target.value });
  };

  onEmailChange = (event) => {
    const { resetErrors } = this.props;
    this.resetErrors();
    resetErrors();
    this.setState({ email: event.target.value });
    this.check('email', event.target.value);
  };

  onLoginChange = (event) => {
    const { resetErrors } = this.props;
    this.resetErrors();
    resetErrors();
    this.setState({ login: event.target.value });
    this.check('login', event.target.value);
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

  onFileRead = () => {
    this.setState({ avatar: this.fileReader.result });
  };

  onFileChosen = (file) => {
    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.onFileRead;
    this.fileReader.readAsDataURL(file);
    this.setState({ avatarFile: file });
  };

  removeAvatar = () => {
    this.setState({ avatar: null });
  };

  check = (field, value) => {
    const {
      errors, login, phone, email, password,
    } = this.state;
    const { user } = this.props;
    const reLogin = /^[.a-zA-Z0-9_-]+$/;
    switch (field) {
    case 'email':
      if (value !== '' && !R.test(RE_EMAIL, value)) {
        this.setState({ errors: R.merge(errors, { email: ['Неверный формат email'] }) });
        return false;
      }
      if (value === '' && login === '' && phone === '' && user.data.vk_user_id === undefined) {
        this.setState({
          errors: R.merge(
            errors,
            { email: ['Должно быть заполнено хотя бы одно из полей email, логин или телефон'] },
          ),
        });
        return false;
      }
      return true;
    case 'login':
      if (value !== '' && !R.test(reLogin, value)) {
        this.setState({ errors: R.merge(errors, { login: ['Неверный формат login'] }) });
        return false;
      }
      if (value === '' && email === '' && phone === '' && user.data.vk_user_id === undefined) {
        this.setState({
          errors: R.merge(
            errors,
            { login: ['Должно быть заполнено хотя бы одно из полей email, логин или телефон'] },
          ),
        });
        return false;
      }
      return true;
    case 'phone':
      if (value !== '' && value.length < 11) {
        this.setState({ errors: R.merge(errors, { phone: ['Неверный формат номера'] }) });
        return false;
      }
      if (value === '' && email === '' && login === '' && user.data.vk_user_id === undefined) {
        this.setState({
          errors: R.merge(
            errors,
            { phone: ['Должно быть заполнено хотя бы одно из полей email, логин или телефон'] },
          ),
        });
        return false;
      }
      return true;
    case 'password':
      if (value !== '' && value.length < PASSWORD_MIN_LENGTH) {
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

  checkAndSubmit = () => {
    const {
      name, email, login, phone, password, repeatPassword, avatar, avatarFile,
    } = this.state;
    const { user, onFormSubmit } = this.props;
    let res = !this.check('email', email);
    res += !this.check('login', login);
    res += !this.check('phone', phone);
    res += !this.check('password', password);
    res += !this.check('repeatPassword', repeatPassword);
    if (res > 0) {
      return;
    }
    const formData = new FormData();
    if (avatar !== (user.avatar ? user.avatar.url : null)) {
      formData.append('user[avatar]', avatarFile);
    }
    if (name !== (user.name ? user.name : '')) {
      formData.append('user[name]', name);
    }
    if (login !== (user.login ? user.login : '')) {
      formData.append('user[login]', login);
    }
    if (password !== '') {
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      formData.append('user[password_digest]', bcrypt.hashSync(password, salt));
    }
    if (email !== (user.email ? user.email : '')) {
      formData.append('user[email]', email);
    }
    if (phone !== (user.phone ? user.phone : '')) {
      formData.append('user[phone]', phone);
    }
    onFormSubmit(formData, newUserData => this.saveStartFieldsValues(newUserData));
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

  removeVk = () => {
    const { user, showToastr, removeVk } = this.props;
    if ((!user.email && !user.login && !user.phone) || (!user.password_digest)) {
      showToastr(
        'error',
        'Ошибка',
        'Невозможно отключить вход через VK. '
        + 'Заполните логин, email или номер телефона и задайте пароль',
      );
      return;
    }
    removeVk();
  };

  render() {
    const {
      avatar, name, email, phone, login, password, repeatPassword,
    } = this.state;
    const { user, enterWithVk, isWaiting } = this.props;
    const socialLinks = require(
      '../../img/social-links-sprite/social-links-sprite.svg',
    );
    return (
      <div className="modal-block-m">
        <div className="modal-block-m__inner">
          <div className="modal-block-m__container modal-block-m__container_blue">
            <div className="modal-block-m__header">
              <div className="modal-block-m__header-btn">
                <CloseButton onClick={this.closeForm} />
              </div>
            </div>
          </div>
          <form action="#" method="post" encType="multipart/form-data" className="form">
            <div className="modal-block-m__avatar-block">
              <div className="modal-block-m__avatar modal-block-m__avatar_login">
                {
                  (avatar !== null)
                    ? (
                      <img src={avatar} alt="" />
                    )
                    : ''
                }
                <input
                  type="file"
                  name="avatar"
                  title={(avatar !== null) ? 'Изменить аватарку' : 'Загрузить аватарку'}
                  onChange={event => this.onFileChosen(event.target.files[0])}
                />
                {
                  avatar !== null
                    ? (
                      <button
                        className="modal-block-m__avatar-delete"
                        type="button"
                        title="Удалить"
                        onClick={this.removeAvatar}
                      />
                    )
                    : ''
                }
              </div>
            </div>
            <div className="modal-block-m__padding-wrapper">
              <FormField
                placeholder="Имя"
                id="name"
                onChange={this.onNameChange}
                type="text"
                hasError={this.hasError('name')}
                errorText={this.errorText('name')}
                value={name}
              />
              <FormField
                placeholder="Логин"
                id="login"
                onChange={this.onLoginChange}
                type="text"
                hasError={this.hasError('login')}
                errorText={this.errorText('login')}
                value={login}
              />
              <FormField
                placeholder={user.password_digest === null ? 'Задать пароль' : 'Сменить пароль'}
                id="password"
                onChange={this.onPasswordChange}
                type="password"
                hasError={this.hasError('password')}
                errorText={this.errorText('password')}
                value={password}
              />
              <FormField
                placeholder="Подтверждение пароля"
                id="repeat-password"
                onChange={this.onRepeatPasswordChange}
                type="password"
                hasError={this.hasError('repeatPassword')}
                errorText={this.errorText('repeatPassword')}
                value={repeatPassword}
              />
              <FormField
                placeholder="Email"
                id="email"
                onChange={this.onEmailChange}
                type="text"
                hasError={this.hasError('email')}
                errorText={this.errorText('email')}
                value={email}
              />
              <FormField
                placeholder="Телефон"
                id="phone"
                onChange={this.onPhoneChange}
                type="number"
                hasError={this.hasError('phone')}
                errorText={this.errorText('phone')}
                value={phone}
              />
              <div className="modal-block-m__allow">
                <div className="modal-block-m__allow-title">Разрешить вход через:</div>
                <div className="modal-block-m__social">
                  <ul className="social-links">
                    <li>
                      <SocialLinkButton
                        onClick={
                          (user.data.vk_user_id !== undefined)
                            ? this.removeVk
                            : (() => enterWithVk('addVk'))
                        }
                        xlinkHref={`${socialLinks}#icon-vk`}
                        active={user.data.vk_user_id !== undefined}
                        dark={user.data.vk_user_id === undefined}
                        withRemoveButton={user.data.vk_user_id !== undefined}
                      />
                    </li>
                    { false
                        && <>
                          <li><SocialLinkButton xlinkHref={`${socialLinks}#icon-facebook`} dark unactive /></li>
                          <li><SocialLinkButton xlinkHref={`${socialLinks}#icon-twitter`} dark unactive /></li>
                          <li><SocialLinkButton xlinkHref={`${socialLinks}#icon-inst`} dark unactive /></li>
                          <li><SocialLinkButton xlinkHref={`${socialLinks}#icon-youtube`} dark unactive /></li>
                        </>
                    }
                  </ul>
                </div>
              </div>
              <Button
                size="medium"
                buttonStyle="normal"
                title="Сохранить"
                fullLength
                submit
                disabled={!this.fieldsChanged()}
                isWaiting={isWaiting}
                onClick={this.checkAndSubmit}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  formErrors: PropTypes.object.isRequired,
  resetErrors: PropTypes.func.isRequired,
  isWaiting: PropTypes.bool.isRequired,
  enterWithVk: PropTypes.func.isRequired,
  removeVk: PropTypes.func.isRequired,
  showToastr: PropTypes.func.isRequired,
};
