import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteRow from '../RouteRow/RouteRow';
import AddRouteButton from '../AddRouteButton/AddRouteButton';
import './RouteCardList.css';

const RouteCardList = ({
  user,
  sectorId,
  addRoute,
  onRouteClick,
  routes,
}) => (
  <>
    <div className="content-m__inner-card">
      {
        (sectorId !== 0 && user) && <AddRouteButton onClick={addRoute} />
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
              routes,
            )
          }
        </div>
      </div>
    </div>
  </>
);

RouteCardList.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.array.isRequired,
  addRoute: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

export default RouteCardList;
