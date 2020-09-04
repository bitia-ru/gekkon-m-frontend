import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';

const MainNav = ({
  showMenu,
}) => (
  <button type="button" className={css(styles.hamburger)} onClick={showMenu}>
    <span className={css(styles.hamburgerInner)} />
  </button>
);

const styles = StyleSheet.create({
  hamburger: {
    backgroundColor: '#F0F0F0',
    width: '76px',
    height: '76px',
    right: 0,
    top: 0,
    border: 'none',
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    zIndex: 10,
  },
  hamburgerInner: {
    display: 'block',
    width: '24px',
    height: '2px',
    backgroundColor: '#1f1f1f',
    position: 'relative',
    ':before': {
      position: 'absolute',
      content: '\'\'',
      width: '24px',
      height: '2px',
      backgroundColor: '#1f1f1f',
      top: '-10px',
      left: 0,
    },
    ':after': {
      position: 'absolute',
      content: '\'\'',
      width: '24px',
      height: '2px',
      backgroundColor: '#1f1f1f',
      bottom: '-10px',
      left: 0,
    },
  },
});

MainNav.propTypes = {
  showMenu: PropTypes.func.isRequired,
};

export default MainNav;
