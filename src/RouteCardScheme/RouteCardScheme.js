import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteCard from '../RouteCard/RouteCard';
import Scheme from '../Scheme/Scheme';
import './RouteCardScheme.css';

export default class RouteCardScheme extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRouteId: null,
    };
  }

  selectRoute = (id) => {
    this.setState({ selectedRouteId: id });
  };

  render() {
    const {
      diagram,
      routes,
      ascents,
      onRouteClick,
    } = this.props;
    const { selectedRouteId } = this.state;
    const route = R.find(r => r.id === selectedRouteId, routes);
    return (
      <div className="content-m__inner-map" style={{ display: 'flex' }}>
        <div className="content-m__col-xs-12">
          <div className="content-m__map">
            <Scheme
              routes={routes}
              diagram={diagram}
              onClick={this.selectRoute}
            />
          </div>
        </div>
        <div
          className="content-m__col-xs-12 content-m__col-sm-6 content-m__center-sm"
          ref={(ref) => { this.cardRef = ref; }}
        >
          {
            selectedRouteId && <div
              role="button"
              tabIndex={0}
              style={{ outline: 'none' }}
              className="content-m__inner-map-card"
              onClick={() => onRouteClick(route.id)}
            >
              <RouteCard
                route={route}
                ascent={R.find(ascent => ascent.route_id === route.id, ascents)}
              />
            </div>
          }
        </div>
      </div>
    );
  }
}

RouteCardScheme.propTypes = {
  diagram: PropTypes.string,
  routes: PropTypes.array.isRequired,
  ascents: PropTypes.array.isRequired,
  sectorId: PropTypes.number.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};
