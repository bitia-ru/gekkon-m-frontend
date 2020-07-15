import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import Qs from 'qs';
import * as R from 'ramda';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastr';
import MainPageHeader from '../MainPageHeader/MainPageHeader';
import MainPageContent from '../MainPageContent/MainPageContent';
import MainMenu from '../MainMenu/MainMenu';
import Footer from '../Footer/Footer';
import {
  saveUser,
  saveToken,
  removeToken,
  increaseNumOfActiveRequests,
  decreaseNumOfActiveRequests,
  loadSpots,
} from '../actions';
import { ApiUrl } from '../Environ';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';
import Profile from '../Profile/Profile';
import Authorization from '../Authorization';
import StickyBar from '../StickyBar/StickyBar';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import { avail } from '../Utils';
import { userStateToUser } from '../Utils/Workarounds';

Axios.interceptors.request.use((config) => {
  const configCopy = R.clone(config);
  configCopy.paramsSerializer = params => Qs.stringify(params, { arrayFormat: 'brackets' });
  return configCopy;
});

class SpotsIndex extends Authorization {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      email: '',
      showMenu: false,
    });
  }

  componentDidMount() {
    const {
      saveUser: saveUserProp,
      loadSpots: loadSpotsProp,
    } = this.props;
    this.props.increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/spots`, { withCredentials: true })
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        loadSpotsProp(response.data.payload);
      }).catch((error) => {
      this.props.decreaseNumOfActiveRequests();
      this.displayError(error);
    });
    this.props.history.listen((location, action) => {
      if (action === 'POP') {
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });
    const url = new URL(window.location.href);
    let code = url.searchParams.get('activate_mail_code');
    if (code !== null) {
      this.props.increaseNumOfActiveRequests();
      const userId = url.searchParams.get('user_id');
      Axios.get(`${ApiUrl}/v1/users/mail_activation/${code}`, { params: { id: userId }, withCredentials: true })
        .then((response) => {
          this.props.decreaseNumOfActiveRequests();
          saveUserProp(response.data.payload);
          this.showToastr('success', 'Успешно', 'Активация email');
        }).catch(() => {
          this.props.decreaseNumOfActiveRequests();
          this.showToastr('warning', 'Активация email', 'При активации произошла ошибка');
        });
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
      this.props.saveToken(token);
      this.signIn(token);
    } else {
      saveUserProp({ id: null });
    }
  }

  changeNameFilter = () => {
  };

  openProfileForm = () => {
    this.props.history.push('/#profile');
    this.setState({ profileFormVisible: true });
  };

  closeProfileForm = () => {
    this.props.history.push('/');
    this.setState({ profileFormVisible: false });
  };

  setToastContainerRef = (ref) => {
    this.container = ref;
  };

  render() {
    const { user } = this.props;
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
          (avail(user.id) && this.state.profileFormVisible)
            ? (
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
            user={userStateToUser(user)}
            logIn={this.logIn}
            signUp={this.signUp}
          />
          {
            this.state.showMenu
              ? (
                <MainMenu
                  user={userStateToUser(user)}
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
          <MainPageContent
            spots={
              R.filter(spot => spot.data && spot.data.public)(Object.values(this.props.spots))
            }
          />
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
  spots: state.spots,
  numOfActiveRequests: state.numOfActiveRequests,
});

const mapDispatchToProps = dispatch => ({
  loadSpots: spots => dispatch(loadSpots(spots)),
  saveUser: user => dispatch(saveUser(user)),
  saveToken: token => dispatch(saveToken(token)),
  removeToken: () => dispatch(removeToken()),
  increaseNumOfActiveRequests: () => dispatch(increaseNumOfActiveRequests()),
  decreaseNumOfActiveRequests: () => dispatch(decreaseNumOfActiveRequests()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsIndex));
