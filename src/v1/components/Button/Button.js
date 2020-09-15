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
  const styleClass = {
    gray: 'btn-m_gray',
    filter: 'btn-m_filter',
    normal: ' ',
  }[buttonStyle] || 'btn-m_transparent';

  const sizeClass = {
    small: 'btn-m__small',
    medium: 'btn-m__medium',
  }[size] || '';

  const fullLengthClass = fullLength ? 'btn-m_full-length' : '';
  const submitClass = submit ? 'btn-m__submit' : '';
  const bigFontClass = smallFont ? '' : 'first-section-m__btn';
  let cursorStyle = {};
  if (disabled) {
    cursorStyle = { cursor: 'not-allowed' };
  } else if (isWaiting) {
    cursorStyle = { cursor: 'wait' };
  }
  const normalClassName = [
    'btn-m',
    styleClass,
    sizeClass,
    fullLengthClass,
    submitClass,
    bigFontClass,
  ].join(' ');

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={cursorStyle}
      className={customClass || normalClassName}
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
