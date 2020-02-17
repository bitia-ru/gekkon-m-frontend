import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { ToastContainer } from 'react-toastr';
import Content from '@/v1/components/Content/Content';
import Header from '@/v1/components/Header/Header';
import Footer from '@/v1/components/Footer/Footer';
import MainMenu from '@/v1/components/MainMenu/MainMenu';
import RoutesShowModal from '@/v1/components/RoutesShowModal/RoutesShowModal';
import RoutesEditModal from '@/v1/components/RoutesEditModal/RoutesEditModal';
import FilterBlock from '@/v1/components/FilterBlock/FilterBlock';
import SignUpForm from '@/v1/components/SignUpForm/SignUpForm';
import LogInForm from '@/v1/components/LogInForm/LogInForm';
import Profile from '@/v1/components/Profile/Profile';
import BaseComponent from '@/v1/components/BaseComponent';
import StickyBar from '@/v1/components/StickyBar/StickyBar';
import { avail } from '@/v1/utils';
import ScrollToTopOnMount from '@/v1/components/ScrollToTopOnMount';
import SpotContext from '@/v1/contexts/SpotContext';
import SectorContext from '@/v1/contexts/SectorContext';
import reloadSector from '@/v1/utils/reloadSector';
import reloadSpot from '@/v1/utils/reloadSpot';
import getState from '@/v1/utils/getState';
import getCurrentSector from '@/v1/utils/getCurrentSector';
import getCurrentSpotOrSectorData from '@/v1/utils/getCurrentSpotOrSectorData';
import getViewMode from '@/v1/utils/getViewMode';

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
              showToastr={this.showToastr}
              enterWithVk={this.enterWithVk}
              isWaiting={this.state.profileIsWaiting}
              closeForm={this.closeProfileForm}
              formErrors={this.state.profileFormErrors}
              resetErrors={this.profileResetErrors}
            />
          )
        }
        <ToastContainer
          ref={(ref) => { this.container = ref; }}
          onClick={() => this.container.clear()}
          className="toast-top-right"
        />
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
