import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@/v2/aphrodite';
import styles from './styles';

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
