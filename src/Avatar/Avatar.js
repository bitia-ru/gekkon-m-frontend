import React from 'react';
import PropTypes from 'prop-types';
import { GetUserName } from '../Constants/User';
import './Avatar.css';

const Avatar = ({
  user,
}) => (
  <button
    type="button"
    className={`avatar-m${user ? ' avatar-m_login' : ''}`}
  >
    {
      (user && user.avatar)
        ? (
          <img
            src={user.avatar.url}
            alt={GetUserName(user)}
          />
        )
        : ''
    }
  </button>
);

Avatar.propTypes = {
  user: PropTypes.object,
};

Avatar.defaultProps = {
  user: null,
};

export default Avatar;
