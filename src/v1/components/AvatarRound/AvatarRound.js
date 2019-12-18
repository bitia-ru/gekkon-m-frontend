import React from 'react';
import PropTypes from 'prop-types';
import './AvatarRound.css';

const AvatarRound = ({
  user,
}) => (
  <a className={`avatar-round${user ? ' avatar-round_login' : ''}`}>
    {user && user.avatar && <img src={user.avatar.url} alt={user.name ? user.name : user.login} />}
  </a>
);

AvatarRound.propTypes = {
  user: PropTypes.object,
};

export default AvatarRound;
