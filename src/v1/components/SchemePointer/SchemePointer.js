import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SchemePointer.css';

const SchemePointer = ({
  active,
  onClick,
  category,
  position,
  color,
}) => {
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };

  const getFontColor = (hexColor) => {
    const rgbColor = hexToRgb(hexColor);
    const dist = Math.sqrt((rgbColor.r ** 2) + (rgbColor.g ** 2) + (rgbColor.b ** 2));
    if (dist < Math.sqrt((128 ** 2) * 3)) {
      return '#ffffff';
    }
    return '#000000';
  };
  const divClassNames = classNames({
    point: true,
    point_active: active,
  });

  return (
    <div
      role="button"
      tabIndex={0}
      style={{
        outline: 'none',
        backgroundColor: color,
        color: getFontColor(color),
        left: `${position.left}%`,
        top: `${position.top}%`,
      }}
      onClick={onClick}
      className={divClassNames}
    >
      {category}
    </div>
  );
};

SchemePointer.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.string,
  position: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired,
};

SchemePointer.defaultProps = {
  active: false,
  onClick: null,
  color: '#ffffff',
};

export default SchemePointer;
