import React from 'react';
import { withRouter } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { css, StyleSheet } from '../../aphrodite';
import withModals, { ModalContainerContext } from '../../modules/modalable';
import Profile from '../../forms/Profile/Profile';
import LogInForm from '../../forms/LogInForm/LogInForm';
import SignUpForm from '../../forms/SignUpForm/SignUpForm';
import ResetPasswordForm from '../../forms/ResetPasswordForm/ResetPasswordForm';

class MainScreen extends React.PureComponent {
  modals() {
    return {
      profile: {
        hashRoute: true,
        body: <Profile />,
      },
      signin: {
        hashRoute: true,
        body: <LogInForm />,
      },
      signup: {
        hashRoute: true,
        body: <SignUpForm />,
      },
      reset_password: {
        hashRoute: true,
        body: <ResetPasswordForm />,
      },
    };
  }

  render() {
    const { children } = this.props;

    return (
      <ModalContainerContext.Consumer>
        {
          ({ isModalShown }) => (
            <div>
              <div style={{ flex: 1 }}>
                {children && children}
              </div>
              <div style={{ flex: 0 }}>
                <Footer
                  logIn={() => {}}
                  signUp={() => {}}
                  logOut={() => {}}
                />
              </div>
            </div>
          )
        }
      </ModalContainerContext.Consumer>
    );
  }
}

const style = StyleSheet.create({
});

export default withRouter(withModals(MainScreen));
