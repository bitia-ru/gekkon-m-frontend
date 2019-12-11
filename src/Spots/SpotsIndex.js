import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastr';
import MainPageHeader from '../MainPageHeader/MainPageHeader';
import MainPageContent from '../MainPageContent/MainPageContent';
import MainMenu from '../MainMenu/MainMenu';
import Footer from '../Footer/Footer';
import { ApiUrl } from '../Environ';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';
import Profile from '../Profile/Profile';
import BaseComponent from '../BaseComponent';
import StickyBar from '../StickyBar/StickyBar';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import { avail } from '../Utils';
import { activateEmail, signIn } from '../../v1/stores/users/utils';
import { logOutUser, loadToken } from '../../v1/stores/users/actions';
import getState from '../../v1/utils/getState';

class SpotsIndex extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      email: '',
      showMenu: false,
    });
  }

  componentDidMount() {
    const {
      signIn: signInProp,
      loadToken: loadTokenProp,
      logOutUser: logOutUserProp,
      activateEmail: activateEmailProp,
    } = this.props;
    this.props.history.listen((location, action) => {
      if (action === 'POP') {
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });
    const url = new URL(window.location.href);
    let code = url.searchParams.get('activate_mail_code');
    if (code !== null) {
      const userId = url.searchParams.get('user_id');
      activateEmailProp(
        `${ApiUrl}/v1/users/mail_activation/${code}`,
        { id: userId },
        () => this.showToastr('success', 'Успешно', 'Активация email'),
        () => this.showToastr(
          'warning', 'Активация email', 'При активации произошла ошибка',
        ),
      );
    }
    code = url.searchParams.get('reset_password_code');
    if (code !== null) {
      const email = url.searchParams.get('user_email');
      this.setState({
        resetPasswordFormVisible: true,
        email: email || url.searchParams.get('user_login'),
      });
    }
    if (Cookies.get('user_session_token') !== undefined) {
      const token = Cookies.get('user_session_token');
      loadTokenProp(token);
      signInProp(token);
    } else {
      logOutUserProp();
    }
  }

  changeNameFilter = () => {
  };

  setToastContainerRef = (ref) => {
    this.container = ref;
  };

  render() {
    const { user, loading } = this.props;
    return (
      <>
        {
          this.state.signUpFormVisible
            ? (
              <SignUpForm
                onFormSubmit={this.submitSignUpForm}
                closeForm={this.closeSignUpForm}
                enterWithVk={this.enterWithVk}
                isWaiting={this.state.signUpIsWaiting}
                formErrors={this.state.signUpFormErrors}
                resetErrors={this.signUpResetErrors}
              />
            )
            : ''
        }
        {
          this.state.resetPasswordFormVisible
            ? (
              <ResetPasswordForm
                onFormSubmit={this.submitResetPasswordForm}
                closeForm={this.closeResetPasswordForm}
                isWaiting={this.state.resetPasswordIsWaiting}
                formErrors={this.state.resetPasswordFormErrors}
                email={this.state.email}
                resetErrors={this.resetPasswordResetErrors}
              />
            )
            : ''
        }
        {
          this.state.logInFormVisible
            ? (
              <LogInForm
                onFormSubmit={this.submitLogInForm}
                closeForm={this.closeLogInForm}
                enterWithVk={this.enterWithVk}
                isWaiting={this.state.logInIsWaiting}
                resetPassword={this.resetPassword}
                formErrors={this.state.logInFormErrors}
                resetErrors={this.logInResetErrors}
              />
            )
            : ''
        }
        {
          (avail(user) && this.state.profileFormVisible)
            ? (
              <Profile
                user={user}
                onFormSubmit={this.submitProfileForm}
                removeVk={this.removeVk}
                showToastr={this.showToastr}
                enterWithVk={this.enterWithVk}
                isWaiting={this.state.profileIsWaiting}
                closeForm={this.closeProfileForm}
                formErrors={this.state.profileFormErrors}
                resetErrors={this.profileResetErrors}
              />
            )
            : ''
        }
        <ScrollToTopOnMount />
        <ToastContainer
          ref={this.setToastContainerRef}
          onClick={() => this.container.clear()}
          className="toast-top-right"
        />
        <div className="sticky-bar">
          <MainPageHeader
            showMenu={() => this.setState({ showMenu: true })}
            user={user}
            logIn={this.logIn}
            signUp={this.signUp}
          />
          {
            this.state.showMenu
              ? (
                <MainMenu
                  user={user}
                  hideMenu={() => this.setState({ showMenu: false })}
                  changeNameFilter={this.changeNameFilter}
                  logIn={this.logIn}
                  signUp={this.signUp}
                  logOut={this.logOut}
                  openProfile={this.openProfileForm}
                  enterWithVk={this.enterWithVk}
                />
              )
              : ''
          }
          <MainPageContent />
          <StickyBar loading={loading} />
        </div>
        <Footer
          user={user}
          logIn={this.logIn}
          signUp={this.signUp}
          logOut={this.logOut}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.usersStore.users[state.usersStore.currentUserId],
  loading: getState(state),
});

const mapDispatchToProps = dispatch => ({
  activateEmail: (url, params, afterSuccess, afterFail) => dispatch(
    activateEmail(url, params, afterSuccess, afterFail),
  ),
  loadToken: token => dispatch(loadToken(token)),
  signIn: (token, afterSignIn) => dispatch(signIn(token, afterSignIn)),
  logOutUser: () => dispatch(logOutUser()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsIndex));
