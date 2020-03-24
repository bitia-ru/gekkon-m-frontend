import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MainPageHeader from '../MainPageHeader/MainPageHeader';
import MainPageContent from '../MainPageContent/MainPageContent';
import MainMenu from '../MainMenu/MainMenu';
import Footer from '../Footer/Footer';
import { ApiUrl } from '../../Environ';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';
import Profile from '../Profile/Profile';
import BaseComponent from '../BaseComponent';
import StickyBar from '../StickyBar/StickyBar';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import { avail } from '../../utils';
import { activateEmail } from '../../stores/users/utils';
import getState from '../../utils/getState';
import showToastr from '@/v2/utils/showToastr';

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
        () => showToastr('Активация email', { type: 'success' }),
        () => showToastr(
          'При активации произошла ошибка',
          {
            type: 'warning',
          },
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
                closeForm={this.closeSignUpForm}
                enterWithVk={this.enterWithVk}
              />
            )
            : ''
        }
        {
          this.state.resetPasswordFormVisible
            ? (
              <ResetPasswordForm
                closeForm={this.closeResetPasswordForm}
                email={this.state.email}
              />
            )
            : ''
        }
        {
          this.state.logInFormVisible
            ? (
              <LogInForm
                closeForm={this.closeLogInForm}
                enterWithVk={this.enterWithVk}
                resetPassword={this.resetPassword}
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
                showToastr={showToastr}
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
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsIndex));
