import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class RouteCardMap extends Component {
  render() {
    return (
      <div>
        Map
      </div>
    );
  }
}

RouteCardMap.propTypes = {
  routes: PropTypes.array.isRequired,
  ascents: PropTypes.array.isRequired,
  addRoute: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
};
