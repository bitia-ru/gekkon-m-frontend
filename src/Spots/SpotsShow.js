import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import moment from 'moment/moment';
import { connect } from 'react-redux';
import * as R from 'ramda';
import Cookies from 'js-cookie';
import { ToastContainer } from 'react-toastr';
import { ApiUrl } from '../Environ';
import {
  setSelectedViewMode,
  setSelectedPage,
  setDefaultSelectedPages,
  setSelectedFilter,
  setDefaultSelectedFilters,
  loadFromLocalStorageSelectedFilters,
} from '../actions';
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
import RESULT_FILTERS from '../Constants/ResultFilters';
import CARDS_PER_PAGE from '../Constants/RouteCardTable';
import { DEFAULT_FILTERS } from '../Constants/DefaultFilters';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import { avail, notAvail } from '../Utils';
import SpotContext from '../contexts/SpotContext';
import {
  DEFAULT_SPOT_VIEW_MODE,
  DEFAULT_SECTOR_VIEW_MODE_LIST,
} from '../Constants/ViewModeSwitcher';
import { BACKEND_DATE_FORMAT } from '../Constants/Date';
import SectorContext from '../contexts/SectorContext';
import getArrayFromObject from '../../v1/utils/getArrayFromObject';
import { NUM_OF_DAYS } from '../Constants/Route';
import { loadSector } from '../../v1/stores/sectors/utils';
import { loadSpot } from '../../v1/stores/spots/utils';
import { signIn } from '../../v1/stores/users/utils';
import { logOutUser, loadToken } from '../../v1/stores/users/actions';
import {
  loadRoutes,
  removeLike,
  addLike,
  addAscent,
  updateAscent,
  addComment,
  removeComment,
  addRoute,
  updateRoute,
  removeRoute,
} from '../../v1/stores/routes/utils';
import getState from '../../v1/utils/getState';

