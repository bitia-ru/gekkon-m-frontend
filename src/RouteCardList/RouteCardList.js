import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class RouteCardList extends Component {
  render() {
    return (
      <div>
            List
      </div>
    );
  }
}

RouteCardList.propTypes = {
  routes: PropTypes.array.isRequired,
  ascents: PropTypes.array.isRequired,
  addRoute: PropTypes.func.isRequired,
  sectorId: PropTypes.number.isRequired,
};
