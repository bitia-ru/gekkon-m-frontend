import React from 'react';
import PropTypes from 'prop-types';
import RouteColor from '../RouteColor/RouteColor';
import Category from '../Category/Category';
import './RouteRow.css';
import { routeCategoryToString } from '@/lib/routeHelpers';

const RouteRow = ({ onRouteClick, route }) => (
  <div
    role="button"
    tabIndex={0}
    style={{ cursor: 'pointer', outline: 'none' }}
    onClick={onRouteClick || null}
    className="table-m__row"
  >
    <div className="table-m__row-item table-m__row-item_number">
      {route.number ? `№${route.number}` : `#${route.id}`}
    </div>
    <div className="table-m__row-item table-m__row-item_level">
      <Category category={routeCategoryToString(route)} />
    </div>
    <div className="table-m__row-item table-m__row-item_hook">
      <RouteColor route={route} fieldName="holds_color" />
    </div>
  </div>
);

RouteRow.propTypes = {
  onRouteClick: PropTypes.func,
  route: PropTypes.object.isRequired,
};

export default RouteRow;
