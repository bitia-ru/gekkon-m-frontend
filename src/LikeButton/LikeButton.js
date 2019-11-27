import React from 'react';
import PropTypes from 'prop-types';
import { notAvail } from '../Utils';
import './LikeButton.css';

const LikeButton = ({
  numOfLikes, isLiked, onChange, busy,
}) => (
  <button
    type="button"
    className={`like-button${isLiked ? ' like-button_active' : ''}`}
    style={(notAvail(numOfLikes) || busy) ? { cursor: 'wait' } : {}}
    onClick={busy ? null : onChange}
  >
    <span className="like-button__icon">
      <svg>
        <use xlinkHref={`${require('./images/like.svg')}#icon-like`} />
      </svg>
    </span>
    <span className="like-button__count">{notAvail(numOfLikes) ? <>&nbsp;</> : numOfLikes}</span>
  </button>
);

LikeButton.propTypes = {
  onChange: PropTypes.func,
  busy: PropTypes.bool,
  numOfLikes: PropTypes.number,
  isLiked: PropTypes.bool.isRequired,
};

LikeButton.defaultProps = {
  onChange: null,
  busy: false,
};

export default LikeButton;
