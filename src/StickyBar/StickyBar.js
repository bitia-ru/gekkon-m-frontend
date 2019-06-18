import React from 'react';
import PropTypes from 'prop-types';
import './StickyBar.css';

const StickyBar = ({
  loading, hideLoaded,
}) => {
  let stickyBarStyle = {};
  if (!loading && hideLoaded) {
    stickyBarStyle = { opacity: 0 };
  }
  return (
    <div className="sticky-bar__item">
      <div
        style={stickyBarStyle}
        className={
          `sticky-bar__item-indicator${loading ? ' sticky-bar__item-indicator_active' : ''}`
        }
      />
    </div>
  );
};

StickyBar.propTypes = {
  hideLoaded: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
};

StickyBar.defaultProps = {
  hideLoaded: false,
};

export default StickyBar;
