import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import RouteCard from '../RouteCard/RouteCard';
import AddRouteButton from '../AddRouteButton/AddRouteButton';
import './RouteCardTable.css';

const RouteCardTable = ({
  user, routes, ascents, sectorId, addRoute, onRouteClick,
}) => (
  <div className="content-m__inner-card">
    {
      (sectorId !== 0 && user) && <AddRouteButton onClick={addRoute} />
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
        <RouteCard
          route={route}
          ascent={R.find(ascent => ascent.route_id === route.id, ascents)}
        />
      </div>
    ), routes)}
  </div>
);


RouteCardTable.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.array.isRequired,
  ascents: PropTypes.array.isRequired,
  addRoute: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

export default RouteCardTable;
