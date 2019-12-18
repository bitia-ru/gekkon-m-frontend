import React from 'react';
import PropTypes from 'prop-types';
import './ShowSchemeButton.css';

import iconImage from '../../../../img/btn-handler/btn-handler-sprite.svg';

const ShowSchemeButton = ({ onClick, disabled }) => (
  <button
    type="button"
    className="route-m__route-place"
    onClick={disabled ? null : onClick}
  >
    <svg><use xlinkHref={`${iconImage}#map`} /></svg>
  </button>
);

ShowSchemeButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

ShowSchemeButton.defaultProps = {
  disabled: false,
  onClick: null,
};

export default ShowSchemeButton;
