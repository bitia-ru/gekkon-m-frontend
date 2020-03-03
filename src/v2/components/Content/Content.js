import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteCardView from '@/v1/components/RouteCardView/RouteCardView';
import FilterControl from '@/v2/components/FilterControl/FilterControl';
import Pagination from '@/v1/components/Pagination/Pagination';
import NUM_OF_DISPLAYED_PAGES from '@/v1/Constants/Pagination';
import SectorContext from '@/v1/contexts/SectorContext';
import getNumOfPages from '@/v1/utils/getNumOfPages';
import './Content.css';
import {
  setSelectedPage,
} from '@/v1/actions';
import reloadRoutes from '@/v1/utils/reloadRoutes';
import getViewMode from '@/v1/utils/getViewMode';
import getPage from '@/v1/utils/getPage';
import getNumOfRoutes from '@/v1/utils/getNumOfRoutes';
import getArrayByIds from '@/v1/utils/getArrayByIds';

class Content extends Component {
  componentDidMount() {
    reloadRoutes(this.getSpotId(), this.getSectorId());
  }

  componentDidUpdate(prevProps) {
    if (this.needReload(prevProps)) {
      reloadRoutes(this.getSpotId(), this.getSectorId());
    }
  }

  needReload = (prevProps) => {
    const {
      selectedFilters,
      selectedViewModes,
      selectedPages,
      match,
    } = this.props;
    if (!R.equals(selectedFilters, prevProps.selectedFilters)) {
      return true;
    }
    if (!R.equals(selectedViewModes, prevProps.selectedViewModes)) {
      return true;
    }
    if (!R.equals(selectedPages, prevProps.selectedPages)) {
      return true;
    }
    if (!R.equals(match.url, prevProps.match.url)) {
      return true;
    }
    return false;
  };

  getSpotId = () => {
    const { match } = this.props;
    return parseInt(match.params.id, 10);
  };

  getSectorId = () => {
    const { match } = this.props;
    return match.params.sector_id ? parseInt(match.params.sector_id, 10) : 0;
  };

  onRouteClick = (id) => {
    const { history, match } = this.props;
    history.push(`${match.url}/routes/${id}`);
  };

  changePage = (page) => {
    const {
      setSelectedPage: setSelectedPageProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    setSelectedPageProp(spotId, sectorId, page);
  };

  pagesList = () => {
    const { numOfPages } = this.props;
    const page = getPage(this.getSpotId(), this.getSectorId());
    if (NUM_OF_DISPLAYED_PAGES >= numOfPages) {
      return R.range(1, numOfPages + 1);
    }
    const firstPage = page - Math.floor(NUM_OF_DISPLAYED_PAGES / 2);
    const lastPage = firstPage + NUM_OF_DISPLAYED_PAGES;
    if (firstPage >= 1 && lastPage <= numOfPages) {
      return R.range(firstPage, lastPage);
    }
    if (firstPage >= 1) {
      return R.range(numOfPages - NUM_OF_DISPLAYED_PAGES + 1, numOfPages + 1);
    }
    return R.range(1, NUM_OF_DISPLAYED_PAGES + 1);
  };

  addRoute = () => { this.props.history.push(`${this.props.match.url}/routes/new`); };

  render() {
    const {
      routeIds, routes,
    } = this.props;
    const {
      numOfPages,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const page = getPage(spotId, sectorId);
    const viewMode = getViewMode(spotId, sectorId);
    return (
      <SectorContext.Consumer>
        {
          ({ sector }) => {
            const diagram = sector && sector.diagram && sector.diagram.url;
            const numOfRoutes = (viewMode === 'scheme'
              ? getArrayByIds(routeIds, routes).length
              : getNumOfRoutes(spotId, sectorId)
            );
            return (
              <div className="content-m">
                <div className="content-m__container">
                  <FilterControl
                    viewMode={viewMode}
                    numOfRoutes={numOfRoutes}
                    viewModeData={
                      sector
                        ? {
                          scheme: {
                            title: diagram ? undefined : 'Схема зала ещё не загружена',
                            disabled: diagram === null,
                          },
                          table: {},
                          list: {},
                        }
                        : {
                          table: {},
                          list: {},
                        }
                    }
                  />
                  <RouteCardView
                    diagram={diagram}
                    viewMode={viewMode}
                    addRoute={this.addRoute}
                    onRouteClick={this.onRouteClick}
                  />
                  {
                    viewMode !== 'scheme' && <Pagination
                      onPageChange={this.changePage}
                      page={page}
                      pagesList={this.pagesList()}
                      firstPage={1}
                      lastPage={numOfPages}
                    />
                  }
                </div>
              </div>
            );
          }
        }
      </SectorContext.Consumer>
    );
  }
}

Content.propTypes = {
  numOfPages: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  numOfPages: getNumOfPages(state),
  selectedViewModes: state.selectedViewModes,
  selectedPages: state.selectedPages,
  selectedFilters: state.selectedFilters,
  routes: state.routesStore.routes,
  routeIds: (
    state.routesStore.filtrationResults[0]
      ? state.routesStore.filtrationResults[0].routeIds
      : []
  ),
});

const mapDispatchToProps = dispatch => ({
  setSelectedPage: (spotId, sectorId, page) => dispatch(setSelectedPage(spotId, sectorId, page)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Content));
