import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import RouteCard from '@/v1/components/RouteCard/RouteCard';
import Scheme from '@/v1/components/Scheme/Scheme';
import getArrayByIds from '@/v1/utils/getArrayByIds';
import './RouteCardScheme.css';

class RouteCardScheme extends Component {
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
      routeIds,
      onRouteClick,
    } = this.props;
    const { selectedRouteId } = this.state;
    const route = routes[selectedRouteId];
    return (
      <div className="content-m__inner-map" style={{ display: 'flex' }}>
        <div className="content-m__col-xs-12">
          <div className="content-m__map">
            <Scheme
              currentRoutes={getArrayByIds(routeIds, routes)}
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
  routeIds: PropTypes.array.isRequired,
  routes: PropTypes.object.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  routeIds: (
    state.routesStore.filtrationResults[0]
      ? state.routesStore.filtrationResults[0].routeIds
      : []
  ),
  routes: state.routesStore.routes,
});

export default withRouter(connect(mapStateToProps)(RouteCardScheme));
