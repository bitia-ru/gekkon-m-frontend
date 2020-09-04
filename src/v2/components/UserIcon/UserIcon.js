import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@/v1/components/Avatar/Avatar';
import { getUserName } from '@/v1/Constants/User';
import { StyleSheet, css } from '../../aphrodite';

const UserIcon = ({
  user, hideMenu,
}) => (
  <div className={css(styles.mMenuUserBlock)}>
    <Avatar user={user} />
    <div className={css(styles.mMenuUserName)}>{user ? getUserName(user, true) : ''}</div>
    <div className={css(styles.mMenuUserHamburger)}>
      <button type="button" className={css(styles.hamburger)} onClick={hideMenu}>
        <span className={css(styles.hamburgerInner, styles.hamburgerCloseInner)} />
      </button>
    </div>
  </div>
);

const styles = StyleSheet.create({
  mMenuUserBlock: {
    height: '76px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  mMenuUserName: { marginLeft: '20px' },
  mMenuUserHamburger: { marginLeft: 'auto' },
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
  hamburgerCloseInner: {
    transform: 'rotate(45deg)',
    ':before': {
      top: 0,
      left: 0,
      transform: 'rotate(-90deg)',
    },
    ':after': { display: 'none' },
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

UserIcon.propTypes = {
  user: PropTypes.object,
  hideMenu: PropTypes.func.isRequired,
};

export default UserIcon;
