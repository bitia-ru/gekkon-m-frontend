import React from 'react';
import PropTypes from 'prop-types';
import toggleDirection from '../../img/view-mode-switcher-sprite/toggle-direction-sprite.svg';
import './ViewModeSwitcher.css';

const ViewModeSwitcher = ({
  viewMode, onViewModeChange,
}) => (
  <div className="content-m__toggle">
    <button
      type="button"
      style={{ outline: 'none' }}
      className={`toggle-direction-m${
        viewMode === 'map'
          ? ' toggle-direction-m_active'
          : ''
      }`}
      onClick={() => onViewModeChange('map')}
    >
      <svg>
        <use xlinkHref={`${toggleDirection}#toggle-map`} />
      </svg>
    </button>
    <button
      type="button"
      style={{ outline: 'none' }}
      className={`toggle-direction-m${
        viewMode === 'table'
          ? ' toggle-direction-m_active'
          : ''
      }`}
      onClick={() => onViewModeChange('table')}
    >
      <svg>
        <use xlinkHref={`${toggleDirection}#toggle-table`} />
      </svg>
    </button>
    <button
      type="button"
      style={{ outline: 'none' }}
      className={`toggle-direction-m${
        viewMode === 'list'
          ? ' toggle-direction-m_active'
          : ''
      }`}
      onClick={() => onViewModeChange('list')}
    >
      <svg>
        <use xlinkHref={`${toggleDirection}#toggle-list`} />
      </svg>
    </button>
  </div>
);

ViewModeSwitcher.propTypes = {
  viewMode: PropTypes.string.isRequired,
  onViewModeChange: PropTypes.func.isRequired,
};

export default ViewModeSwitcher;
