import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import InfoPageHeader from '@/v1/components/InfoPageHeader/InfoPageHeader';
import InfoPageContent from '@/v1/components/InfoPageContent/InfoPageContent';
import MainMenu from '@/v1/components/MainMenu/MainMenu';
import Footer from '@/v1/components/Footer/Footer';
import SignUpForm from '@/v1/components/SignUpForm/SignUpForm';
import LogInForm from '@/v1/components/LogInForm/LogInForm';
import ResetPasswordForm from '@/v1/components/ResetPasswordForm/ResetPasswordForm';
import Profile from '@/v1/components/Profile/Profile';
import BaseComponent from '@/v1/components/BaseComponent';
import StickyBar from '@/v1/components/StickyBar/StickyBar';
import { TITLE, TITLES, ABOUT_DATA } from '@/v1/Constants/About';
import { avail } from '@/v1/utils';
import getState from '@/v1/utils/getState';
import ScrollToTopOnMount from '@/v1/components/ScrollToTopOnMount';

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
