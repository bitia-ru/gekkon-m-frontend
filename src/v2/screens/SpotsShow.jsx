import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Content from '@/v2/components/Content/Content';
import Header from '@/v2/components/Header/Header';
import RoutesShowModal from '@/v2/components/RoutesShowModal/RoutesShowModal';
import RoutesEditModal from '@/v2/components/RoutesEditModal/RoutesEditModal';
import ScrollToTopOnMount from '@/v1/components/ScrollToTopOnMount';
import SpotContext from '@/v1/contexts/SpotContext';
import SectorContext from '@/v1/contexts/SectorContext';
import { reloadSector as reloadSectorAction } from '@/v1/utils/reloadSector';
import { loadSpot as loadSpotAction } from '@/v2/redux/spots/actions';
import getCurrentSector from '@/v1/utils/getCurrentSector';
import getCurrentSpotOrSectorData from '@/v1/utils/getCurrentSpotOrSectorData';
import MainScreen from '@/v2/layouts/MainScreen/MainScreen';

class SpotsShow extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showFilters: false,
    };
  }

  componentDidMount() {
    const sectorId = this.getSectorId();
    this.props.loadSpot(this.getSpotId());
    if (sectorId !== 0) {
      this.props.reloadSector(sectorId);
    }
  }

  getSpotId = () => {
    const { match } = this.props;
    return parseInt(match.params.id, 10);
  };

  getSectorId = () => {
    const { match } = this.props;
    return match.params.sector_id ? parseInt(match.params.sector_id, 10) : 0;
  };

  closeRoutesModal = () => { this.props.history.push(R.replace('/routes', '', this.props.match.url)); };

  changeSectorFilter = (id) => {
    const { history, match } = this.props;
    if (id !== 0) {
      this.props.reloadSector(id);
      history.push(`${R.replace(/\/sectors\/[0-9]*/, '', match.url)}/sectors/${id}`);
    } else {
      this.props.loadSpot(this.getSpotId());
      history.push(R.replace(/\/sectors\/[0-9]*/, '', match.url));
    }
  };

  openEdit = (routeId) => {
    this.props.history.push(`${this.props.match.url}/routes/${routeId}/edit`);
  };

  cancelEdit = () => { this.props.history.goBack(); };

  content = () => {
    const {
      match, spots, sectors,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    return (
      <Switch>
        <Route
          path={[`${match.path}/routes/:route_id/edit`, `${match.path}/routes/new`]}
          render={() => (
            <RoutesEditModal
              onClose={this.closeRoutesModal}
              cancel={this.cancelEdit}
            />
          )}
        />
        <Route
          path={`${match.path}/routes/:route_id`}
          render={() => (
            <RoutesShowModal
              onClose={this.closeRoutesModal}
              openEdit={this.openEdit}
            />
          )}
        />
        <Route
          path={match.path}
          render={() => (
            <>
              <MainScreen
                header={
                  <Header
                    data={getCurrentSpotOrSectorData(spots, sectors, spotId, sectorId)}
                    changeSectorFilter={this.changeSectorFilter}
                  />
                }
              >
                <Content />
              </MainScreen>
            </>
          )}
        />
      </Switch>
    );
  };

  render() {
    const { spots, sectors } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const spot = spots[spotId];
    const sector = getCurrentSector(sectors, sectorId);
    return (
      <>
        <ScrollToTopOnMount />
        <SpotContext.Provider value={{ spot }}>
          <SectorContext.Provider value={{ sector }}>
            {this.content()}
          </SectorContext.Provider>
        </SpotContext.Provider>
      </>
    );
  }
}

const mapStateToProps = state => ({
  routes: state.routesStore.routes,
  spots: state.spotsStoreV2.spots,
  sectors: state.sectorsStore.sectors,
});

const mapDispatchToProps = dispatch => ({
  loadSpot: spotId => dispatch(loadSpotAction(spotId)),
  reloadSector: sectorId => dispatch(reloadSectorAction(sectorId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsShow));
