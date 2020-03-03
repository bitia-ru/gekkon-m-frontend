import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Content from '@/v1/components/Content/Content';
import Header from '@/v2/components/Header/Header';
import RoutesShowModal from '@/v1/components/RoutesShowModal/RoutesShowModal';
import RoutesEditModal from '@/v1/components/RoutesEditModal/RoutesEditModal';
import FilterBlock from '@/v1/components/FilterBlock/FilterBlock';
import ScrollToTopOnMount from '@/v1/components/ScrollToTopOnMount';
import SpotContext from '@/v1/contexts/SpotContext';
import SectorContext from '@/v1/contexts/SectorContext';
import reloadSector from '@/v1/utils/reloadSector';
import reloadSpot from '@/v1/utils/reloadSpot';
import getCurrentSector from '@/v1/utils/getCurrentSector';
import getCurrentSpotOrSectorData from '@/v1/utils/getCurrentSpotOrSectorData';
import getViewMode from '@/v1/utils/getViewMode';
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
    reloadSpot(this.getSpotId());
    if (sectorId !== 0) {
      reloadSector(sectorId);
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
      reloadSector(id);
      history.push(`${R.replace(/\/sectors\/[0-9]*/, '', match.url)}/sectors/${id}`);
    } else {
      reloadSpot(this.getSpotId());
      history.push(R.replace(/\/sectors\/[0-9]*/, '', match.url));
    }
  };

  openEdit = (routeId) => { this.props.history.push(`${this.props.match.url}/${routeId}/edit`); };

  cancelEdit = () => { this.props.history.goBack(); };

  content = () => {
    const {
      match,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    return (
      <Switch>
        <Route
          path={[`${match.path}/:route_id/edit`, `${match.path}/new`]}
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
              goToProfile={this.openProfileForm}
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
                    data={getCurrentSpotOrSectorData(spotId, sectorId)}
                    changeSectorFilter={this.changeSectorFilter}
                  />
                }
              >
                <Content
                  showFilters={() => this.setState({ showFilters: true })}
                />
              </MainScreen>
            </>
          )}
        />
      </Switch>
    );
  };

  render() {
    const {
      spots,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const spot = spots[spotId];
    const sector = getCurrentSector(sectorId);
    const viewMode = getViewMode(spotId, sectorId);
    return (
      <>
        <ScrollToTopOnMount />
        {
          this.state.showFilters
            ? (
              <FilterBlock
                viewMode={viewMode}
                hideFilters={() => this.setState({ showFilters: false })}
              />
            )
            : ''
        }
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
  spots: state.spotsStore.spots,
  sectors: state.sectorsStore.sectors,
});

export default withRouter(connect(mapStateToProps, null)(SpotsShow));
