import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { notAvail } from '../Utils';
import './LikeButton.css';

export default class LikeButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      btnIsBusy: false,
    };
  }

  onChange = () => {
    const { onChange } = this.props;
    if (!onChange) { return; }
    this.setState({ btnIsBusy: true }, () => onChange && onChange(this.afterChange));
  };

  afterChange = () => {
    this.setState({ btnIsBusy: false });
  };

  render() {
    const { numOfLikes, isLiked } = this.props;
    const { btnIsBusy } = this.state;
    const { onChange } = this;
    return (
      <button
        className={`like-button${isLiked ? ' like-button_active' : ''}`}
        type="button"
        style={
          (notAvail(numOfLikes) || btnIsBusy)
            ? { cursor: 'wait' }
            : {}
        }
        onClick={btnIsBusy ? null : onChange}
      >
        <span className="like-button__icon">
          <svg>
            <use xlinkHref={`${require('./images/like.svg')}#icon-like`} />
          </svg>
        </span>
        <span className="like-button__count">
          {
            notAvail(numOfLikes)
              ? <>&nbsp;</>
              : numOfLikes
          }
        </span>
      </button>
    );
  }
}

LikeButton.propTypes = {
  numOfLikes: PropTypes.number,
  isLiked: PropTypes.bool,
  onChange: PropTypes.func,
};

LikeButton.defaultProps = {
  isLiked: false,
};