class SpotsShow extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      name: '',
      numOfPages: 1,
      editRouteIsWaiting: false,
      showMenu: false,
      showFilters: false,
    });
  }

  componentDidMount() {
    const {
      history,
      signIn: signInProp,
      loadToken: loadTokenProp,
      logOutUser: logOutUserProp,
    } = this.props;
    const sectorId = this.getSectorId();
    history.listen((location, action) => {
      if (action === 'POP') {
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });

    if (Cookies.get('user_session_token') !== undefined) {
      const token = Cookies.get('user_session_token');
      loadTokenProp(token);
      signInProp(token, (currentUser) => {
        this.reloadSpot(currentUser.id);
        if (sectorId !== 0) {
          this.reloadSector(sectorId, currentUser.id);
        }
        this.reloadRoutes();
      });
    } else {
      this.reloadSpot();
      if (sectorId !== 0) {
        this.reloadSector(sectorId);
      }
      this.reloadRoutes();
      logOutUserProp();
    }
    this.props.loadFromLocalStorageSelectedFilters();
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  getSpotId = () => {
    const { match } = this.props;
    return parseInt(match.params.id, 10);
  };

  getSectorId = () => {
    const { match } = this.props;
    return match.params.sector_id ? parseInt(match.params.sector_id, 10) : 0;
  };

  onRouteClick = (id) => {
    const { history, match } = this.props;
    history.push(`${match.url}/routes/${id}`);
  };

  closeRoutesModal = () => {
    const { history } = this.props;
    const sectorId = this.getSectorId();
    if (sectorId === 0) {
      this.reloadSpot();
    } else {
      this.reloadSector(sectorId);
    }
    history.goBack();
    this.reloadRoutes({}, null);
  };

  afterLogOut = () => {
    const sectorId = this.getSectorId();
    this.setState({ ascents: [] });
    this.reloadRoutes();
    if (sectorId === 0) {
      this.reloadSpot(0);
    } else {
      this.reloadSector(sectorId, 0);
    }
    const resultFilters = [];
    const personal = {
      clickable: true,
      id: 'personal',
      selected: this.state.personal,
      text: `Авторские трассы ${this.state.personal ? ' ✓' : ''}`,
      value: 'personal',
    };
    const outdated = {
      clickable: true,
      id: 'outdated',
      selected: this.state.outdated,
      text: `Скрученные ${this.state.outdated ? ' ✓' : ''}`,
      value: 'outdated',
    };

    this.setState({ filters: R.concat(resultFilters, [personal, outdated]) });
  };

  reloadSpot = (userId) => {
    const { user, loadSpot: loadSpotProp } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    let currentUserId;
    if (userId === null || userId === undefined) {
      if (notAvail(user)) {
        currentUserId = 0;
      } else {
        currentUserId = user.id;
      }
    } else {
      currentUserId = userId;
    }
    const params = {};
    if (currentUserId !== 0) {
      params.user_id = currentUserId;
    }
    loadSpotProp(`${ApiUrl}/v1/spots/${spotId}`, params, sectorId);
  };

  reloadSector = (id, userId) => {
    const { user, loadSector: loadSectorProp } = this.props;
    let currentUserId;
    if (userId === null || userId === undefined) {
      if (notAvail(user)) {
        currentUserId = 0;
      } else {
        currentUserId = user.id;
      }
    } else {
      currentUserId = userId;
    }
    const params = {};
    if (currentUserId) {
      params.user_id = currentUserId;
    }
    params.numOfDays = NUM_OF_DAYS;
    loadSectorProp(`${ApiUrl}/v1/sectors/${id}`, params);
  };

  reloadRoutes = (filters = {}, page = 1, userCurrId, viewModeCurr) => {
    const {
      user,
      selectedFilters,
      selectedPages,
      selectedViewModes,
      sectors,
      loadRoutes: loadRoutesProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const currentSectorId = parseInt(
      (filters.sectorId === null || filters.sectorId === undefined)
        ? sectorId
        : filters.sectorId,
      10,
    );
    let viewMode;
    const viewModes = selectedViewModes;
    if (viewModes && viewModes[spotId] && viewModes[spotId][currentSectorId]) {
      viewMode = selectedViewModes[spotId][currentSectorId];
    } else if (currentSectorId === 0) {
      viewMode = DEFAULT_SPOT_VIEW_MODE;
    } else {
      const r = R.find(s => s.id === currentSectorId, sectors);
      if (r && r.diagram) {
        [viewMode] = DEFAULT_SECTOR_VIEW_MODE_LIST;
      } else {
        viewMode = R.last(DEFAULT_SECTOR_VIEW_MODE_LIST);
      }
    }
    const currentViewMode = viewModeCurr || viewMode;
    const currentCategoryFrom = (
      (filters.categoryFrom === null || filters.categoryFrom === undefined)
        ? selectedFilters[spotId][currentSectorId].categoryFrom
        : filters.categoryFrom
    );
    const currentCategoryTo = (
      (filters.categoryTo === null || filters.categoryTo === undefined)
        ? selectedFilters[spotId][currentSectorId].categoryTo
        : filters.categoryTo
    );
    const currentName = (
      (filters.name === null || filters.name === undefined)
        ? this.state.name
        : filters.name
    );
    const currentPeriod = (
      (filters.period === null || filters.period === undefined)
        ? selectedFilters[spotId][currentSectorId].period
        : filters.period
    );
    let currentDate = (
      (filters.date === null || filters.date === undefined)
        ? selectedFilters[spotId][currentSectorId].date
        : filters.date
    );
    currentDate = currentDate || DEFAULT_FILTERS.date;
    const currentResult = (
      (filters.result === null || filters.result === undefined)
        ? selectedFilters[spotId][currentSectorId].result
        : filters.result
    );
    const currentPersonal = (
      (filters.personal === null || filters.personal === undefined)
        ? selectedFilters[spotId][currentSectorId].personal
        : filters.personal
    );
    const currentOutdated = (
      (filters.outdated === null || filters.outdated === undefined)
        ? selectedFilters[spotId][currentSectorId].outdated
        : filters.outdated
    );
    const currentLiked = (
      (filters.liked === null || filters.liked === undefined)
        ? selectedFilters[this.state.spotId][currentSectorId].liked
        : filters.liked
    );
    const currentPage = (
      (page === null || page === undefined)
        ? selectedPages[spotId][currentSectorId]
        : page
    );
    const params = {
      filters: {
        category: [[currentCategoryFrom], [currentCategoryTo]],
        personal: currentPersonal,
        outdated: currentViewMode === 'scheme' ? true : currentOutdated,
      },
    };
    if (userCurrId || (user && avail(user))) {
      params.filters.result = (currentResult.length === 0 ? [null] : currentResult);
      if (currentLiked) {
        params.filters.liked_by = 'self';
      }
    }
    if (currentName !== '') {
      params.filters.name = { like: currentName };
    }
    if (currentPeriod !== 0) {
      const d = new Date();
      const dFrom = new Date(d);
      switch (currentPeriod) {
      case 1:
        dFrom.setDate(d.getDate() - 1);
        break;
      case 2:
        dFrom.setDate(d.getDate() - 7);
        break;
      case 3:
        dFrom.setMonth(d.getMonth() - 1);
        break;
      case 4:
        dFrom.setYear(d.getFullYear() - 1);
        break;
      default:
        break;
      }
      params.filters.installed_at = [[dFrom], [d]];
    }
    if (currentViewMode === 'scheme') {
      params.filters.installed_at = [[null], [moment(currentDate).format(BACKEND_DATE_FORMAT)]];
      params.filters.installed_until = [
        [moment(currentDate).add(1, 'days').format(BACKEND_DATE_FORMAT)],
        [null],
      ];
    } else {
      params.limit = CARDS_PER_PAGE;
      params.offset = (currentPage - 1) * CARDS_PER_PAGE;
    }
    if (this.props.token) params.token = this.props.token;
    if (currentSectorId === 0) {
      loadRoutesProp(`${ApiUrl}/v1/spots/${spotId}/routes`, params);
    } else {
      loadRoutesProp(`${ApiUrl}/v1/sectors/${currentSectorId}/routes`, params);
    }
  };

  changeSectorFilter = (id) => {
    const { user, history, match } = this.props;
    if (id !== 0) {
      this.reloadSector(id);
      history.push(`${R.replace(/\/sectors\/[0-9]*/, '', match.url)}/sectors/${id}`);
    } else {
      this.reloadSpot();
      history.push(R.replace(/\/sectors\/[0-9]*/, '', match.url));
    }
    this.reloadRoutes(
      { sectorId: id },
      null,
      user ? user.id : user,
    );
  };

  changeNameFilter = (searchString) => {
    this.setState({ name: searchString });
    this.reloadRoutes({ name: searchString });
  };

  changePage = (page) => {
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    this.props.setSelectedPage(spotId, sectorId, page);
    this.reloadRoutes({}, page);
  };

  changeAllFilters = (categoryFrom, categoryTo, period, date, filters) => {
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    if (categoryFrom !== null) {
      this.props.setSelectedFilter(spotId, sectorId, 'categoryFrom', categoryFrom);
    }
    if (categoryTo !== null) {
      this.props.setSelectedFilter(spotId, sectorId, 'categoryTo', categoryTo);
    }
    this.props.setSelectedFilter(spotId, sectorId, 'period', period);
    this.props.setSelectedFilter(spotId, sectorId, 'date', date);
    let filter = R.find(R.propEq('id', 'personal'))(filters);
    const personal = filter.selected;
    filter = R.find(R.propEq('id', 'outdated'))(filters);
    let outdated = null;
    if (filter) {
      outdated = filter.selected;
      this.props.setSelectedFilter(spotId, sectorId, 'outdated', outdated);
    }
    this.props.setSelectedFilter(spotId, sectorId, 'personal', personal);
    const resultFilters = R.filter(
      e => R.contains(e.id, R.map(f => f.id, RESULT_FILTERS)),
      filters,
    );
    if (this.props.user) {
      filter = R.find(R.propEq('id', 'liked'))(filters);
      const liked = filter.selected;
      this.props.setSelectedFilter(spotId, sectorId, 'liked', liked);
      const result = R.map(e => e.value, R.filter(e => e.selected, resultFilters));
      this.props.setSelectedFilter(spotId, sectorId, 'result', result);
      this.reloadRoutes({
        categoryFrom,
        categoryTo,
        period,
        date: date || DEFAULT_FILTERS.date,
        personal,
        outdated,
        liked,
        result,
      });
    } else {
      this.reloadRoutes({categoryFrom,
        categoryTo,
        period,
        date: date || DEFAULT_FILTERS.date,
        personal,
        outdated,
      });
    }
    const filtersCopy = R.clone(this.props.selectedFilters[spotId][sectorId].filters);
    R.forEach(
      (f) => {
        const index = R.findIndex(R.propEq('id', f.id))(filtersCopy);
        filtersCopy[index] = f;
      },
      filters,
    );
    this.props.setSelectedFilter(
      spotId,
      sectorId,
      'filters',
      filtersCopy,
    );
    this.props.setSelectedPage(spotId, sectorId, 1);
  };

  afterSubmitLogInForm = (userId) => {
    const sectorId = this.getSectorId();
    this.reloadRoutes();
    if (sectorId === 0) {
      this.reloadSpot(userId);
    } else {
      this.reloadSector(sectorId, userId);
    }
  };

  afterSubmitSignUpForm = (userId) => {
    const sectorId = this.getSectorId();
    this.reloadRoutes();
    if (sectorId === 0) {
      this.reloadSpot(userId);
    } else {
      this.reloadSector(sectorId, userId);
    }
  };

  removeRoute = (routeId) => {
    const { removeRoute: removeRouteProp } = this.props;
    if (window.confirm('Удалить трассу?')) {
      removeRouteProp(
        `${ApiUrl}/v1/routes/${routeId}`,
        () => {
          this.reloadRoutes();
          this.closeRoutesModal();
        },
      );
    }
  };

  removeComment = (routeId, comment) => {
    const { removeComment: removeCommentProp } = this.props;
    if (!window.confirm('Удалить комментарий?')) {
      return;
    }
    removeCommentProp(`${ApiUrl}/v1/route_comments/${comment.id}`);
  };

  saveComment = (routeId, params, afterSuccess) => {
    const { addComment: addCommentProp } = this.props;
    addCommentProp(params, afterSuccess);
  };

  onLikeChange = (routeId, afterChange) => {
    const {
      user,
      routes,
      removeLike: removeLikeProp,
      addLike: addLikeProp,
    } = this.props;
    const route = routes[routeId];
    const like = R.find(R.propEq('user_id', user.id))(getArrayFromObject(route.likes));
    if (like) {
      removeLikeProp(`${ApiUrl}/v1/likes/${like.id}`, afterChange);
    } else {
      const params = {
        like: {
          user_id: user.id,
          route_id: routeId,
        },
      };
      addLikeProp(params, afterChange);
    }
  };

  changeAscentResult = (routeId) => {
    const {
      user,
      routes,
      addAscent: addAscentProp,
      updateAscent: updateAscentProp,
    } = this.props;
    const route = routes[routeId];
    const ascent = R.find(R.propEq('user_id', user.id))(getArrayFromObject(route.ascents));
    if (ascent) {
      let result;
      if (ascent.result === 'red_point') {
        result = 'flash';
      } else if (ascent.result === 'flash') {
        result = 'unsuccessful';
      } else {
        result = 'red_point';
      }
      const params = { ascent: { result } };
      updateAscentProp(`${ApiUrl}/v1/ascents/${ascent.id}`, params);
    } else {
      const result = 'red_point';
      const params = {
        ascent: {
          result,
          user_id: user.id,
          route_id: routeId,
        },
      };
      addAscentProp(params);
    }
  };

  createRoute = (params) => {
    const {
      history,
      match,
      addRoute: addRouteProp,
    } = this.props;
    this.setState({ editRouteIsWaiting: true });
    addRouteProp(
      params,
      response => history.replace(
        `${match.url}/${response.data.payload.id}`,
      ),
      () => this.setState({ editRouteIsWaiting: false }),
    );
  };

  updateRoute = (routeId, params) => {
    const {
      history,
      updateRoute: updateRouteProp,
    } = this.props;
    this.setState({ editRouteIsWaiting: true });
    updateRouteProp(
      `${ApiUrl}/v1/routes/${routeId}`,
      params,
      () => history.goBack(),
      () => this.setState({ editRouteIsWaiting: false }),
    );
  };

  openEdit = (routeId) => {
    const { history, match } = this.props;
    history.push(`${match.url}/${routeId}/edit`);
  };

  cancelEdit = (routeId) => {
    this.props.history.goBack();
  };

  goToNew = () => {
    const { history, match } = this.props;
    history.push(`${match.url}/routes/new`);
  };

  changeViewMode = (viewMode) => {
    const {
      user,
      selectedFilters,
      setSelectedFilter: setSelectedFilterProp,
      setSelectedViewMode: setSelectedViewModeProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    let date = '';
    setSelectedViewModeProp(spotId, sectorId, viewMode);
    if (viewMode === 'scheme') {
      date = (
        (selectedFilters && selectedFilters[spotId])
          ? selectedFilters[spotId][sectorId].date
          : DEFAULT_FILTERS.date
      );
      const {spotId, sectorId} = this.state;
      setSelectedFilterProp(spotId, sectorId, 'date', date);
    }
    this.reloadRoutes({ date }, null, user.id, viewMode);
  };

  submitNoticeForm = (routeId, msg) => {
    const { user, selectedFilters } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    Sentry.withScope((scope) => {
      scope.setExtra('user_id', user.id);
      scope.setExtra('route_id', routeId);
      scope.setExtra(
        'filters',
        (
          (selectedFilters && selectedFilters[spotId])
            ? selectedFilters[spotId][sectorId]
            : undefined
        ),
      );
      scope.setExtra('url', window.location.href);
      if (user.login) {
        scope.setExtra('user_login', user.login);
      } else if (user.email) {
        scope.setExtra('user_email', user.email);
      } else {
        scope.setExtra('user_phone', user.phone);
      }
      Sentry.captureException(msg);
    });
  };

  content = () => {
    const {
      user, sectors, selectedViewModes, match, loading, spots,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const spot = spots[spotId];
    let numOfRoutes;
    let data;
    const sector = sectors[sectorId];
    if (sectorId === 0) {
      if (spot) {
        data = spot;
      } else {
        data = {};
      }
      numOfRoutes = data.infoData ? data.infoData[1].count : 0;
    } else if (sector && sector.id === sectorId) {
      data = sector;
      numOfRoutes = data.infoData ? data.infoData[0].count : 0;
    } else {
      data = {};
      numOfRoutes = 0;
    }
    let viewMode;
    if (selectedViewModes && selectedViewModes[spotId] && selectedViewModes[spotId][sectorId]) {
      viewMode = selectedViewModes[spotId][sectorId];
    } else if (sectorId === 0) {
      viewMode = DEFAULT_SPOT_VIEW_MODE;
    } else {
      const r = R.find(s => s.id === sectorId, sectors);
      if (r && r.diagram) {
        [viewMode] = DEFAULT_SECTOR_VIEW_MODE_LIST;
      } else {
        viewMode = R.last(DEFAULT_SECTOR_VIEW_MODE_LIST);
      }
    }
    const routes = R.pathOr([], [spotId, sectorId], this.props.routes);
    return (
      <Switch>
        <Route
          path={[`${match.path}/:route_id/edit`, `${match.path}/new`]}
          render={() => (
            <RoutesEditModal
              onClose={this.closeRoutesModal}
              cancel={this.cancelEdit}
              createRoute={this.createRoute}
              updateRoute={this.updateRoute}
              isWaiting={this.state.editRouteIsWaiting}
            />
          )}
        />
        <Route
          path={`${match.path}/:route_id`}
          render={() => (
            <RoutesShowModal
              onClose={this.closeRoutesModal}
              openEdit={this.openEdit}
              removeRoute={this.removeRoute}
              goToProfile={this.openProfileForm}
              removeComment={this.removeComment}
              saveComment={this.saveComment}
              onLikeChange={this.onLikeChange}
              changeAscentResult={this.changeAscentResult}
              submitNoticeForm={this.submitNoticeForm}
            />
          )}
        />
        <Route
          path={match.path}
          render={() => (
            <>
              <div className="sticky-bar">
                <Header
                  data={data}
                  changeSectorFilter={this.changeSectorFilter}
                  showMenu={() => this.setState({ showMenu: true })}
                />
                {
                  this.state.showMenu
                    ? (
                      <MainMenu
                        user={user}
                        hideMenu={() => this.setState({ showMenu: false })}
                        changeNameFilter={this.changeNameFilter}
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
                  user={user}
                  addRoute={this.goToNew}
                  page={
                    (this.props.selectedPages && this.props.selectedPages[spotId])
                      ? this.props.selectedPages[spotId][sectorId]
                      : 1
                  }
                  numOfPages={this.state.numOfPages}
                  onRouteClick={this.onRouteClick}
                  changePage={this.changePage}
                  numOfRoutes={viewMode === 'scheme' ? routes.length : numOfRoutes}
                  changeViewMode={this.changeViewMode}
                  viewMode={viewMode}
                  withScheme={sectorId !== 0}
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
      user, selectedViewModes, sectors, spots,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const spot = spots[spotId];
    const sector = sectorId !== 0 ? sectors[sectorId] : undefined;
    let viewMode;
    if (selectedViewModes && selectedViewModes[spotId] && selectedViewModes[spotId][sectorId]) {
      viewMode = selectedViewModes[spotId][sectorId];
    } else if (sectorId === 0) {
      viewMode = DEFAULT_SPOT_VIEW_MODE;
    } else {
      const r = R.find(s => s.id === sectorId, sectors);
      if (r && r.diagram) {
        [viewMode] = DEFAULT_SECTOR_VIEW_MODE_LIST;
      } else {
        viewMode = R.last(DEFAULT_SECTOR_VIEW_MODE_LIST);
      }
    }
    const period = (
      (this.props.selectedFilters && this.props.selectedFilters[spotId])
        ? this.props.selectedFilters[spotId][sectorId].period
        : DEFAULT_FILTERS.period
    );
    let date = (
      (this.props.selectedFilters && this.props.selectedFilters[spotId])
        ? this.props.selectedFilters[spotId][sectorId].date
        : DEFAULT_FILTERS.date
    );
    date = date || DEFAULT_FILTERS.date;
    const filters = (
      (this.props.selectedFilters && this.props.selectedFilters[spotId])
        ? this.props.selectedFilters[spotId][sectorId].filters
        : DEFAULT_FILTERS.filters
    );
    const categoryFrom = (
      (this.props.selectedFilters && this.props.selectedFilters[spotId])
        ? this.props.selectedFilters[spotId][sectorId].categoryFrom
        : DEFAULT_FILTERS.categoryFrom
    );
    const categoryTo = (
      (this.props.selectedFilters && this.props.selectedFilters[spotId])
        ? this.props.selectedFilters[spotId][sectorId].categoryTo
        : DEFAULT_FILTERS.categoryTo
    );
    return (
      <>
        <ScrollToTopOnMount />
        {
          this.state.showFilters
            ? (
              <FilterBlock
                hideFilters={() => this.setState({ showFilters: false })}
                changeAllFilters={this.changeAllFilters}
                categoryFrom={categoryFrom}
                categoryTo={categoryTo}
                period={period}
                date={date}
                viewMode={viewMode}
                filters={
                  avail(user)
                    ? filters
                    : (
                      R.filter(
                        e => !R.contains(
                          e.id, R.append('liked', R.map(f => f.id, RESULT_FILTERS)),
                        ),
                        filters,
                      )
                    )
                }
              />
            )
            : ''
        }
        {
          this.state.signUpFormVisible
            ? (
              <SignUpForm
                onFormSubmit={this.submitSignUpForm}
                closeForm={this.closeSignUpForm}
                enterWithVk={this.enterWithVk}
                isWaiting={this.state.signUpIsWaiting}
                formErrors={this.state.signUpFormErrors}
                resetErrors={this.signUpResetErrors}
              />
            )
            : ''
        }
        {
          this.state.logInFormVisible
            ? (
              <LogInForm
                onFormSubmit={this.submitLogInForm}
                closeForm={this.closeLogInForm}
                enterWithVk={this.enterWithVk}
                isWaiting={this.state.logInIsWaiting}
                resetPassword={this.resetPassword}
                formErrors={this.state.logInFormErrors}
                resetErrors={this.logInResetErrors}
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
  selectedViewModes: state.selectedViewModes,
  selectedPages: state.selectedPages,
  selectedFilters: state.selectedFilters,
  spots: state.spotsStore.spots,
  sectors: state.sectorsStore.sectors,
  user: state.usersStore.users[state.usersStore.currentUserId],
  token: state.usersStore.currentUserToken,
  loading: getState(state),
});

const mapDispatchToProps = dispatch => ({
  setSelectedViewMode: (spotId, sectorId, viewMode) => (
    dispatch(setSelectedViewMode(spotId, sectorId, viewMode))
  ),
  setSelectedPage: (spotId, sectorId, page) => dispatch(setSelectedPage(spotId, sectorId, page)),
  setDefaultSelectedPages: (spotId, sectorIds) => dispatch(
    setDefaultSelectedPages(spotId, sectorIds),
  ),
  setSelectedFilter: (spotId, sectorId, filterName, filterValue) => dispatch(
    setSelectedFilter(spotId, sectorId, filterName, filterValue),
  ),
  setDefaultSelectedFilters: (spotId, sectorIds) => dispatch(
    setDefaultSelectedFilters(spotId, sectorIds),
  ),
  loadFromLocalStorageSelectedFilters: () => dispatch(loadFromLocalStorageSelectedFilters()),
  loadToken: token => dispatch(loadToken(token)),
  signIn: (token, afterSignIn) => dispatch(signIn(token, afterSignIn)),
  logOutUser: () => dispatch(logOutUser()),
  loadSector: (url, params) => dispatch(loadSector(url, params)),
  loadSpot: (url, params, currentSectorId, afterLoad) => dispatch(
    loadSpot(url, params, currentSectorId, afterLoad),
  ),
  loadRoutes: (url, params) => dispatch(loadRoutes(url, params)),
  removeLike: (url, afterAll) => dispatch(removeLike(url, afterAll)),
  addLike: (params, afterAll) => dispatch(addLike(params, afterAll)),
  addAscent: params => dispatch(addAscent(params)),
  updateAscent: (url, params) => dispatch(updateAscent(url, params)),
  addComment: (params, afterSuccess) => dispatch(addComment(params, afterSuccess)),
  removeComment: url => dispatch(removeComment(url)),
  addRoute: (params, afterSuccess, afterAll) => dispatch(addRoute(params, afterSuccess, afterAll)),
  removeRoute: (url, afterSuccess) => dispatch(removeRoute(url, afterSuccess)),
  updateRoute: (url, params, afterSuccess, afterAll) => dispatch(
    updateRoute(url, params, afterSuccess, afterAll),
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsShow));
