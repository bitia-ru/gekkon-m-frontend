import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Content from '../Content/Content';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import MainMenu from '../MainMenu/MainMenu';
import RoutesShowModal from '../RoutesShowModal/RoutesShowModal';
import RoutesEditModal from '../RoutesEditModal/RoutesEditModal';
import FilterBlock from '../FilterBlock/FilterBlock';
import SignUpForm from '../SignUpForm/SignUpForm';
import LogInForm from '../LogInForm/LogInForm';
import Profile from '../Profile/Profile';
import BaseComponent from '../BaseComponent';
import StickyBar from '../StickyBar/StickyBar';
import { avail } from '../../utils';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import SpotContext from '../../contexts/SpotContext';
import SectorContext from '../../contexts/SectorContext';
import reloadSector from '../../utils/reloadSector';
import reloadSpot from '../../utils/reloadSpot';
import getState from '../../utils/getState';
import getCurrentSector from '../../utils/getCurrentSector';
import getCurrentSpotOrSectorData from '../../utils/getCurrentSpotOrSectorData';
import getViewMode from '../../utils/getViewMode';

class SpotsShow extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      showMenu: false,
      showFilters: false,
    });
  }

  componentDidMount() {
    const {
      history,
    } = this.props;
    const sectorId = this.getSectorId();
    history.listen((location, action) => {
      if (action === 'POP') {
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });

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
      user, match, loading,
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
          path={`${match.path}/:route_id`}
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
              <div className="sticky-bar">
                <Header
                  data={getCurrentSpotOrSectorData(spotId, sectorId)}
                  changeSectorFilter={this.changeSectorFilter}
                  showMenu={() => this.setState({ showMenu: true })}
                />
                {
                  this.state.showMenu
                    ? (
                      <MainMenu
                        user={user}
                        hideMenu={() => this.setState({ showMenu: false })}
                        logIn={this.logIn}
                        signUp={this.signUp}
                        logOut={this.logOut}
                        openProfile={this.openProfileForm}
                        enterWithVk={this.enterWithVk}
                      />
                    )
                    : ''
                }
                <Content
                  showFilters={() => this.setState({ showFilters: true })}
                />
                <StickyBar loading={loading} />
              </div>
              <Footer
                user={user}
                logIn={this.logIn}
                signUp={this.signUp}
                logOut={this.logOut}
              />
            </>
          )}
        />
      </Switch>
    );
  };

  render() {
    const {
      user, spots,
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
        {
          this.state.signUpFormVisible
            ? (
              <SignUpForm
                closeForm={this.closeSignUpForm}
                enterWithVk={this.enterWithVk}
              />
            )
            : ''
        }
        {
          this.state.logInFormVisible
            ? (
              <LogInForm
                closeForm={this.closeLogInForm}
                enterWithVk={this.enterWithVk}
                resetPassword={this.resetPassword}
              />
            )
            : ''
        }
        {
          (avail(user) && this.state.profileFormVisible) && (
            <Profile
              user={user}
              onFormSubmit={this.submitProfileForm}
              removeVk={this.removeVk}
              enterWithVk={this.enterWithVk}
              isWaiting={this.state.profileIsWaiting}
              closeForm={this.closeProfileForm}
              formErrors={this.state.profileFormErrors}
              resetErrors={this.profileResetErrors}
            />
          )
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
  user: state.usersStore.users[state.usersStore.currentUserId],
  loading: getState(state),
});

export default withRouter(connect(mapStateToProps, null)(SpotsShow));
