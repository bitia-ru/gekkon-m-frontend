import React from 'react';
import { withRouter } from 'react-router-dom';
import { css, StyleSheet } from '../../aphrodite';
import withModals from '../../modules/modalable';
import Profile from '../../forms/Profile/Profile';
import LogInForm from '../../forms/LogInForm/LogInForm';
import SignUpForm from '../../forms/SignUpForm/SignUpForm';
import ResetPasswordForm from '../../forms/ResetPasswordForm/ResetPasswordForm';
import LoadingIndicator from '@/v2/components/LoadingIndicator/LoadingIndicator';
import MainNav from '@/v3/components/mobile/MainNav/MainNav';
import TextHeader from '@/v2/layouts/MainScreen/TextHeader';
import FilterBlock from '@/v2/components/FilterBlock/FilterBlock';
import './MainScreen.css';

class MainScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
    };
  }

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
      filters: {
        hashRoute: true,
        body: <FilterBlock />,
      },
    };
  }

  render() {
    const { children } = this.props;

    return (
      <div className={css(style.container)}>
        <div className={css(style.mainNavContainer)}>
          <MainNav />
        </div>
        <div className={css(style.childrenContainer)}>
          {children && children}
        </div>
        <LoadingIndicator />
      </div>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: '100vh',
    position: 'relative',
    display: 'flex',
    flexFlow: 'column',
  },
  mainNavContainer: {
    flex: '0 0 32px',
  },
  childrenContainer: {
    flex: 1,
  },
});

export default withRouter(withModals(MainScreen));
