import React from 'react';
import PropTypes from 'prop-types';
import ViewModeSwitcher from '../ViewModeSwitcher/ViewModeSwitcher';
import './FilterControl.css';

const FilterControl = ({
  viewMode, onViewModeChange, numOfRoutes, showFilters, viewModeData,
}) => (
  <React.Fragment>
    <button type="button" className="btn-filter" onClick={showFilters}>
      <span className="btn-filter__icon">
        <svg aria-hidden="true">
          <use xlinkHref={`${require('./images/filter-icon.svg')}#icon-filter`} />
        </svg>
      </span>
      Фильтры
    </button>
    <div className="content-m__nav">
      <div className="content-m__info-block">{`Всего трасс: ${numOfRoutes}`}</div>
      <ViewModeSwitcher
        onViewModeChange={onViewModeChange}
        viewMode={viewMode}
        viewModeData={viewModeData}
      />
    </div>
  </React.Fragment>
);

FilterControl.propTypes = {
  viewModeData: PropTypes.object,
  viewMode: PropTypes.string.isRequired,
  onViewModeChange: PropTypes.func.isRequired,
  numOfRoutes: PropTypes.number.isRequired,
  showFilters: PropTypes.func.isRequired,
};

export default FilterControl;
