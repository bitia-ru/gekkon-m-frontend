import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';


class LoadingIndicator extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
    };
  }

  startLoading = () => {
    this.setState({ counter: this.state.counter + 1 });
  };

  stopLoading = () => {
    this.setState({ counter: this.state.counter - 1 });
  };

  render() {
    const { children, showAlways, isSticky } = this.props;
    const isLoading = this.state.counter > 0;

    return (
      <div className={css(style.container)} ref={() => { window.loadingIndicator = this; }}>
        <div className={css(style.wrapper)}>
          {children}
        </div>

        <div className={css(style.indicatorContainer, isSticky && style.stickyIndicator)}>
          <div
            className={
              css(
                style.indicator,
                isLoading ? style.indicatorActive : (!showAlways && style.hideIndicator),
              )
            }
          />
        </div>
      </div>
    );
  }
}

const style = StyleSheet.create({
  container: {
    height: '100%',
  },
  wrapper: {
    height: '100%',
    marginBottom: '-3px',
  },
  indicatorContainer: {
    position: 'fixed',
    bottom: 0,
    height: '3px',
    width: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    zIndex: 999,
  },
  indicator: {
    backgroundColor: '#006CEB',
    height: '100%',
    width: '100%',
    transition: 'width 0.5s ease-out,opacity 0.5s linear',
  },
  indicatorActive: {
    opacity: 1,
    animationName: [{
      '0%': {
        width: 0,
      },
    }],
    animationDuration: '20s',
    animationTimingFunction: 'cubic-bezier(0, 0.78, 1, 0.53)',
    animationDelay: '0s',
    animationIterationCount: 'infinite',
  },
  hideIndicator: {
    opacity: 0,
  },
  stickyIndicator: {
    position: 'sticky',
  },
});

LoadingIndicator.propTypes = {
  showAlways: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSticky: PropTypes.bool,
};

LoadingIndicator.defaultProps = {
  showAlways: false,
  isLoading: false,
};

export default LoadingIndicator;
