import React from 'react';
import PropTypes from 'prop-types';
import './Person.css';

const Person = ({
  user, onClick,
}) => (
  <div
    role="button"
    tabIndex="0"
    style={{ outline: 'none' }}
    onClick={onClick}
    className="person"
  >
    <div className="person__avatar">
      {
        user.avatar
          ? (
            <img
              src={user.avatar.url}
              alt={user.name ? user.name : user.login}
            />
          )
          : ''
      }
    </div>
    <div className="person__name">
      {user.name ? user.name : user.login}
    </div>
  </div>
);

Person.propTypes = {
  user: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Person;
