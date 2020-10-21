import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MainScreenContext from '@/v2/contexts/MainScreenContext';
import RouteCardTable from '../RouteCardTable/RouteCardTable';
import RouteCardList from '../RouteCardList/RouteCardList';
import RouteCardScheme from '../RouteCardScheme/RouteCardScheme';

export default class RouteCardView extends Component {
  renderViewMode(viewMode) {
    const {
      addRoute, onRouteClick, diagram,
    } = this.props;
    switch (viewMode) {
    case 'scheme':
      return (
        <MainScreenContext.Consumer>
          {({ parentContainerRef }) => (
            <RouteCardScheme
              diagram={diagram}
              onRouteClick={onRouteClick}
              parentContainerRef={parentContainerRef}
            />
          )}
        </MainScreenContext.Consumer>
      );
    case 'table':
      return (
        <RouteCardTable
          addRoute={addRoute}
          onRouteClick={onRouteClick}
        />
      );
    case 'list':
      return (
        <RouteCardList
          addRoute={addRoute}
          onRouteClick={onRouteClick}
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
  diagram: PropTypes.string,
  viewMode: PropTypes.string.isRequired,
  addRoute: PropTypes.func.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};
