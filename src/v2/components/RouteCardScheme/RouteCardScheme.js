import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import RouteCard from '@/v1/components/RouteCard/RouteCard';
import Scheme from '@/v1/components/Scheme/Scheme';
import getArrayByIds from '@/v1/utils/getArrayByIds';
import { StyleSheet, css } from '../../aphrodite';

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
      <div className={css(styles.contentMInnerMap)}>
        <div className={css(styles.contentMColXs12)}>
          <div>
            <Scheme
              currentRoutes={getArrayByIds(routeIds, routes)}
              diagram={diagram}
              onClick={this.selectRoute}
            />
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

const styles = StyleSheet.create({
  contentMInnerMapCard: {
    marginTop: '20px',
    display: 'flex',
  },
  contentMInnerMap: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  contentMColSm6: {
    '@media screen and (mix-width: 720px)': {
      width: 'calc(50% - 24px)',
      maxWidth: '50%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  contentMColXs12: {
    width: '100%',
    maxWidth: '100%',
  },
});

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
