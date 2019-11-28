import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteRow from '../RouteRow/RouteRow';
import getArrayByIds from '../../v1/utils/getArrayByIds';
import SectorContext from '../contexts/SectorContext';
import AddRouteButton from '../AddRouteButton/AddRouteButton';
import './RouteCardList.css';

const RouteCardList = ({
  user,
  addRoute,
  onRouteClick,
  routes,
  routeIds,
}) => (
  <SectorContext.Consumer>
    {
      ({ sector }) => (
        <>
          <div className="content-m__inner-card">
            {
              (sector && user) && <AddRouteButton onClick={addRoute} />
            }
          </div>
          <div className="content-m__inner-table">
            <div className="content-m__col-sm-12">
              <div className="table-m">
                <div className="table-m__header">
                  <div className="table-m__header-item table-m__header-item_number">№</div>
                  <div className="table-m__header-item table-m__header-item_level">Категория</div>
                  <div className="table-m__header-item table-m__header-item_hook">Зацепы</div>
                </div>
                {
                  R.map(
                    route => (
                      <RouteRow
                        key={route.id}
                        route={route}
                        onRouteClick={() => onRouteClick(route.id)}
                      />
                    ),
                    getArrayByIds(routeIds, routes),
                  )
                }
              </div>
            </div>
          </div>
        </>
      )
    }
  </SectorContext.Consumer>
);

RouteCardList.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  routeIds: PropTypes.array.isRequired,
  addRoute: PropTypes.func.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  routes: state.routes,
  routeIds: state.routeIds,
});

export default withRouter(connect(mapStateToProps)(RouteCardList));
