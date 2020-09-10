import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import RouteCard from '@/v1/components/RouteCard/RouteCard';
import getArrayByIds from '@/v1/utils/getArrayByIds';
import SectorContext from '@/v1/contexts/SectorContext';
import AddRouteButton from '@/v1/components/AddRouteButton/AddRouteButton';
import { css, StyleSheet } from '../../aphrodite';

const RouteCardTable = ({
  user, routes, addRoute, onRouteClick, routeIds,
}) => (
  <SectorContext.Consumer>
    {
      ({ sector }) => (
        <div className={css(styles.contentMInnerCard)}>
          {
            (sector && user) && <AddRouteButton onClick={addRoute} />
          }
          {R.map(route => (
            <div
              key={route.id}
              role="button"
              tabIndex="0"
              style={{ outline: 'none' }}
              className={css(styles.contentMColSm6, styles.contentMColXs12)}
              onClick={() => onRouteClick(route.id)}
            >
              <RouteCard route={route} />
            </div>
          ), getArrayByIds(routeIds, routes))}
        </div>
      )
    }
  </SectorContext.Consumer>
);

const styles = StyleSheet.create({
  contentMInnerCard: {
    display: 'flex',
    flexWrap: 'wrap',
    '@media screen and (mix-width: 720px)': {
      marginLeft: '-12px',
      marginRight: '-12px',
    },
  },
  contentMColSm6: {
    '@media screen and (mix-width: 720px)': {
      width: 'calc(50% - 24px)',
      maxWidth: '50%',
      marginLeft: '12px',
      marginRight: '12px',
    },
  },
  contentMColXs12: {
    width: '100%',
    maxWidth: '100%',
  },
});

RouteCardTable.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  routeIds: PropTypes.array.isRequired,
  addRoute: PropTypes.func.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  routes: state.routesStore.routes,
  routeIds: (
    state.routesStore.filtrationResults[0]
      ? state.routesStore.filtrationResults[0].routeIds
      : []
  ),
  user: state.usersStore.users[state.usersStore.currentUserId],
});

export default withRouter(connect(mapStateToProps)(RouteCardTable));
