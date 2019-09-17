import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteCardView from '../RouteCardView/RouteCardView';
import FilterControl from '../FilterControl/FilterControl';
import Pagination from '../Pagination/Pagination';
import NUM_OF_DISPLAYED_PAGES from '../Constants/Pagination';
import './Content.css';

export default class Content extends Component {
  pagesList = () => {
    const { numOfPages, page } = this.props;
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

  render() {
    const {
      user,
      page,
      numOfPages,
      routes,
      ascents,
      sectorId,
      addRoute,
      onRouteClick,
      changePage,
      numOfRoutes,
      showFilters,
      viewMode,
      changeViewMode,
    } = this.props;
    return (
      <div className="content-m">
        <div className="content-m__container">
          <FilterControl
            viewMode={viewMode}
            onViewModeChange={changeViewMode}
            numOfRoutes={numOfRoutes}
            showFilters={showFilters}
          />
          <RouteCardView
            viewMode={viewMode}
            addRoute={addRoute}
            sectorId={sectorId}
            user={user}
            routes={routes}
            ascents={ascents}
            onRouteClick={onRouteClick}
          />
          <Pagination
            onPageChange={changePage}
            page={page}
            pagesList={this.pagesList()}
            firstPage={1}
            lastPage={numOfPages}
          />
        </div>
      </div>
    );
  }
}

Content.propTypes = {
  user: PropTypes.object,
  viewMode: PropTypes.string.isRequired,
  changeViewMode: PropTypes.func.isRequired,
  routes: PropTypes.array.isRequired,
  ascents: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  numOfPages: PropTypes.number.isRequired,
  changePage: PropTypes.func.isRequired,
  addRoute: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
  onRouteClick: PropTypes.func.isRequired,
  numOfRoutes: PropTypes.number.isRequired,
  showFilters: PropTypes.func.isRequired,
};
