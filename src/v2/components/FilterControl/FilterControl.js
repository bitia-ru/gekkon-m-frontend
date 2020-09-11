import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ViewModeSwitcher from '@/v1/components/ViewModeSwitcher/ViewModeSwitcher';
import getFilters from '@/v1/utils/getFilters';
import './FilterControl.css';
import { setSelectedFilter, setSelectedViewMode } from '@/v1/actions';
import { StyleSheet, css } from '../../aphrodite';

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
      selectedFilters,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    setSelectedViewModeProp(spotId, sectorId, viewMode);
    if (viewMode === 'scheme') {
      const filters = getFilters(selectedFilters, spotId, sectorId);
      setSelectedFilterProp(spotId, sectorId, filters);
    }
  };

  render() {
    const {
      viewMode, numOfRoutes, viewModeData, history,
    } = this.props;
    return (
      <>
        <button type="button" className="btn-filter" onClick={() => history.push('#filters')}>
          <span className="btn-filter__icon">
            <svg aria-hidden="true">
              <use xlinkHref={`${require('./images/filter-icon.svg')}#icon-filter`} />
            </svg>
          </span>
          Фильтры
        </button>
        <div className={css(styles.contentMNav)}>
          <div className="content-m__info-block">{`Всего трасс: ${numOfRoutes}`}</div>
          <ViewModeSwitcher
            onViewModeChange={this.onViewModeChange}
            viewMode={viewMode}
            viewModeData={viewModeData}
          />
        </div>
      </>
    );
  }
}

const styles = StyleSheet.create({
  contentMNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '26px',
    marginBottom: '26px',
  },
});

FilterControl.propTypes = {
  viewModeData: PropTypes.object,
  viewMode: PropTypes.string.isRequired,
  numOfRoutes: PropTypes.number.isRequired,
  history: PropTypes.object,
  setSelectedFilter: PropTypes.func,
  setSelectedViewMode: PropTypes.func,
  selectedFilters: PropTypes.object,
};

const mapStateToProps = state => ({
  selectedFilters: state.selectedFilters,
});

const mapDispatchToProps = dispatch => ({
  setSelectedViewMode: (spotId, sectorId, viewMode) => (
    dispatch(setSelectedViewMode(spotId, sectorId, viewMode))
  ),
  setSelectedFilter: (spotId, sectorId, filters) => (
    dispatch(setSelectedFilter(spotId, sectorId, filters))
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilterControl));
