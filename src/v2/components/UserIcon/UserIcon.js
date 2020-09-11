import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@/v1/components/Avatar/Avatar';
import { getUserName } from '@/v1/Constants/User';
import './UserIcon.css';

const UserIcon = ({
  user, hideMenu,
}) => (
  <div className="m-menu__user-block">
    <Avatar user={user} />
    <div className="m-menu__user-name">{user ? getUserName(user, true) : ''}</div>
    <div className="m-menu__user-hamburger">
      <button type="button" className="hamburger hamburger_close" onClick={hideMenu}>
        <span className="hamburger__inner" />
      </button>
    </div>
  </div>
);

UserIcon.propTypes = {
  user: PropTypes.object,
  hideMenu: PropTypes.func.isRequired,
};

export default UserIcon;
