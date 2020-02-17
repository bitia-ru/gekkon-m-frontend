import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ViewModeSwitcher from '../ViewModeSwitcher/ViewModeSwitcher';
import getFilters from '../../utils/getFilters';
import './FilterControl.css';
import { setSelectedFilter, setSelectedViewMode } from '@/v1/actions';

class FilterControl extends Component {
  getSpotId = () => {
    const { match } = this.props;
    return parseInt(match.params.id, 10);
  };

  getSectorId = () => {
    const { match } = this.props;
    return match.params.sector_id ? parseInt(match.params.sector_id, 10) : 0;
  };

  onViewModeChange = (viewMode) => {
    const {
      setSelectedFilter: setSelectedFilterProp,
      setSelectedViewMode: setSelectedViewModeProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    let date = '';
    setSelectedViewModeProp(spotId, sectorId, viewMode);
    if (viewMode === 'scheme') {
      date = getFilters(spotId, sectorId).date;
      setSelectedFilterProp(spotId, sectorId, 'date', date);
    }
  };

  render() {
    const {
      viewMode, numOfRoutes, showFilters, viewModeData,
    } = this.props;
    return (
      <React.Fragment>
        <button type="button" className="btn-filter" onClick={showFilters}>
      <span className="btn-filter__icon">
        <svg aria-hidden="true">
          <use xlinkHref={`${require('./images/filter-icon.svg')}#icon-filter`}/>
        </svg>
      </span>
          Фильтры
        </button>
        <div className="content-m__nav">
          <div className="content-m__info-block">{`Всего трасс: ${numOfRoutes}`}</div>
          <ViewModeSwitcher
            onViewModeChange={this.onViewModeChange}
            viewMode={viewMode}
            viewModeData={viewModeData}
          />
        </div>
      </React.Fragment>
    );
  }
}

FilterControl.propTypes = {
  viewModeData: PropTypes.object,
  viewMode: PropTypes.string.isRequired,
  numOfRoutes: PropTypes.number.isRequired,
  showFilters: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  setSelectedViewMode: (spotId, sectorId, viewMode) => (
    dispatch(setSelectedViewMode(spotId, sectorId, viewMode))
  ),
  setSelectedFilter: (spotId, sectorId, filterName, filterValue) => (
    dispatch(setSelectedFilter(spotId, sectorId, filterName, filterValue))
  ),
});

export default withRouter(connect(null, mapDispatchToProps)(FilterControl));
