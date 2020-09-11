import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@/v1/components/Avatar/Avatar';
import { getUserName } from '@/v1/Constants/User';
import './UserIcon.css';
import { StyleSheet, css } from '../../aphrodite';

const UserIcon = ({
  user, hideMenu,
}) => (
  <div className={css(styles.mMenuUserBlock)}>
    <Avatar user={user} />
    <div className={css(styles.mMenuUserName)}>{user ? getUserName(user, true) : ''}</div>
    <div className={css(styles.mMenuUserHamburger)}>
      <button type="button" className="hamburger hamburger_close" onClick={hideMenu}>
        <span className="hamburger__inner" />
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
});

UserIcon.propTypes = {
  user: PropTypes.object,
  hideMenu: PropTypes.func.isRequired,
};

export default UserIcon;
