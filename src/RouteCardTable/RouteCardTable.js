import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import RouteCard from '../RouteCard/RouteCard';
import './RouteCardTable.css';

const RouteCardTable = ({
  user, routes, ascents, sectorId, addRoute, onRouteClick,
}) => (
  <div className="content-m__inner-card">
    {
      (sectorId !== 0 && user)
        ? (
          <div className="content-m__col-sm-6 content-m__col-xs-12">
            <a
              role="link"
              tabIndex="0"
              style={{ outline: 'none' }}
              className="card-m card-m__edit"
              onClick={addRoute}
            >
              <span className="card-m__edit-icon" />
              <span className="card-m__edit-title">Добавить новую трассу</span>
            </a>
          </div>
        )
        : ''
    }
    {R.map(route => (
      <RouteCard
        key={route.id}
        route={route}
        ascent={R.find(ascent => ascent.route_id === route.id, ascents)}
        onRouteClick={() => onRouteClick(route.id)}
      />
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

RouteCardTable.defaultProps = {
  user: null,
};

export default RouteCardTable;
