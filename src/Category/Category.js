import React from 'react';
import PropTypes from 'prop-types';
import './Category.css';

const Category = ({
  category, size, position, onClick, color,
}) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    className={
      `level${
        size !== undefined ? ` level_${size}` : ''
      }${
        position !== undefined ? ` level_${position}` : ''
      }`
    }
    style={{ borderColor: color, outline: 'none' }}
  >
    {category}
  </div>
);

Category.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  position: PropTypes.string,
  onClick: PropTypes.func,
  category: PropTypes.string.isRequired,
};

Category.defaultProps = {
  onClick: null,
  color: '#ffffff',
};

export default Category;
