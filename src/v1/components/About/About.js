import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
import { TITLE, TITLES, ABOUT_DATA } from '../../Constants/About';
import { avail } from '../../utils';
import getState from '../../utils/getState';
import ScrollToTopOnMount from '../ScrollToTopOnMount';

class About extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      showMenu: false,
    });
  }

  componentDidMount() {
    const {
      history,
    } = this.props;
    history.listen((location, action) => {
      if (action === 'POP') {
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });
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
              closeForm={this.closeSignUpForm}
              enterWithVk={this.enterWithVk}
            />
          )
        }
        {
          this.state.logInFormVisible && (
            <LogInForm
              closeForm={this.closeLogInForm}
              enterWithVk={this.enterWithVk}
              resetPassword={this.resetPassword}
            />
          )
        }
        {
          (avail(user) && this.state.profileFormVisible) && (
            <Profile
              user={user}
              onFormSubmit={this.submitProfileForm}
              removeVk={this.removeVk}
              enterWithVk={this.enterWithVk}
              isWaiting={this.state.profileIsWaiting}
              closeForm={this.closeProfileForm}
              formErrors={this.state.profileFormErrors}
              resetErrors={this.profileResetErrors}
            />
          )
        }
        <ScrollToTopOnMount />
        <div className="sticky-bar">
          <InfoPageHeader
            title={TITLE}
            image={require('./images/about.jpg')}
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
          <InfoPageContent titles={TITLES} data={ABOUT_DATA} />
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

export default withRouter(connect(mapStateToProps)(About));
