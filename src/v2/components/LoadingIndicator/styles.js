import { StyleSheet } from '../../aphrodite';

const styles = StyleSheet.create({
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
});

export default styles;
