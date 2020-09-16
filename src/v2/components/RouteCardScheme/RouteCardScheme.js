import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import RouteCard from '@/v1/components/RouteCard/RouteCard';
import Scheme from '@/v1/components/Scheme/Scheme';
import Button from '@/v1/components/Button/Button';
import getArrayByIds from '@/v1/utils/getArrayByIds';
import { css } from '../../aphrodite';
import styles from './styles';

class RouteCardScheme extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRouteId: null,
      schemeIsScaled: false,
    };
  }

  selectRoute = (id) => {
    this.setState({ selectedRouteId: id });
  };

  changeSchemeScale = () => {
    this.setState(
      prevState => ({
        schemeIsScaled: !prevState.schemeIsScaled,
      }),
    );
  };

  render() {
    const { diagram, routes, routeIds, onRouteClick } = this.props;
    const { selectedRouteId, schemeIsScaled } = this.state;
    const route = routes[selectedRouteId];

    return (
      <div className={css(styles.contentMInnerMap)}>
        <div className={css(styles.contentMColXs12)}>
          <div className={css(styles.schemeContainer)}>
            <div style={{ transform: `scale(${schemeIsScaled ? 4 : 1})` }}>
              <Scheme
                currentRoutes={getArrayByIds(routeIds, routes)}
                diagram={diagram}
                onClick={this.selectRoute}
              />
            </div>
          </div>
          <div className={css(styles.scalingButtonContainer)}>
            <div>
              <Button
                size="medium"
                buttonStyle="filter"
                onClick={this.changeSchemeScale}
                title={schemeIsScaled ? '—' : '+'}
              />
            </div>
          </div>
        </div>
        <div
          className={css(styles.contentMColSm6, styles.contentMColXs12)}
          ref={(ref) => { this.cardRef = ref; }}
        >
          {
            selectedRouteId && <div
              role="button"
              tabIndex={0}
              style={{ outline: 'none' }}
              className={css(styles.contentMInnerMapCard)}
              onClick={() => onRouteClick(route.id)}
            >
              <RouteCard route={route} />
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
    state.routesStoreV2.filtrationResults[0]
      ? state.routesStoreV2.filtrationResults[0].routeIds
      : []
  ),
  routes: state.routesStoreV2.routes,
});

export default withRouter(connect(mapStateToProps)(RouteCardScheme));
