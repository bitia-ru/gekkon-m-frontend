import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RouteCardTable from '../RouteCardTable/RouteCardTable';
import RouteCardList from '../RouteCardList/RouteCardList';
import RouteCardMap from '../RouteCardMap/RouteCardMap';

export default class RouteCardView extends Component {
  renderViewMode(viewMode) {
    const {
      user, routes, ascents, addRoute, sectorId, onRouteClick,
    } = this.props;
    switch (viewMode) {
    case 'map':
      return (
        <RouteCardMap />
      );
    case 'table':
      return (
        <RouteCardTable
          routes={routes}
          ascents={ascents}
          addRoute={addRoute}
          sectorId={sectorId}
          onRouteClick={onRouteClick}
          user={user}
        />
      );
    case 'list':
      return (
        <RouteCardList
          routes={routes}
          addRoute={addRoute}
          sectorId={sectorId}
          onRouteClick={onRouteClick}
          user={user}
        />
      );
    default:
      return '';
    }
  }

  render() {
    const { viewMode } = this.props;
    return (
      <React.Fragment>
        {this.renderViewMode(viewMode)}
      </React.Fragment>
    );
  }
}

RouteCardView.propTypes = {
  user: PropTypes.object,
  viewMode: PropTypes.string.isRequired,
  routes: PropTypes.array.isRequired,
  ascents: PropTypes.array.isRequired,
  addRoute: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};
