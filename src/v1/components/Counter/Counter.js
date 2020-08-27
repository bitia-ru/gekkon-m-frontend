import React from 'react';
import PropTypes from 'prop-types';
import { css, StyleSheet } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  counter: {
    fontSize: '16px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  counterText: {
    height: '100%',
    textAlign: 'center',
    lineHeight: '28px',
  },
  counterNumContainer: { marginRight: '4px' },
  counterNumWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    height: '100%',
    width: '28px',
    borderRadius: '50%',
  },
  counterNum: { marginTop: '2px' },
  defaultCounterColor: { color: '#828282' },
  redpointsTextColor: { color: '#E24D4D' },
  flashesTextColor: { color: '#000000' },
  redpointsNumColor: { backgroundColor: '#E24D4D' },
  flashesNumColor: { backgroundColor: '#000000' },
});

const Counter = ({
  text, number, type,
}) => (
  <div className={css(styles.counter)}>
    <div
      className={
        css(
          styles.counterNumContainer,
          type ? styles.counterNumWrapper : styles.defaultCounterColor,
          type === 'redpoints' && styles.redpointsNumColor,
          type === 'flashes' && styles.flashesNumColor,
        )
      }
    >
      <div className={css(type && styles.counterNum)}>{number}</div>
    </div>
    <span
      className={
        css(
          styles.counterText,
          !type && styles.defaultCounterColor,
          type === 'redpoints' && styles.redpointsTextColor,
          type === 'flashes' && styles.flashesTextColor,
        )
      }
    >
      {' '}
      {text}
    </span>
  </div>
);

Counter.propTypes = {
  number: PropTypes.number,
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Counter;
