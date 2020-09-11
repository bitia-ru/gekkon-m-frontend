import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '@/v2/aphrodite';

const Slider = ({ onClick }) => (
  <button type="button" className={css(styles.headerMItemsContainerButton)} onClick={onClick}>
    <span className={css(styles.headerMInfoIcon)}>
      <svg aria-hidden="true">
        <use xlinkHref={`${require('./images/arrow.svg')}#arrow`} />
      </svg>
    </span>
  </button>
);

const styles = StyleSheet.create({
  headerMItemsContainerButton: {
    marginTop: 'auto',
    backgroundColor: '#0D0D0D',
    height: '84px',
    width: '100%',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerMInfoIcon: {
    display: 'flex',
    width: '46px',
    height: '6px',
    justifyContent: 'center',
    alignItems: 'center',
    '> svg': {
      fill: '#ffffff',
      width: '100%',
      height: '100%',
    },
  },
});

Slider.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Slider;
