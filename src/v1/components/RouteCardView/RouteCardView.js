import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RouteCardTable from '../RouteCardTable/RouteCardTable';
import RouteCardList from '../RouteCardList/RouteCardList';
import RouteCardScheme from '../RouteCardScheme/RouteCardScheme';

export default class RouteCardView extends Component {
  renderViewMode(viewMode) {
    const {
      user, addRoute, onRouteClick, diagram,
    } = this.props;
    switch (viewMode) {
    case 'scheme':
      return (
        <RouteCardScheme
          diagram={diagram}
          onRouteClick={onRouteClick}
        />
      );
    case 'table':
      return (
        <RouteCardTable
          addRoute={addRoute}
          onRouteClick={onRouteClick}
          user={user}
        />
      );
    case 'list':
      return (
        <RouteCardList
          addRoute={addRoute}
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
  addRoute: PropTypes.func.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};
