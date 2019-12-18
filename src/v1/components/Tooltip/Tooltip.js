import React from 'react';
import PropTypes from 'prop-types';
import './Tooltip.css';

const Tooltip = ({ text }) => (
  <div className="tooltip tooltip_left-side">
    {text}
  </div>
);

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Tooltip;
