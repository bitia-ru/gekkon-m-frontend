import React from 'react';
import PropTypes from 'prop-types';
import ViewModeSwitcher from '../ViewModeSwitcher/ViewModeSwitcher';
import filterImage from '../../img/btn-filter-img/filter-icon.svg';
import './FilterControl.css';

const FilterControl = ({
  viewMode, onViewModeChange, numOfRoutes, showFilters,
}) => (
  <React.Fragment>
    <button type="button" className="btn-filter" onClick={showFilters}>
      <span className="btn-filter__icon">
        <svg aria-hidden="true">
          <use xlinkHref={`${filterImage}#icon-filter`} />
        </svg>
      </span>
          Фильтры
    </button>
    <div className="content-m__nav">
      <div className="content-m__info-block">{`Всего трасс: ${numOfRoutes}`}</div>
      <ViewModeSwitcher
        onViewModeChange={onViewModeChange}
        viewMode={viewMode}
      />
    </div>
  </React.Fragment>
);

FilterControl.propTypes = {
  viewMode: PropTypes.string.isRequired,
  onViewModeChange: PropTypes.func.isRequired,
  numOfRoutes: PropTypes.number.isRequired,
  showFilters: PropTypes.func.isRequired,
};

export default FilterControl;
