import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { css } from '../../aphrodite';
import styles from './styles';

class LoadingIndicator extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      lastHandler: 0,
      handlers: [],
    };
  }

  startLoading = () => {
    const { lastHandler, handlers } = this.state;
    const newHandler = lastHandler + 1;
    this.setState({
      lastHandler: newHandler,
      handlers: [...handlers, newHandler],
    });
    return newHandler;
  };

  stopLoading = (handler) => {
    const { handlers } = this.state;
    this.setState({ handlers: R.filter(e => e !== handler)(handlers) });
  };

  render() {
    const { children, showAlways } = this.props;
    const { handlers } = this.state;
    const isLoading = handlers.length > 0;

    return (
      <div className={css(styles.container)} ref={() => { window.loadingIndicator = this; }}>
        <div className={css(styles.wrapper)}>
          {children}
        </div>

        <div className={css(styles.indicatorContainer)}>
          <div
            className={
              css(
                styles.indicator,
                isLoading ? styles.indicatorActive : (!showAlways && styles.hideIndicator),
              )
            }
          />
        </div>
      </div>
    );
  }
}

LoadingIndicator.propTypes = {
  showAlways: PropTypes.bool,
  children: PropTypes.array,
};

LoadingIndicator.defaultProps = {
  showAlways: false,
};

export default LoadingIndicator;
