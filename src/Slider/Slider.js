import React from 'react';
import PropTypes from 'prop-types';
import './Slider.css';

const Slider = ({ onClick }) => (
  <button type="button" className="header-m__items-container-button" onClick={onClick}>
    <span className="header-m__info-icon">
      <svg aria-hidden="true">
        <use xlinkHref={`${require('./images/arrow.svg')}#arrow`} />
      </svg>
    </span>
  </button>
);

Slider.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Slider;
