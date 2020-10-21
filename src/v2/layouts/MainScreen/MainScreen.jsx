import React from 'react';
import { withRouter } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { css, StyleSheet } from '../../aphrodite';
import withModals, { ModalContainerContext } from '../../modules/modalable';
import MainScreenContext from '@/v2/contexts/MainScreenContext';
import Profile from '../../forms/Profile/Profile';
import LogInForm from '../../forms/LogInForm/LogInForm';
import SignUpForm from '../../forms/SignUpForm/SignUpForm';
import ResetPasswordForm from '../../forms/ResetPasswordForm/ResetPasswordForm';
import LoadingIndicator from '@/v2/components/LoadingIndicator/LoadingIndicator';
import Logo from '@/v2/components/Logo/Logo';
import MainNav from '@/v2/components/MainNav/MainNav';
import MainMenu from '@/v2/components/MainMenu/MainMenu';
import TextHeader from '@/v2/layouts/MainScreen/TextHeader';
import FilterBlock from '@/v2/components/FilterBlock/FilterBlock';

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
    const { children, header } = this.props;
    const { showMenu } = this.state;

    return (
      <ModalContainerContext.Consumer>
        {
          ({ isModalShown }) => (
            <div
              className={css(
                style.container,
                isModalShown ? style.unscrollable : style.scrollable,
              )}
              ref={(ref) => { this.containerRef = ref; }}
            >
              <div style={{ flex: 1 }}>
                <LoadingIndicator>
                  <Logo />
                  <MainNav
                    showMenu={() => this.setState({ showMenu: true })}
                  />
                  {
                    header && (
                      typeof header === 'string' || typeof header === 'number'
                        ? <TextHeader title={header} /> : header
                    )
                  }
                  {
                    showMenu
                      ? (
                        <MainMenu
                          user={null}
                          hideMenu={() => this.setState({ showMenu: false })}
                          logIn={() => {}}
                          signUp={() => {}}
                          logOut={() => {}}
                          openProfile={() => {}}
                          enterWithVk={() => {}}
                        />
                      )
                      : ''
                  }
                  <MainScreenContext.Provider value={{ parentContainerRef: this.containerRef }}>
                    {children && children}
                  </MainScreenContext.Provider>
                </LoadingIndicator>
              </div>
              <div style={{ flex: 0 }}>
                <Footer />
              </div>
            </div>
          )
        }
      </ModalContainerContext.Consumer>
    );
  }
}

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexFlow: 'column',
    height: '100vh',
    overflowX: 'hidden',
  },
  scrollable: { overflowY: 'auto' },
  unscrollable: { overflowY: 'hidden' },
});

export default withRouter(withModals(MainScreen));
