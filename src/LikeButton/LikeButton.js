import React from 'react';
import PropTypes from 'prop-types';
import likeImage from '../../img/like-sprite/like.svg';
import './LikeButton.css';

const LikeButton = ({
  numOfLikes, isLiked, onChange,
}) => (
  <button
    type="button"
    className={`like-button${isLiked ? ' like-button_active' : ''}`}
    onClick={onChange}
  >
    <span className="like-button__icon">
      <svg>
        <use xlinkHref={`${likeImage}#icon-like`} />
      </svg>
    </span>
    <span className="like-button__count">{numOfLikes}</span>
  </button>
);

LikeButton.propTypes = {
  onChange: PropTypes.func,
  numOfLikes: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
};

LikeButton.defaultProps = {
  onChange: null,
};

export default LikeButton;
