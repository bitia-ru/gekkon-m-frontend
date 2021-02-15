import React from 'react';
import localForage from 'localforage';
import { css, StyleSheet } from '@/v2/aphrodite';


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  async componentDidCatch(error, info) {
    this.setState({ hasError: true });
    Sentry.captureException(error);
    console.log(info);

    const reduxState = await localForage.getItem('reduxState');

    if (!reduxState) {
      console.log('Redux store is not initialized.');
      return;
    }

    const { initializedAt } = reduxState;

    if (initializedAt !== undefined && new Date().getTime() - initializedAt > 3000) {
      console.log('Attempting to reset redux store...');
      await localForage.clear();
      console.log('Cleared.');
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return <div className={css(styles.container)}>
        <div className={css(styles.messageContainer)}>
          <p>Что-то пошло не так, попробуйте перезагрузить страницу.</p>
          <p>
            Если проблема не пропадает, обратитесь с вопросом в
            {' '}
            <a href="https://vk.com/roving.climbers">группу Вконтакте</a>
            {' '}
            или
            {' '}
            <a href="https://t.me/RC_crags_discussions">телеграм-чат</a>
            .
          </p>
        </div>
      </div>;
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100vw',
    height: '100vh',
    backgroundColor: 'black',
    color: 'white',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    fontFamily: 'GilroyRegular',
    fontSize: '0.7em',
  },
  messageContainer: {
    textAlign: 'center',
    '> a': {
      color: 'white',
      fontFamily: 'GilroyBold',
    },
  },
});

export default ErrorBoundary;
