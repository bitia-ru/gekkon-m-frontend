import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteCardView from '../RouteCardView/RouteCardView';
import FilterControl from '../FilterControl/FilterControl';
import Pagination from '../Pagination/Pagination';
import NUM_OF_DISPLAYED_PAGES from '../Constants/Pagination';
import SectorContext from '../contexts/SectorContext';
import getNumOfPages from '../../v1/utils/getNumOfPages';
import './Content.css';

class Content extends Component {
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
      addRoute,
      onRouteClick,
      changePage,
      numOfRoutes,
      showFilters,
      viewMode,
      changeViewMode,
    } = this.props;
    return (
      <SectorContext.Consumer>
        {
          ({ sector }) => {
            const diagram = sector && sector.diagram && sector.diagram.url;
            return (
              <div className="content-m">
                <div className="content-m__container">
                  <FilterControl
                    viewMode={viewMode}
                    onViewModeChange={changeViewMode}
                    numOfRoutes={numOfRoutes}
                    showFilters={showFilters}
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
                    addRoute={addRoute}
                    user={user}
                    onRouteClick={onRouteClick}
                  />
                  {
                    viewMode !== 'scheme' && <Pagination
                      onPageChange={changePage}
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
  user: PropTypes.object,
  viewMode: PropTypes.string.isRequired,
  changeViewMode: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  numOfPages: PropTypes.number.isRequired,
  changePage: PropTypes.func.isRequired,
  addRoute: PropTypes.func.isRequired,
  onRouteClick: PropTypes.func.isRequired,
  numOfRoutes: PropTypes.number.isRequired,
  showFilters: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  numOfPages: getNumOfPages(state),
});

export default withRouter(connect(mapStateToProps)(Content));
