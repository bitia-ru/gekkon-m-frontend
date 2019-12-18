import React from 'react';
import PropTypes from 'prop-types';
import './Category.css';

const Category = ({
  category, size, position, onClick, color,
}) => {
  const classNames = ['level'];
  if (size !== undefined) classNames.push(`level_${size}`);
  if (position !== undefined) classNames.push(`level_${position}`);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={classNames.join(' ')}
      style={{ borderColor: color, outline: 'none' }}
    >
      {category}
    </div>
  );
};

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
