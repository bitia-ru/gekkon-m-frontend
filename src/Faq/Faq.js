import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastr';
import Cookies from 'js-cookie';
import InfoPageHeader from '../InfoPageHeader/InfoPageHeader';
import InfoPageContent from '../InfoPageContent/InfoPageContent';
import MainMenu from '../MainMenu/MainMenu';
import Footer from '../Footer/Footer';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';
import Profile from '../Profile/Profile';
import BaseComponent from '../BaseComponent';
import StickyBar from '../StickyBar/StickyBar';
import { TITLE, TITLES, FAQ_DATA } from '../Constants/Faq';
import { avail } from '../Utils';
import { signIn } from '../../v1/stores/users/utils';
import { logOutUser } from '../../v1/stores/users/actions';
import getState from '../../v1/utils/getState';
import ScrollToTopOnMount from '../ScrollToTopOnMount';

class Faq extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      showMenu: false,
    });
  }

  componentDidMount() {
    const {
      history,
      signIn: signInProp,
      logOutUser: logOutUserProp,
    } = this.props;
    history.listen((location, action) => {
      if (action === 'POP') {
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });
    if (Cookies.get('user_session_token') !== undefined) {
      signInProp();
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
          this.state.signUpFormVisible && (
            <SignUpForm
              onFormSubmit={this.submitSignUpForm}
              closeForm={this.closeSignUpForm}
              enterWithVk={this.enterWithVk}
              isWaiting={this.state.signUpIsWaiting}
              formErrors={this.state.signUpFormErrors}
              resetErrors={this.signUpResetErrors}
            />
          )
        }
        {
          this.state.resetPasswordFormVisible && (
            <ResetPasswordForm
              onFormSubmit={this.submitResetPasswordForm}
              closeForm={this.closeResetPasswordForm}
              isWaiting={this.state.resetPasswordIsWaiting}
              formErrors={this.state.resetPasswordFormErrors}
              email={this.state.email}
              resetErrors={this.resetPasswordResetErrors}
            />
          )
        }
        {
          this.state.logInFormVisible && (
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
        }
        {
          (avail(user) && this.state.profileFormVisible) && (
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
        }
        <ScrollToTopOnMount />
        <ToastContainer
          ref={this.setToastContainerRef}
          onClick={() => this.container.clear()}
          className="toast-top-right"
        />
        <div className="sticky-bar">
          <InfoPageHeader
            title={TITLE}
            image={require('./images/faq.jpg')}
            showMenu={() => this.setState({ showMenu: true })}
          />
          {
            this.state.showMenu && (
              <MainMenu
                user={user}
                hideMenu={() => this.setState({showMenu: false})}
                changeNameFilter={this.changeNameFilter}
                logIn={this.logIn}
                signUp={this.signUp}
                logOut={this.logOut}
                openProfile={this.openProfileForm}
                enterWithVk={this.enterWithVk}
              />
            )
          }
          <InfoPageContent titles={TITLES} data={FAQ_DATA} />
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
  signIn: afterSignIn => dispatch(signIn(afterSignIn)),
  logOutUser: () => dispatch(logOutUser()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Faq));
