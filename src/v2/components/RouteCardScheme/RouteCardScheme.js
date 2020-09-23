import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import RouteCard from '@/v2/components/RouteCard/RouteCard';
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
      currentScale: 0,
    };
  }

  schemeFactor = () => this.SCHEME_SCALE_FACTORS[this.state.currentScale];

  pointerFactor = () => this.SCHEME_POINTER_SCALE_FACTORS[this.state.currentScale];

  getScaleFactor = currentScale => this.SCHEME_SCALE_FACTORS[currentScale];

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

    setTimeout(
      () => {
        const { currentScale } = this.state;
        const newScaleFactor = this.getScaleFactor(currentScale);
        const prevScaleFactor = this.getScaleFactor(currentScale - 1);
        const originalWidth = this.schemeContainerRef.clientWidth;
        const originalHeight = this.schemeContainerRef.clientHeight;
        const prevScrollTopPos = this.schemeContainerRef.scrollTop || 1;
        const prevScrollLeftPos = this.schemeContainerRef.scrollLeft || 1;
        const newScrollLeftPos = prevScrollLeftPos * (newScaleFactor / prevScaleFactor);
        const newScrollTopPos = prevScrollTopPos * (newScaleFactor / prevScaleFactor);
        this.schemeContainerRef.scrollLeft = prevScaleFactor === 1
          ? ((this.schemeContainerRef.scrollWidth - originalWidth) / 2)
          : newScrollLeftPos + (originalWidth / prevScaleFactor);
        this.schemeContainerRef.scrollTop = prevScaleFactor === 1
          ? ((this.schemeContainerRef.scrollHeight - originalHeight) / 2)
          : newScrollTopPos + (originalHeight / prevScaleFactor);
      },
      0,
    );
  };

  decreaseSchemeScale = () => {
    this.setState(
      prevState => ({
        currentScale: Math.max(prevState.currentScale - 1, 0),
      }),
    );

    const prevScrollTopPos = this.schemeContainerRef.scrollTop || 1;
    const prevScrollLeftPos = this.schemeContainerRef.scrollLeft || 1;

    setTimeout(
      () => {
        const { currentScale } = this.state;
        const newScaleFactor = this.getScaleFactor(currentScale);
        const prevScaleFactor = this.getScaleFactor(currentScale + 1);
        const newScrollTopPos = prevScrollTopPos * (newScaleFactor / prevScaleFactor);
        const newScrollLeftPos = prevScrollLeftPos * (newScaleFactor / prevScaleFactor);
        const originalHeight = this.schemeContainerRef.clientHeight;
        const originalWidth = this.schemeContainerRef.clientWidth;
        this.schemeContainerRef.scrollTop = newScrollTopPos - (originalHeight / prevScaleFactor);
        this.schemeContainerRef.scrollLeft = newScrollLeftPos - (originalWidth / prevScaleFactor);
      },
      0,
    );
  };

  scrollToRouteCard = () => {
    setTimeout(
      () => {
        this.cardRef.scrollIntoView({ block: 'end', behavior: 'smooth' });
      },
      0,
    );
  };

  render() {
    const { diagram, routes, routeIds, onRouteClick } = this.props;
    const { selectedRouteId, currentScale } = this.state;
    const route = routes[selectedRouteId];

    return (
      <div className={css(styles.contentMInnerMap)}>
        <div className={css(styles.contentMColXs12)}>
          <div
            className={css(styles.schemeContainer)}
            ref={(ref) => { this.schemeContainerRef = ref; }}
          >
            <Scheme
              currentRoutes={getArrayByIds(routeIds, routes)}
              diagram={diagram}
              onClick={this.selectRoute}
              pointerFactor={this.pointerFactor()}
              schemeFactor={this.schemeFactor()}
            />
          </div>
          <div className={css(styles.scalingButtonContainer)}>
            <div className={css(styles.scalingButtonWrapper)}>
              <Button
                size="medium"
                buttonStyle={currentScale === 0 ? 'disabled' : 'filter'}
                onClick={() => this.decreaseSchemeScale()}
                title="—"
                disabled={currentScale === 0}
              />
              <Button
                size="medium"
                buttonStyle={currentScale === this.SCHEME_SCALE_FACTORS_MAX ? 'disabled' : 'filter'}
                onClick={() => this.increaseSchemeScale()}
                title="+"
                disabled={currentScale === this.SCHEME_SCALE_FACTORS_MAX}
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
