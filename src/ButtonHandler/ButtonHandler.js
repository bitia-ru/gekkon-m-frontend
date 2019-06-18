import React from 'react';
import PropTypes from 'prop-types';
import './ButtonHandler.css';

const ButtonHandler = ({ title, xlinkHref, onClick }) => (
  <div className="route-m__route-footer-item">
    <button type="button" className="btn-handler" title={title} onClick={onClick}>
      <svg aria-hidden="true">
        <use xlinkHref={xlinkHref} />
      </svg>
    </button>
  </div>
);

ButtonHandler.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  xlinkHref: PropTypes.string.isRequired,
};

export default ButtonHandler;
