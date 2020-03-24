import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MainPageHeader from '../MainPageHeader/MainPageHeader';
import MainMenu from '../MainMenu/MainMenu';
import Footer from '../Footer/Footer';
import { changeTab } from '../../actions';
import BaseComponent from '../BaseComponent';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import Profile from '../Profile/Profile';
import StickyBar from '../StickyBar/StickyBar';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import { avail } from '../../utils';
import getState from '../../utils/getState';

class CragsIndex extends BaseComponent {
  componentDidMount() {
    window.history.back();
  }

  componentWillUnmount() {
    alert('Раздел находится в разработке');
    this.props.changeTab(1);
  }

  changeNameFilter = () => {
  };

  render() {
    const { user, loading } = this.props;
    return (
      <React.Fragment>
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
          (avail(user) && this.state.profileFormVisible) && (
            <Profile
              user={user}
              onFormSubmit={this.submitProfileForm}
              removeVk={this.removeVk}
              numOfActiveRequests={this.props.numOfActiveRequests}
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
          <StickyBar loading={loading} />
        </div>
        <Footer
          user={user}
          logIn={this.logIn}
          signUp={this.signUp}
          logOut={this.logOut}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.usersStore.users[state.usersStore.currentUserId],
  tab: state.tab,
  loading: getState(state),
});

const mapDispatchToProps = dispatch => ({
  changeTab: tab => dispatch(changeTab(tab)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CragsIndex));
