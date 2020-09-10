import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '@/v2/aphrodite';

const ButtonHandler = ({ title, xlinkHref, onClick }) => (
  <div className={css(styles.routeMRouteFooterItem)}>
    <button type="button" className={css(styles.btnHandler)} title={title} onClick={onClick}>
      <svg aria-hidden="true">
        <use xlinkHref={xlinkHref} />
      </svg>
    </button>
  </div>
);

const styles = StyleSheet.create({
  routeMRouteFooterItem: {
    marginLeft: '6px',
    marginRight: '6px',
  },
  btnHandler: {
    backgroundСolor: '#E4E4E4',
    border: 'none',
    boxShadow: 'none',
    width: '36px',
    height: '36px',
    padding: '9px 9px',
    cursor: 'pointer',
    transition: 'background-color .4s ease-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      backgroundColor: 'rgba(0, 108, 235, 0.7)',
      '> svg': { fill: '#ffffff' },
    },
    ':focus': {
      backgroundColor: 'rgba(0, 108, 235, 0.7)',
      '> svg': { fill: '#ffffff' },
    },
    '> svg': {
      width: '100%',
      height: '100%',
      fill: '#4F4F4F',
      transition: 'fill .4s ease-out',
    },
  },
});

ButtonHandler.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  xlinkHref: PropTypes.string.isRequired,
};

export default ButtonHandler;
