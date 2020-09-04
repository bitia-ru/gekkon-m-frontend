import React from 'react';
import { Link } from 'react-router-dom';
import { StyleSheet, css } from '../../aphrodite';

const Logo = () => (
  <Link to="/" className={css(styles.logoM)}>
    <span className={css(styles.logoMIcon)}>
      <img
        src={require('./images/logo-75x75.png')}
        width="75px"
        height="75px"
        alt="RC"
      />
    </span>
  </Link>
);

const styles = StyleSheet.create({
  logoM: {
    width: '76px',
    height: '76px',
    position: 'fixed',
    left: 0,
    top: 0,
    backgroundColor: '#0D0D0D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'box-shadow .4s ease-out',
    zIndex: 10,
    ':focus': { boxShadow: '0px 0px 0px 2px rgba(0, 108, 235, 0.7)' },
  },
  logoMIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    '> img': {
      width: '100%',
      height: '100%',
    }
  },
});

export default Logo;
