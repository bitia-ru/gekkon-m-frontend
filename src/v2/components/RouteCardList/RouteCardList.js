import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteRow from '@/v1/components/RouteRow/RouteRow';
import getArrayByIds from '@/v1/utils/getArrayByIds';
import SectorContext from '@/v1/contexts/SectorContext';
import AddRouteButton from '@/v2/components/AddRouteButton/AddRouteButton';
import { StyleSheet, css } from '../../aphrodite';

const RouteCardList = ({
  user,
  addRoute,
  onRouteClick,
  routes,
  routeIds,
}) => (
  <SectorContext.Consumer>
    {
      ({ sector }) => (
        <>
          <div className={css(styles.contentMInnerCard)}>
            {
              (sector && user) && <AddRouteButton onClick={addRoute} />
            }
          </div>
          <div className={css(styles.contentMInnerTable)}>
            <div className={css(styles.contentMColSm12)}>
              <div className={css(styles.tableM)}>
                <div className={css(styles.tableMHeader)}>
                  <div className={css(styles.tableMHeaderItem, styles.tableMHeaderItemNumber)}>
                    №
                  </div>
                  <div className={css(styles.tableMHeaderItem, styles.tableMHeaderItemLevel)}>
                    Категория
                  </div>
                  <div className={css(styles.tableMHeaderItem, styles.tableMHeaderItemHook)}>
                    Зацепы
                  </div>
                </div>
                {
                  R.map(
                    route => (
                      <RouteRow
                        key={route.id}
                        route={route}
                        onRouteClick={() => onRouteClick(route.id)}
                      />
                    ),
                    getArrayByIds(routeIds, routes),
                  )
                }
              </div>
            </div>
          </div>
        </>
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
  contentMInnerTable: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: '-15px',
    marginRight: '-15px',
  },
  contentMColSm12: {
    '@media screen and (max-width: 800px)': {
      width: 'calc(100% - 24px)',
      marginLeft: '12px',
      marginRight: '12px',
      display: 'flex',
    },
  },
  tableM: {
    width: '100%',
    marginBottom: '20px',
  },
  tableMHeader: {
    display: 'flex',
    padding: '12px 18px',
    backgroundColor: '#ffffff',
    border: '2px solid #D1D5E2',
  },
  tableMHeaderItem: {
    fontSize: '16px',
    color: '#A5A4A4',
    lineHeight: '16px',
    width: '40%',
  },
  tableMHeaderItemNumber: { width: '20%' },
  tableMHeaderItemLevel: {
    width: '50%',
    textAlign: 'center',
  },
  tableMHeaderItemHook: {
    textAlign: 'right',
    width: '30%',
  },
});

RouteCardList.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  routeIds: PropTypes.array.isRequired,
  addRoute: PropTypes.func.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  routes: state.routesStoreV2.routes,
  routeIds: (
    state.routesStoreV2.filtrationResults[0]
      ? state.routesStoreV2.filtrationResults[0].routeIds
      : []
  ),
  user: state.usersStore.users[state.usersStore.currentUserId],
});

export default withRouter(connect(mapStateToProps)(RouteCardList));
