import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastr';
import Cookies from 'js-cookie';
import InfoPageHeader from '../InfoPageHeader/InfoPageHeader';
import InfoPageContent from '../InfoPageContent/InfoPageContent';
import MainMenu from '../MainMenu/MainMenu';
import Footer from '../Footer/Footer';
import {
  saveUser,
  saveToken,
  removeToken,
  increaseNumOfActiveRequests,
  decreaseNumOfActiveRequests,
} from '../actions';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';
import Profile from '../Profile/Profile';
import Authorization from '../Authorization';
import StickyBar from '../StickyBar/StickyBar';
import { TITLE, TITLES, ABOUT_DATA } from '../Constants/About';
import { avail } from '../Utils';
import { userStateToUser } from '../Utils/Workarounds';
import ScrollToTopOnMount from '../ScrollToTopOnMount';

class About extends Authorization {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      showMenu: false,
    });
  }

  componentDidMount() {
    const {
      history,
      saveToken: saveTokenProp,
      saveUser: saveUserProp,
    } = this.props;
    history.listen((location, action) => {
      if (action === 'POP') {
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });
    if (Cookies.get('user_session_token') !== undefined) {
      const token = Cookies.get('user_session_token');
      saveTokenProp(token);
      this.signIn(token);
    } else {
      saveUserProp({ id: null });
    }
  }

  changeNameFilter = () => {
  };

  setToastContainerRef = (ref) => {
    this.container = ref;
  };

  render() {
    const { user } = this.props;
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
          (avail(user.id) && this.state.profileFormVisible) && (
            <Profile
              user={user}
              onFormSubmit={this.submitProfileForm}
              removeVk={this.removeVk}
              numOfActiveRequests={this.props.numOfActiveRequests}
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
            image={require('./images/about.jpg')}
            showMenu={() => this.setState({ showMenu: true })}
          />
          {
            this.state.showMenu && (
              <MainMenu
                user={userStateToUser(user)}
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
          <InfoPageContent titles={TITLES} data={ABOUT_DATA} />
          <StickyBar loading={this.props.numOfActiveRequests > 0} />
        </div>
        <Footer
          user={userStateToUser(user)}
          logIn={this.logIn}
          signUp={this.signUp}
          logOut={this.logOut}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  token: state.token,
  numOfActiveRequests: state.numOfActiveRequests,
});

const mapDispatchToProps = dispatch => ({
  saveUser: user => dispatch(saveUser(user)),
  saveToken: token => dispatch(saveToken(token)),
  removeToken: () => dispatch(removeToken()),
  increaseNumOfActiveRequests: () => dispatch(increaseNumOfActiveRequests()),
  decreaseNumOfActiveRequests: () => dispatch(decreaseNumOfActiveRequests()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(About));
