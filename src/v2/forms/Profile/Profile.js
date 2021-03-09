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
import CloseButton from '@/v1/components/CloseButton/CloseButton';
import SALT_ROUNDS from '@/v1/Constants/Bcrypt';
import { PASSWORD_MIN_LENGTH } from '@/v1/Constants/User';
import RE_EMAIL from '@/v1/Constants/Constraints';
import Modal from '../../layouts/Modal';
import { currentUser } from '@/v2/redux/user_session/utils';
import { updateUsers as updateUsersAction } from '../../redux/users/actions';
import { enterWithVk } from '../../utils/vk';
import closeForm from '@/v2/utils/closeForm';
import { ModalContext } from '@/v2/modules/modalable';
import showToastr from '@/v2/utils/showToastr';
import toastHttpError from '@/v2/utils/toastHttpError';
import { css, StyleSheet } from '@/v2/aphrodite';

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
      user,
    } = this.props;

    this.setState({ profileIsWaiting: true });
    const dataCopy = R.clone(data);

    if (dataCopy.password) {
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      dataCopy.password_digest = bcrypt.hashSync(dataCopy.password, salt);
      delete dataCopy.password;
    }

    const self = this;

    Api.patch(
      `/v1/users/${user.id}`,
      dataCopy,
      {
        type: 'form-multipart',
        success(updatedUser) {
          self.props.updateUsers({ [updatedUser.id]: updatedUser });
          self.setState({ profileIsWaiting: false });
          if (afterSuccess) {
            afterSuccess(updatedUser);
          }
        },
        failed(error) {
          if (R.path(['response', 'status'])(error) === 400) {
            self.setState({ errors: error.response.data });
          } else {
            toastHttpError(error);
          }
          self.setState({ profileIsWaiting: false });
        },
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
        this.setState({
          errors: R.merge(errors, { login: ['Только латиница, цифры и знаки .-_'] }),
        });
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
                <form action="#" method="post" encType="multipart/form-data">
                  <div className={css(styles.modalBlockMAvatarBlock)}>
                    <div className={css(styles.modalBlockMAvatar, styles.modalBlockMAvatarLogin)}>
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
                              className={css(styles.modalBlockMAvatarDelete)}
                              type="button"
                              title="Удалить"
                              onClick={this.removeAvatar}
                            />
                          )
                          : ''
                      }
                    </div>
                  </div>
                  <div className={css(styles.modalBlockMPaddingWrapper)}>
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
                    <div className={css(styles.modalBlockMAllow)}>
                      <div className={css(styles.modalBlockMAllowTitle)}>Разрешить вход через:</div>
                      <div>
                        <ul className={css(styles.socialLinks)}>
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

const styles = StyleSheet.create({
  modalBlockMAvatarBlock: {
    padding: '30px',
    paddingTop: 0,
    backgroundColor: '#E8F2F9',
  },
  modalBlockMAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'relative',
    cursor: 'pointer',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    '> img': {
      borderRadius: '50%',
      width: '64px',
      height: '64px',
      objectFit: 'cover',
    },
    '> input': {
      position: 'absolute',
      zIndex: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      cursor: 'pointer',
      fontSize: 0,
    },
  },
  modalBlockMAvatarLogin: {
    backgroundColor: '#7AC767',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M22.9803%208.71882C22.9803%2013.1523%2019.3843%2016.7484%2014.9508%2016.7484C10.5172%2016.7484%206.9212%2013.1277%206.9212%208.71882C6.9212%204.30995%2010.5173%200.713867%2014.9508%200.713867C19.3842%200.713867%2022.9803%204.28535%2022.9803%208.71882ZM20.8621%208.71882C20.8621%205.46755%2018.202%202.80747%2014.9508%202.80747C11.6995%202.80747%209.03941%205.4675%209.03941%208.71877C9.03941%2011.97%2011.6995%2014.6301%2014.9508%2014.6301C18.202%2014.6301%2020.8621%2011.9701%2020.8621%208.71882ZM28.9409%2029.2854H1.0591C0.467973%2029.2854%200%2028.8174%200%2028.2263C0%2022.6597%204.53203%2018.1523%2010.0739%2018.1523H19.9261C25.4926%2018.1523%2030%2022.6844%2030%2028.2263C30%2028.8174%2029.532%2029.2854%2028.9409%2029.2854ZM19.9261%2020.2706H10.0739C6.0345%2020.2706%202.70933%2023.3002%202.19211%2027.1671H27.8079C27.2906%2023.2755%2023.9655%2020.2706%2019.9261%2020.2706Z%22%20fill%3D%22%23F7F7F7%22/%3E%0A%3C/svg%3E%0A")',
  },
  modalBlockMAvatarDelete: {
    width: '16px',
    height: '16px',
    padding: 0,
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    content: '\'\'',
    top: '6px',
    right: 0,
    border: 'none',
    boxShadow: 'none',
    display: 'none',
    outline: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2218%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%3Crect%20width%3D%222.40413%22%20height%3D%2221.6372%22%20transform%3D%22matrix%280.707111%20-0.707103%200.707111%200.707103%200.142578%201.8418%29%22%20fill%3D%22%23C4C4C4%22/%3E%0A%3Crect%20width%3D%222.40413%22%20height%3D%2221.6372%22%20transform%3D%22matrix%280.707111%200.707103%20-0.707111%200.707103%2015.4419%200.140625%29%22%20fill%3D%22%23C4C4C4%22/%3E%0A%3C/svg%3E%0A")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '8px 8px',
  },
  modalBlockMPaddingWrapper: {
    paddingTop: '34px',
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  modalBlockMAllow: {
    marginTop: '17px',
    marginBottom: '20px',
  },
  modalBlockMAllowTitle: {
    fontSize: '14px',
    color: '#1f1f1f',
    fontFamily: 'GilroyRegular, sans-serif',
    marginBottom: '10px'
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

Profile.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: currentUser(state),
  token: state.userSessionV2.token,
  formErrors: {},
});

const mapDispatchToProps = dispatch => ({
  updateUsers: users => dispatch(updateUsersAction(users)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
