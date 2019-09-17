import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RouteCardTable from '../RouteCardTable/RouteCardTable';
import RouteCardList from '../RouteCardList/RouteCardList';
import RouteCardScheme from '../RouteCardScheme/RouteCardScheme';

export default class RouteCardView extends Component {
  renderViewMode(viewMode) {
    const {
      user, routes, ascents, addRoute, sectorId, onRouteClick, diagram,
    } = this.props;
    switch (viewMode) {
    case 'scheme':
      return (
        <RouteCardScheme
          diagram={diagram}
          routes={routes}
          ascents={ascents}
          sectorId={sectorId}
          onRouteClick={onRouteClick}
        />
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
  diagram: PropTypes.string,
  viewMode: PropTypes.string.isRequired,
  routes: PropTypes.array.isRequired,
  ascents: PropTypes.array.isRequired,
  addRoute: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};
