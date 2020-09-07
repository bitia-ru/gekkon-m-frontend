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

    if (localForage.length() > 0) {
      await localForage.clear();

      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return <div className={css(styles.container)}>
        Something went wrong...
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
    lineHeight: '100vh',
    textAlign: 'center',
    color: 'white',
  },
});

export default ErrorBoundary;