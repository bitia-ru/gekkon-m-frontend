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
  SCHEME_SCALE_FACTORS = [1, 3, 5];
  SCHEME_POINTER_SCALE_FACTORS = [1, 0.8, 0.65];
  SCHEME_SCALE_FACTORS_MAX = this.SCHEME_SCALE_FACTORS.length - 1;

  constructor(props) {
    super(props);

    this.state = {
      selectedRouteId: null,
      schemeScaleFactors: [1, 3, 5],
      currentScale: 0,
    };
  }

  schemeFactor = () => this.SCHEME_SCALE_FACTORS[this.state.currentScale];

  pointerFactor = () => this.SCHEME_POINTER_SCALE_FACTORS[this.state.currentScale];

  selectRoute = (id) => {
    this.setState({ selectedRouteId: id });
    this.scrollToRouteCard();
  };

  increaseSchemeScale = () => {
    this.setState(
      prevState => ({
        currentScale: Math.min(prevState.currentScale + 1, this.SCHEME_SCALE_FACTORS_MAX),
      }),
    );
  };

  decreaseSchemeScale = () => {
    this.setState(
      prevState => ({
        currentScale: Math.max(prevState.currentScale - 1, 0),
      }),
    );
  };

  scrollToRouteCard = () => {
    setTimeout(
      () => {
        this.cardRef.scrollIntoView({ block: 'end', behavior: 'smooth' });
      },
      0,
    );
  }

  render() {
    const { diagram, routes, routeIds, onRouteClick } = this.props;
    const { selectedRouteId, currentScale } = this.state;
    const route = routes[selectedRouteId];

    return (
      <div className={css(styles.contentMInnerMap)}>
        <div className={css(styles.contentMColXs12)}>
          <div className={css(styles.schemeContainer)}>
            <div style={{ transform: `scale(${this.schemeFactor()})` }}>
              <Scheme
                currentRoutes={getArrayByIds(routeIds, routes)}
                diagram={diagram}
                onClick={this.selectRoute}
                pointerFactor={this.pointerFactor()}
              />
            </div>
          </div>
          <div className={css(styles.scalingButtonContainer)}>
            <div className={css(styles.scalingButtonWrapper)}>
              {
                currentScale > 0 && (
                  <Button
                    size="medium"
                    buttonStyle="filter"
                    onClick={() => this.decreaseSchemeScale()}
                    title="—"
                  />
                )
              }
              {
                currentScale < this.SCHEME_SCALE_FACTORS_MAX && (
                  <Button
                    size="medium"
                    buttonStyle="filter"
                    onClick={() => this.increaseSchemeScale()}
                    title="+"
                  />
                )
              }
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
