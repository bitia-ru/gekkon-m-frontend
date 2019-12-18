import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import RouteCard from '../RouteCard/RouteCard';
import getArrayByIds from '../../utils/getArrayByIds';
import SectorContext from '../../contexts/SectorContext';
import AddRouteButton from '../AddRouteButton/AddRouteButton';
import './RouteCardTable.css';

const RouteCardTable = ({
  user, routes, addRoute, onRouteClick, routeIds,
}) => (
  <SectorContext.Consumer>
    {
      ({ sector }) => (
        <div className="content-m__inner-card">
          {
            (sector && user) && <AddRouteButton onClick={addRoute} />
          }
          {R.map(route => (
            <div
              key={route.id}
              role="button"
              tabIndex="0"
              style={{ outline: 'none' }}
              className="content-m__col-sm-6 content-m__col-xs-12"
              onClick={() => onRouteClick(route.id)}
            >
              <RouteCard route={route} />
            </div>
          ), getArrayByIds(routeIds, routes))}
        </div>
      )
    }
  </SectorContext.Consumer>
);


RouteCardTable.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  routeIds: PropTypes.array.isRequired,
  addRoute: PropTypes.func.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  routes: state.routesStore.routes,
  routeIds: (
    state.routesStore.filtrationResults[0]
      ? state.routesStore.filtrationResults[0].routeIds
      : []
  ),
});

export default withRouter(connect(mapStateToProps)(RouteCardTable));
