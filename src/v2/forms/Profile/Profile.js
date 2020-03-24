import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bcrypt from 'bcryptjs';
import * as R from 'ramda';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Api from '../../utils/Api';
import SocialLinkButton from '@/v1/components/SocialLinkButton/SocialLinkButton';
import Button from '@/v1/components/Button/Button';
import FormField from '@/v1/components/FormField/FormField';
import SALT_ROUNDS from '@/v1/Constants/Bcrypt';
import { PASSWORD_MIN_LENGTH } from '@/v1/Constants/User';
import RE_EMAIL from '@/v1/Constants/Constraints';
import Modal from '../../layouts/Modal';
import { currentUser } from '@/v2/redux/user_session/utils';
import {
  updateUser as updateUserAction,
} from '../../redux/users/actions';
import { enterWithVk } from '../../utils/vk';
import closeForm from '@/v2/utils/closeForm';
import './Profile.css';
import { ModalContext } from '@/v2/modules/modalable';
import showToastr from '@/v2/utils/showToastr';
import toastHttpError from '@/v2/utils/toastHttpError';

class Profile extends Component {
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
  }

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

  onSubmit = (data, afterSuccess) => {
    const {
      user, updateUser,
    } = this.props;

    this.setState({ profileIsWaiting: true });
    const dataCopy = R.clone(data);

    if (dataCopy.password) {
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      dataCopy.password_digest = bcrypt.hashSync(dataCopy.password, salt);
      delete dataCopy.password;
    }

    const self = this;

    updateUser(
      user.id,
      dataCopy,
      (updatedUser) => {
        self.setState({ profileIsWaiting: false });
        if (afterSuccess) {
          afterSuccess(updatedUser);
        }
      },
      (error) => {
        if (R.path(['response', 'status'])(error) === 400) {
          self.setState({ errors: error.response.data });
        } else {
          toastHttpError(error);
        }
        self.setState({ profileIsWaiting: false });
      },
    );
  };

  onPhoneChange = (event) => {
    this.resetErrors();
    this.setState({ phone: event.target.value });
    this.check('phone', event.target.value);
  };

  onNameChange = (event) => {
    this.resetErrors();
    this.setState({ name: event.target.value });
  };

  onEmailChange = (event) => {
    this.resetErrors();
    this.setState({ email: event.target.value });
    this.check('email', event.target.value);
  };

  onLoginChange = (event) => {
    this.resetErrors();
    this.setState({ login: event.target.value });
    this.check('login', event.target.value);
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
    const { user } = this.props;
    const {
      errors, login, phone, email, password,
    } = this.state;
    const noVk = user.data.vk_user_id === undefined;
    const msg = 'Должно быть заполнено хотя бы одно из полей email, логин или телефон';
    switch (field) {
    case 'email':
      if (value !== '' && !R.test(RE_EMAIL, value)) {
        this.setState({ errors: R.merge(errors, { email: ['Неверный формат email'] }) });
        return false;
      }
      if (value === '' && login === '' && phone === '' && noVk) {
        this.setState({ errors: R.merge(errors, { email: [msg] }) });
        return false;
      }
      return true;
    case 'login': {
      const reLogin = /^[\.a-zA-Z0-9_-]+$/;
      if (value !== '' && !R.test(reLogin, value)) {
        this.setState({ errors: R.merge(errors, { login: ['Неверный формат login'] }) });
        return false;
      }
      if (value === '' && email === '' && phone === '' && noVk) {
        this.setState({ errors: R.merge(errors, { login: [msg] }) });
        return false;
      }
      return true;
    }
    case 'phone':
      if (value !== '' && value.length < 11) {
        this.setState({ errors: R.merge(errors, { phone: ['Неверный формат номера'] }) });
        return false;
      }
      if (value === '' && email === '' && login === '' && noVk) {
        this.setState({ errors: R.merge(errors, { phone: [msg] }) });
        return false;
      }
      return true;
    case 'password':
      if (value !== '' && value.length < PASSWORD_MIN_LENGTH) {
        const errMsg = `Минимальная длина пароля ${PASSWORD_MIN_LENGTH} символов`;
        this.setState({ errors: R.merge(errors, { password: [errMsg] }) });
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

  checkAndSubmit = () => {
    const { user } = this.props;
    const {
      email, login, phone, password, repeatPassword, avatar, avatarFile, name,
    } = this.state;
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
    this.onSubmit(formData, updatedUser => this.saveStartFieldsValues(updatedUser));
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

  removeVk = () => {
    const { user } = this.props;
    if ((!user.email && !user.login && !user.phone) || (!user.password_digest)) {
      showToastr(
        'Заполните логин, email или номер телефона и задайте пароль',
        {
          type: 'error',
        },
      );
      return;
    }
    Api.post(
      `/v1/users/${user.id}/integrations/vk`,
      null,
      {
        method: 'delete',
        success() {
          closeForm();
        },
        failed(error) {
          toastHttpError(error);
        },
      },
    );
  };

  render() {
    const {
      avatar, name, email, phone, login, password, repeatPassword,
    } = this.state;
    const { user } = this.props;
    const socialLinks = require(
      '../../../../img/social-links-sprite/social-links-sprite.svg',
    );
    return (
      <Modal backgroundColor="#E8F2F9">
        {
          user && <ModalContext.Consumer>
            {
              () => (
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
                      onClick={this.checkAndSubmit}
                    />
                  </div>
                </form>
              )
            }
          </ModalContext.Consumer>
        }
      </Modal>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: currentUser(state),
  token: state.userSessionV2.token,
  formErrors: {},
});

const mapDispatchToProps = dispatch => ({
  updateUser: (id, params, afterSuccess, afterFail) => dispatch(
    updateUserAction(id, params, afterSuccess, afterFail),
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
