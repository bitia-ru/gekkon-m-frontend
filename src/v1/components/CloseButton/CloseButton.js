import React from 'react';
import PropTypes from 'prop-types';
import './CloseButton.css';

const CloseButton = ({
  onClick, light,
}) => (
  <button type="button" className={`close-m${light ? ' close-m_light' : ''}`} onClick={onClick} />
);

CloseButton.propTypes = {
  light: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

CloseButton.defaultProps = {
  light: false,
};

export default CloseButton;
