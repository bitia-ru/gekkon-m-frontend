import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({
  buttonStyle,
  size,
  fullLength,
  submit,
  smallFont,
  onClick,
  disabled,
  isWaiting,
  customClass,
  title,
}) => {
  let styleClass = '';
  if (buttonStyle !== 'normal') {
    if (buttonStyle === 'gray') {
      styleClass = ' btn-m_gray';
    } else {
      styleClass = ' btn-m_transparent';
    }
  }
  let sizeClass = '';
  if (size === 'small') {
    sizeClass = ' btn-m__small';
  } else if (size === 'medium') {
    sizeClass = ' btn-m__medium';
  }
  const fullLengthClass = fullLength ? ' btn-m_full-length' : '';
  const submitClass = submit ? ' btn-m__submit' : '';
  const bigFontClass = smallFont ? '' : ' first-section-m__btn';
  let cursorStyle = {};
  if (disabled) {
    cursorStyle = { cursor: 'not-allowed' };
  } else if (isWaiting) {
    cursorStyle = { cursor: 'wait' };
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={cursorStyle}
      className={
        customClass || `btn-m${styleClass}${sizeClass}${fullLengthClass}${submitClass}${bigFontClass}`
      }
    >
      {title}
    </button>
  );
};

Button.propTypes = {
  size: PropTypes.string,
  buttonStyle: PropTypes.string,
  fullLength: PropTypes.bool,
  submit: PropTypes.bool,
  smallFont: PropTypes.bool,
  disabled: PropTypes.bool,
  isWaiting: PropTypes.bool,
  customClass: PropTypes.string,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  size: 'big',
  buttonStyle: 'normal',
  fullLength: false,
  submit: false,
  smallFont: false,
  disabled: false,
  isWaiting: false,
  customClass: '',
};

export default Button;
