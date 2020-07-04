import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastr';
import MainPageHeader from '../MainPageHeader/MainPageHeader';
import MainMenu from '../MainMenu/MainMenu';
import Footer from '../Footer/Footer';
import { saveUser, changeTab } from '../actions';
import Authorization from '../Authorization';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import Profile from '../Profile/Profile';
import StickyBar from '../StickyBar/StickyBar';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import { avail } from '../Utils';
import { userStateToUser } from '../Utils/Workarounds';

class CragsIndex extends Authorization {
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
    const { user } = this.props;
    return (
      <React.Fragment>
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
          <StickyBar loading={this.props.numOfActiveRequests > 0} />
        </div>
        <Footer
          user={userStateToUser(user)}
          logIn={this.logIn}
          signUp={this.signUp}
          logOut={this.logOut}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  tab: state.tab,
});

const mapDispatchToProps = dispatch => ({
  saveUser: user => dispatch(saveUser(user)),
  changeTab: tab => dispatch(changeTab(tab)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CragsIndex));
