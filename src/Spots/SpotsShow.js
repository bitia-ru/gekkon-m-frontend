import React from 'react';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import moment from 'moment/moment';
import Qs from 'qs';
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
  loadRoutes,
  loadSectors,
  loadRouteMarkColors,
  saveUser,
  saveToken,
  removeToken,
  increaseNumOfActiveRequests,
  decreaseNumOfActiveRequests,
  updateRoute,
  addRoute,
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
import ResetPasswordForm from '../ResetPasswordForm/ResetPasswordForm';
import Profile from '../Profile/Profile';
import Authorization from '../Authorization';
import StickyBar from '../StickyBar/StickyBar';
import RESULT_FILTERS from '../Constants/ResultFilters';
import CARDS_PER_PAGE from '../Constants/RouteCardTable';
import { DEFAULT_FILTERS } from '../Constants/DefaultFilters';
import { NUM_OF_DAYS } from '../Constants/Route';
import ScrollToTopOnMount from '../ScrollToTopOnMount';
import { avail, notAvail } from '../Utils';
import { userStateToUser } from '../Utils/Workarounds';
import numToStr from '../Constants/NumToStr';
import {
  DEFAULT_SPOT_VIEW_MODE,
  DEFAULT_SECTOR_VIEW_MODE_LIST,
} from '../Constants/ViewModeSwitcher';
import { BACKEND_DATE_FORMAT } from '../Constants/Date';

Axios.interceptors.request.use((config) => {
  const configCopy = R.clone(config);
  configCopy.paramsSerializer = params => Qs.stringify(params, { arrayFormat: 'brackets' });
  return configCopy;
});

class SpotsShow extends Authorization {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      spotId: parseInt(this.props.match.params.id, 10),
      sectorId: (
        this.props.match.params.sector_id
          ? parseInt(this.props.match.params.sector_id, 10)
          : 0
      ),
      sector: {},
      name: '',
      numOfPages: 1,
      perPage: CARDS_PER_PAGE,
      spot: {},
      infoData: undefined,
      routesModalVisible: false,
      currentShown: {},
      editMode: false,
      ascents: [],
      ctrlPressed: false,
      comments: [],
      numOfComments: 0,
      numOfLikes: undefined,
      isLiked: false,
      likeId: 0,
      likeBtnIsBusy: false,
      ascent: null,
      numOfRedpoints: undefined,
      numOfFlash: undefined,
      users: [],
      editRouteIsWaiting: false,
      showMenu: false,
      showFilters: false,
    });
    this.loadingRouteId = this.props.match.params.route_id;
    this.loadEditMode = false;
  }

  componentDidMount() {
    const {
      history,
      user,
      saveToken: saveTokenProp,
      saveUser: saveUserProp,
    } = this.props;
    history.listen((location, action) => {
      if (action === 'POP') {
        const data = location.pathname.split('/');
        if (data.length > 3 && data[3] === 'sectors') {
          const sectorId = parseInt(data[4], 10);
          if (data.length > 5 && data[5] === 'routes') {
            if (data[6] === 'new') {
              if (avail(user.id) && (user.role === 'admin' || user.role === 'creator')) {
                this.addRoute();
              } else {
                window.location = '/';
              }
            } else {
              const routeIndex = 6;
              this.loadingRouteId = data[routeIndex];
              if (data.length > 7 && data[7] === 'edit') {
                if (avail(user.id) && (user.role === 'admin' || user.role === 'creator')) {
                  this.loadUsers();
                  this.loadEditMode = true;
                  this.setState({ sectorId });
                } else {
                  window.location = '/';
                }
              } else {
                this.loadEditMode = false;
                this.setState({ sectorId });
              }
            }
          } else {
            this.setState({
              sectorId,
              profileFormVisible: (location.hash === '#profile'),
              routesModalVisible: false,
            });
          }
          this.reloadSector(sectorId);
          this.reloadSectors(sectorId);
          this.reloadUserAscents();
        } else {
          if (data.length > 3 && data[3] === 'routes') {
            if (data[4] === 'new') {
              if (avail(user.id) && (user.role === 'admin' || user.role === 'creator')) {
                this.addRoute();
              } else {
                window.location = '/';
              }
            } else {
              const routeIndex = 4;
              this.loadingRouteId = data[routeIndex];
              if (data.length > 5 && data[5] === 'edit') {
                if (avail(user.id) && (user.role === 'admin' || user.role === 'creator')) {
                  this.loadUsers();
                  this.loadEditMode = true;
                  this.setState({ sectorId: 0 });
                } else {
                  window.location = '/';
                }
              } else {
                this.loadEditMode = false;
                this.setState({ sectorId: 0 });
              }
            }
          } else {
            this.setState({
              sectorId: 0,
              profileFormVisible: (location.hash === '#profile'),
              routesModalVisible: false,
            });
          }
          this.reloadSpot();
          this.reloadSectors(0);
          this.reloadUserAscents();
        }
      }
    });

    if (Cookies.get('user_session_token') !== undefined) {
      const token = Cookies.get('user_session_token');
      saveTokenProp(token);
      this.signIn(token, (currentUser) => {
        this.reloadUserAscents(currentUser.id);
        const data = window.location.pathname.split('/');
        if (currentUser.role === 'admin' || currentUser.role === 'creator') {
          if (R.find(e => e === 'new', data)) {
            this.addRoute();
          }
          if (R.find(e => e === 'edit', data)) {
            this.loadUsers();
            this.loadEditMode = true;
            this.loadRoute(data[3] === 'routes' ? data[4] : data[6], this.openModal);
          }
        } else if (R.find(e => (e === 'new' || e === 'edit'), data)) {
          window.location = '/';
        }
        this.reloadSectors(this.state.sectorId, currentUser);
        if (this.state.sectorId === 0) {
          this.reloadSpot(currentUser.id);
        } else {
          this.reloadSector(this.state.sectorId, currentUser.id);
        }
      });
    } else {
      this.reloadUserAscents();
      this.reloadSectors(this.state.sectorId);
      if (this.state.sectorId === 0) {
        this.reloadSpot();
      } else {
        this.reloadSector(this.state.sectorId);
      }
      saveUserProp({ id: null });
    }
    this.props.loadFromLocalStorageSelectedFilters();
    if (this.props.routeMarkColors.length === 0) {
      this.loadRouteMarkColors();
    }
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  onKeyDown = (event) => {
    if (event.key === 'Control') {
      this.setState({ ctrlPressed: true });
    }
  };

  onKeyUp = (event) => {
    if (event.key === 'Control') {
      this.setState({ ctrlPressed: false });
    }
  };

  reloadUserAscents = (userId) => {
    const { user } = this.props;
    const id = (userId || (avail(user.id) ? user.id : null));
    if (!id) {
      this.setState({ ascents: [] });
      return;
    }
    this.props.increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/users/${id}/ascents`)
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        this.setState({ ascents: response.data.payload });
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  onRouteClick = (id) => {
    const { spotId, sectorId } = this.state;
    if (sectorId === 0) {
      this.props.history.push(`/spots/${spotId}/routes/${id}`);
    } else {
      this.props.history.push(
        `/spots/${spotId}/sectors/${sectorId}/routes/${id}`,
      );
    }
    this.reloadComments(id);
    this.reloadLikes(id);
    this.reloadAscents(id);
    const route = R.find(
      R.propEq('id', id),
      R.pathOr({}, [spotId, sectorId], this.props.routes),
    );
    this.loadRoute(id, route ? null : this.openModal);
    this.setState({
      editMode: false,
      currentShown: route || {},
      routesModalVisible: route,
    });
  };

  openModal = () => {
    this.setState({ routesModalVisible: true });
  };

  loadRoute = (id, afterLoadRoute) => {
    this.props.increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/routes/${id}`)
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        this.setState({
          currentShown: response.data.payload,
        });
        if (afterLoadRoute) {
          afterLoadRoute();
        }
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  closeRoutesModal = () => {
    this.setState({
      routesModalVisible: false,
      comments: [],
      numOfComments: 0,
      numOfLikes: undefined,
      isLiked: false,
      likeId: 0,
      likeBtnIsBusy: false,
      ascent: null,
      numOfRedpoints: undefined,
      numOfFlash: undefined,
    });
    if (this.state.sectorId === 0) {
      this.reloadSpot();
    } else {
      this.reloadSector(this.state.sectorId);
    }
    this.props.history.goBack();
    this.reloadUserAscents();
    this.reloadRoutes({}, null);
  };

  afterLogOut = () => {
    this.setState({ ascents: [] });
    this.reloadRoutes();
    if (this.state.sectorId === 0) {
      this.reloadSpot(0);
    } else {
      this.reloadSector(this.state.sectorId, 0);
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
    const { user } = this.props;
    let currentUserId;
    if (userId === null || userId === undefined) {
      if (notAvail(user.id)) {
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
    this.props.increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/spots/${this.state.spotId}`, { params })
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        let infoData = [
          {
            count: response.data.metadata.num_of_sectors,
            label: numToStr(response.data.metadata.num_of_sectors, ['Зал', 'Зала', 'Залов']),
          },
          {
            count: response.data.metadata.num_of_routes,
            label: numToStr(response.data.metadata.num_of_routes, ['Трасса', 'Трассы', 'Трасс']),
          },
        ];
        if (currentUserId !== 0) {
          infoData = R.append({
            count: response.data.metadata.num_of_unfulfilled,
            label: numToStr(
              response.data.metadata.num_of_unfulfilled,
              ['Невыполненная трасса', 'Невыполненные трассы', 'Невыполненных трасс'],
            ),
          }, infoData);
        }
        this.setState({
          spot: response.data.payload,
          infoData,
        });
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  reloadSector = (id, userId) => {
    const { user } = this.props;
    let currentUserId;
    if (userId === null || userId === undefined) {
      if (notAvail(user.id)) {
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
    params.numOfDays = NUM_OF_DAYS;
    this.props.increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/sectors/${id}`, { params })
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        let infoData = [
          {
            count: response.data.metadata.num_of_routes,
            label: numToStr(response.data.metadata.num_of_routes, ['Трасса', 'Трассы', 'Трасс']),
          },
          {
            count: response.data.metadata.num_of_new_routes,
            label: numToStr(
              response.data.metadata.num_of_new_routes,
              ['Новая трасса', 'Новые трассы', 'Новых трасс'],
            ),
          },
        ];
        if (currentUserId !== 0) {
          infoData = R.append({
            count: response.data.metadata.num_of_unfulfilled,
            label: numToStr(
              response.data.metadata.num_of_unfulfilled,
              ['Невыполненная трасса', 'Невыполненные трассы', 'Невыполненных трасс'],
            ),
          }, infoData);
        }
        this.setState({
          sector: response.data.payload,
          infoData,
        });
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  reloadSectors = (currentSectorId, user) => {
    const { selectedFilters, selectedPages } = this.props;
    this.props.increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/spots/${this.state.spotId}/sectors`)
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        this.props.loadSectors(response.data.payload);
        if (!selectedFilters || selectedFilters[this.state.spotId] === undefined) {
          this.props.setDefaultSelectedFilters(
            this.state.spotId,
            R.map(sector => sector.id, response.data.payload),
          );
        }
        if (!selectedPages || selectedPages[this.state.spotId] === undefined) {
          this.props.setDefaultSelectedPages(
            this.state.spotId,
            R.map(sector => sector.id, response.data.payload),
          );
          const routeFilters = localStorage.getItem('routeFilters');
          let selectedFiltersCurr = selectedFilters;
          if (routeFilters !== undefined) {
            selectedFiltersCurr = JSON.parse(routeFilters);
          }
          const filters = R.merge(
            { sectorId: currentSectorId },
            (
              selectedFiltersCurr[this.state.spotId] === undefined
                ? DEFAULT_FILTERS
                : selectedFiltersCurr[this.state.spotId][currentSectorId]
            ),
          );
          this.reloadRoutes(filters, 1, user);
        } else {
          this.reloadRoutes({ sectorId: currentSectorId }, null, user);
        }
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  loadRouteMarkColors = () => {
    this.props.increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/route_mark_colors`)
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        this.props.loadRouteMarkColors(response.data.payload);
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  reloadRoutes = (filters = {}, page = 1, userCurr, viewModeCurr) => {
    const {
      user,
      selectedFilters,
      selectedPages,
      selectedViewModes,
      sectors,
    } = this.props;
    const { spotId, perPage } = this.state;
    const currentSectorId = parseInt(
      (filters.sectorId === null || filters.sectorId === undefined)
        ? this.state.sectorId
        : filters.sectorId,
      10,
    );
    let viewMode;
    const viewModes = selectedViewModes;
    if (viewModes && viewModes[spotId] && viewModes[spotId][currentSectorId]) {
      viewMode = selectedViewModes[spotId][currentSectorId];
    } else if (currentSectorId === 0) {
      viewMode = DEFAULT_SPOT_VIEW_MODE;
    } else if (R.find(s => s.id === currentSectorId, sectors).diagram) {
      [viewMode] = DEFAULT_SECTOR_VIEW_MODE_LIST;
    } else {
      viewMode = R.last(DEFAULT_SECTOR_VIEW_MODE_LIST);
    }
    const currentViewMode = viewModeCurr || viewMode;
    const currentCategoryFrom = (
      (filters.categoryFrom === null || filters.categoryFrom === undefined)
        ? selectedFilters[this.state.spotId][currentSectorId].categoryFrom
        : filters.categoryFrom
    );
    const currentCategoryTo = (
      (filters.categoryTo === null || filters.categoryTo === undefined)
        ? selectedFilters[this.state.spotId][currentSectorId].categoryTo
        : filters.categoryTo
    );
    const currentName = (
      (filters.name === null || filters.name === undefined)
        ? this.state.name
        : filters.name
    );
    const currentPeriod = (
      (filters.period === null || filters.period === undefined)
        ? selectedFilters[this.state.spotId][currentSectorId].period
        : filters.period
    );
    let currentDate = (
      (filters.date === null || filters.date === undefined)
        ? selectedFilters[this.state.spotId][currentSectorId].date
        : filters.date
    );
    currentDate = currentDate || DEFAULT_FILTERS.date;
    const currentResult = (
      (filters.result === null || filters.result === undefined)
        ? selectedFilters[this.state.spotId][currentSectorId].result
        : filters.result
    );
    const currentPersonal = (
      (filters.personal === null || filters.personal === undefined)
        ? selectedFilters[this.state.spotId][currentSectorId].personal
        : filters.personal
    );
    const currentOutdated = (
      (filters.outdated === null || filters.outdated === undefined)
        ? selectedFilters[this.state.spotId][currentSectorId].outdated
        : filters.outdated
    );
    const currentPage = (
      (page === null || page === undefined)
        ? selectedPages[this.state.spotId][currentSectorId]
        : page
    );
    const params = {
      filters: {
        category: [[currentCategoryFrom], [currentCategoryTo]],
        personal: currentPersonal,
        outdated: currentViewMode === 'scheme' ? true : currentOutdated,
      },
    };
    if ((userCurr && avail(userCurr.id)) || avail(user.id)) {
      params.filters.result = (currentResult.length === 0 ? [null] : currentResult);
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
      params.limit = perPage;
      params.offset = (currentPage - 1) * perPage;
    }
    if (this.props.token) params.token = this.props.token;
    if (currentSectorId === 0) {
      this.props.increaseNumOfActiveRequests();
      Axios.get(`${ApiUrl}/v1/spots/${this.state.spotId}/routes`, { params })
        .then((response) => {
          this.props.decreaseNumOfActiveRequests();
          this.setState({
            numOfPages: Math.max(1, Math.ceil(response.data.metadata.all / perPage)),
          });
          this.props.loadRoutes(this.state.spotId, 0, response.data.payload);
          if (this.loadingRouteId) {
            const routeId = parseInt(this.loadingRouteId, 10);
            this.loadingRouteId = null;
            this.reloadComments(routeId);
            this.reloadLikes(routeId);
            this.reloadAscents(routeId);
            this.loadRoute(routeId, this.openModal);
            this.setState({ editMode: this.loadEditMode });
          }
        }).catch((error) => {
          this.props.decreaseNumOfActiveRequests();
          this.displayError(error);
        });
    } else {
      this.props.increaseNumOfActiveRequests();
      Axios.get(`${ApiUrl}/v1/sectors/${currentSectorId}/routes`, { params })
        .then((response) => {
          this.props.decreaseNumOfActiveRequests();
          this.setState({
            numOfPages: Math.max(1, Math.ceil(response.data.metadata.all / perPage)),
          });
          this.props.loadRoutes(this.state.spotId, currentSectorId, response.data.payload);
          if (this.loadingRouteId) {
            const routeId = parseInt(this.loadingRouteId, 10);
            this.loadingRouteId = null;
            this.reloadComments(routeId);
            this.reloadLikes(routeId);
            this.reloadAscents(routeId);
            this.loadRoute(routeId, this.openModal);
            this.setState({ editMode: this.loadEditMode });
          }
        }).catch((error) => {
          this.props.decreaseNumOfActiveRequests();
          this.displayError(error);
        });
    }
  };

  changeSectorFilter = (id) => {
    const { user } = this.props;
    if (id !== 0) {
      this.reloadSector(id);
      this.props.history.push(`/spots/${this.state.spotId}/sectors/${id}`);
    } else {
      this.reloadSpot();
      this.props.history.push(`/spots/${this.state.spotId}`);
    }
    this.setState({ sectorId: id, infoData: undefined });
    this.reloadRoutes({ sectorId: id }, null, user);
  };

  changeNameFilter = (searchString) => {
    this.setState({ name: searchString });
    this.reloadRoutes({ name: searchString });
  };

  changePage = (page) => {
    this.props.setSelectedPage(this.state.spotId, this.state.sectorId, page);
    this.reloadRoutes({}, page);
  };

  changeAllFilters = (categoryFrom, categoryTo, period, date, filters) => {
    const { spotId, sectorId } = this.state;
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
    const outdated = filter.selected;
    this.props.setSelectedFilter(spotId, sectorId, 'personal', personal);
    this.props.setSelectedFilter(spotId, sectorId, 'outdated', outdated);
    const resultFilters = R.filter(
      e => R.contains(e.id, R.map(f => f.id, RESULT_FILTERS)),
      filters,
    );
    if (this.props.user) {
      const result = R.map(e => e.value, R.filter(e => e.selected, resultFilters));
      this.props.setSelectedFilter(spotId, sectorId, 'result', result);
      this.reloadRoutes({
        categoryFrom,
        categoryTo,
        period,
        date: date || DEFAULT_FILTERS.date,
        personal,
        outdated,
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
    this.reloadRoutes();
    if (this.state.sectorId === 0) {
      this.reloadSpot(userId);
    } else {
      this.reloadSector(this.state.sectorId, userId);
    }
    this.reloadUserAscents(userId);
  };

  afterSubmitSignUpForm = (userId) => {
    this.reloadRoutes();
    if (this.state.sectorId === 0) {
      this.reloadSpot(userId);
    } else {
      this.reloadSector(this.state.sectorId, userId);
    }
    this.reloadUserAscents(userId);
  };

  removeRoute = () => {
    if (window.confirm('Удалить трассу?')) {
      this.props.increaseNumOfActiveRequests();
      Axios({
        url: `${ApiUrl}/v1/routes/${this.state.currentShown.id}`,
        method: 'delete',
        headers: { TOKEN: this.props.token },
      })
        .then(() => {
          this.props.decreaseNumOfActiveRequests();
          this.reloadRoutes();
          this.closeRoutesModal();
        }).catch((error) => {
          this.props.decreaseNumOfActiveRequests();
          this.displayError(error);
        });
    }
    this.setState({ ctrlPressed: false });
  };

  addRoute = () => {
    this.props.increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/routes/new`, { headers: { TOKEN: this.props.token } })
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        const newRoute = R.clone(response.data.payload);
        newRoute.sector_id = this.state.sectorId;
        if (this.state.sector.kind !== 'mixed') {
          newRoute.kind = this.state.sector.kind;
        }
        this.loadUsers();
        if (this.props.user.role === 'user') newRoute.data.personal = true;
        this.setState({ currentShown: newRoute, routesModalVisible: true, editMode: true });
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  goToProfile = () => {
    const { spotId, sectorId } = this.state;
    if (sectorId === 0) {
      this.props.history.push(`/spots/${spotId}#profile`);
    } else {
      this.props.history.push(`/spots/${spotId}/sectors/${sectorId}#profile`);
    }
    this.setState({ routesModalVisible: false, profileFormVisible: true });
  };

  openProfileForm = () => {
    const { spotId, sectorId } = this.state;
    this.setState({ profileFormVisible: true });
    if (this.state.sectorId === 0) {
      this.props.history.push(`/spots/${spotId}#profile`);
    } else {
      this.props.history.push(`/spots/${spotId}/sectors/${sectorId}#profile`);
    }
  };

  closeProfileForm = () => {
    const { spotId, sectorId } = this.state;
    this.setState({ profileFormVisible: false });
    if (this.state.sectorId === 0) {
      this.props.history.push(`/spots/${spotId}`);
    } else {
      this.props.history.push(`/spots/${spotId}/sectors/${sectorId}`);
    }
  };

  flatten = (arr) => {
    if (arr.length === 0) {
      return [];
    }
    return R.map(e => R.concat([e], this.flatten(e.route_comments)), arr);
  };

  formattedCommentsData = (data) => {
    const self = this;
    return R.map((comment) => {
      const c = R.clone(comment);
      c.route_comments = R.flatten(self.flatten(c.route_comments));
      return c;
    }, data);
  };

  reloadComments = (routeId) => {
    this.props.increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/routes/${routeId}/route_comments`)
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        this.setState({
          comments: this.formattedCommentsData(response.data.payload),
          numOfComments: response.data.metadata.all,
        });
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  removeComment = (comment) => {
    if (!window.confirm('Удалить комментарий?')) {
      return;
    }
    this.props.increaseNumOfActiveRequests();
    Axios({
      url: `${ApiUrl}/v1/route_comments/${comment.id}`,
      method: 'delete',
      headers: { TOKEN: this.props.token },
    })
      .then(() => {
        this.props.decreaseNumOfActiveRequests();
        this.reloadComments(this.state.currentShown.id);
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  saveComment = (params, afterSuccess) => {
    this.props.increaseNumOfActiveRequests();
    Axios.post(`${ApiUrl}/v1/route_comments`, params, { headers: { TOKEN: this.props.token } })
      .then(() => {
        this.props.decreaseNumOfActiveRequests();
        this.reloadComments(this.state.currentShown.id);
        if (afterSuccess) {
          afterSuccess();
        }
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  reloadLikes = (routeId) => {
    const { user } = this.props;
    this.props.increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/routes/${routeId}/likes`)
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        const like = (
          notAvail(user.id)
            ? 0
            : (R.find(R.propEq('user_id', user.id))(response.data.payload))
        );
        const isLiked = notAvail(user.id) ? false : (like !== undefined);
        this.setState({
          numOfLikes: response.data.metadata.all,
          isLiked,
          likeBtnIsBusy: false,
          likeId: like === undefined ? 0 : like.id,
        });
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.setState({ likeBtnIsBusy: false });
        this.displayError(error);
      });
  };

  onLikeChange = () => {
    this.props.increaseNumOfActiveRequests();
    this.setState({ likeBtnIsBusy: true });
    if (this.state.isLiked) {
      Axios({
        url: `${ApiUrl}/v1/likes/${this.state.likeId}`,
        method: 'delete',
        headers: { TOKEN: this.props.token },
      })
        .then(() => {
          this.props.decreaseNumOfActiveRequests();
          this.reloadLikes(this.state.currentShown.id);
        }).catch((error) => {
          this.props.decreaseNumOfActiveRequests();
          this.displayError(error);
          this.setState({ likeBtnIsBusy: false });
        });
    } else {
      const params = {
        like: {
          user_id: this.props.user.id,
          route_id: this.state.currentShown.id,
        },
      };
      Axios.post(`${ApiUrl}/v1/likes`, params, { headers: { TOKEN: this.props.token } })
        .then(() => {
          this.props.decreaseNumOfActiveRequests();
          this.reloadLikes(this.state.currentShown.id);
        }).catch((error) => {
          this.props.decreaseNumOfActiveRequests();
          this.displayError(error);
          this.setState({ likeBtnIsBusy: false });
        });
    }
  };

  reloadAscents = (routeId) => {
    const { user } = this.props;
    this.props.increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/routes/${routeId}/ascents`)
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        const ascent = (
          notAvail(user.id)
            ? null
            : (R.find(R.propEq('user_id', user.id))(response.data.payload))
        );
        this.setState({
          ascent: ascent === undefined ? null : ascent,
          numOfRedpoints: R.filter(R.propEq('result', 'red_point'), response.data.payload).length,
          numOfFlash: R.filter(R.propEq('result', 'flash'), response.data.payload).length,
        });
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  changeAscentResult = () => {
    this.props.increaseNumOfActiveRequests();
    if (this.state.ascent) {
      let result;
      if (this.state.ascent.result === 'red_point') {
        result = 'flash';
      } else if (this.state.ascent.result === 'flash') {
        result = 'unsuccessful';
      } else {
        result = 'red_point';
      }
      const params = { ascent: { result } };
      Axios({
        url: `${ApiUrl}/v1/ascents/${this.state.ascent.id}`,
        method: 'patch',
        params,
        headers: { TOKEN: this.props.token },
      })
        .then(() => {
          this.props.decreaseNumOfActiveRequests();
          this.reloadAscents(this.state.currentShown.id);
        }).catch((error) => {
          this.props.decreaseNumOfActiveRequests();
          this.displayError(error);
        });
    } else {
      const result = 'red_point';
      const params = {
        ascent: {
          result,
          user_id: this.props.user.id,
          route_id: this.state.currentShown.id,
        },
      };
      Axios.post(`${ApiUrl}/v1/ascents`, params, { headers: { TOKEN: this.props.token } })
        .then(() => {
          this.props.decreaseNumOfActiveRequests();
          this.reloadAscents(this.state.currentShown.id);
        }).catch((error) => {
          this.props.decreaseNumOfActiveRequests();
          this.displayError(error);
        });
    }
  };

  loadUsers = () => {
    this.props.increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/users`, { headers: { TOKEN: this.props.token } })
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        const users = R.sort(
          (u1, u2) => u2.statistics.numOfCreatedRoutes - u1.statistics.numOfCreatedRoutes,
          response.data.payload,
        );
        this.setState({ users });
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  createRoute = (params) => {
    const { spotId, sectorId } = this.state;
    this.props.increaseNumOfActiveRequests();
    this.setState({ editRouteIsWaiting: true });
    Axios({
      url: `${ApiUrl}/v1/routes`,
      method: 'post',
      data: params,
      headers: { TOKEN: this.props.token },
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        this.props.history.replace(
          `/spots/${spotId}/sectors/${sectorId}/routes/${response.data.payload.id}`,
        );
        this.setState({
          editRouteIsWaiting: false,
          editMode: false,
          currentShown: R.clone(response.data.payload),
        });
        this.props.addRoute(spotId, sectorId, response.data.payload);
        this.setState({
          comments: [],
          ascents: [],
          ascent: null,
          numOfComments: 0,
          numOfLikes: 0,
          isLiked: false,
          likeId: 0,
          likeBtnIsBusy: false,
          numOfRedpoints: 0,
          numOfFlash: 0,
        });
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
        this.setState({ editRouteIsWaiting: false });
      });
  };

  updateRoute = (params) => {
    const { spotId, sectorId, currentShown } = this.state;
    this.props.increaseNumOfActiveRequests();
    this.setState({ editRouteIsWaiting: true });
    Axios({
      url: `${ApiUrl}/v1/routes/${currentShown.id}`,
      method: 'patch',
      data: params,
      headers: { TOKEN: this.props.token },
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        this.props.history.goBack();
        this.setState({
          editRouteIsWaiting: false,
          editMode: false,
          currentShown: response.data.payload,
        });
        this.props.updateRoute(
          spotId,
          sectorId,
          currentShown.id,
          response.data.payload,
        );
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
        this.setState({ editRouteIsWaiting: false });
      });
  };

  openEdit = () => {
    const { spotId, sectorId, currentShown } = this.state;
    this.loadUsers();
    this.setState({ editMode: true });
    if (sectorId === 0) {
      this.props.history.push(`/spots/${spotId}/routes/${currentShown.id}/edit`);
    } else {
      this.props.history.push(
        `/spots/${spotId}/sectors/${sectorId}/routes/${currentShown.id}/edit`,
      );
    }
  };

  cancelEdit = () => {
    const { currentShown } = this.state;
    if (currentShown.id === null) {
      this.setState({ routesModalVisible: false });
      this.props.history.goBack();
    } else {
      this.setState({ editMode: false });
      this.props.history.goBack();
    }
  };

  goToNew = () => {
    const { spotId, sectorId } = this.state;
    this.props.history.push(`/spots/${spotId}/sectors/${sectorId}/routes/new`);
    this.addRoute();
  };

  changeViewMode = (viewMode) => {
    const {
      user,
      selectedFilters,
      setSelectedFilter: setSelectedFilterProp,
      setSelectedViewMode: setSelectedViewModeProp,
    } = this.props;
    const { spotId, sectorId } = this.state;
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
    this.reloadRoutes({date}, null, user, viewMode);
    this.setState({viewMode});
  };

  submitNoticeForm = (msg) => {
    const { user, selectedFilters } = this.props;
    const { currentShown, spotId, sectorId } = this.state;
    Sentry.withScope((scope) => {
      scope.setExtra('user_id', user.id);
      scope.setExtra('route_id', currentShown.id);
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
    const { user, sectors, selectedViewModes } = this.props;
    const {
      spot, sector, spotId, sectorId, infoData, currentShown,
    } = this.state;
    const {
      likeBtnIsBusy,
    } = this.state;
    let numOfRoutes;
    if (this.state.sectorId === 0) {
      numOfRoutes = infoData ? infoData[1].count : 0;
    } else {
      numOfRoutes = infoData ? infoData[0].count : 0;
    }
    let data;
    if (sectorId === 0) {
      data = spot;
    } else if (sector.id === sectorId) {
      data = sector;
    } else {
      data = {};
    }
    let viewMode;
    if (selectedViewModes && selectedViewModes[spotId] && selectedViewModes[spotId][sectorId]) {
      viewMode = selectedViewModes[spotId][sectorId];
    } else if (sectorId === 0) {
      viewMode = DEFAULT_SPOT_VIEW_MODE;
    } else if (R.find(s => s.id === sectorId, sectors).diagram) {
      [viewMode] = DEFAULT_SECTOR_VIEW_MODE_LIST;
    } else {
      viewMode = R.last(DEFAULT_SECTOR_VIEW_MODE_LIST);
    }
    let currentSector;
    if (sectorId === 0) {
      currentSector = R.find(
        s => s.id === currentShown.sector_id,
        sectors,
      );
    }
    if (this.state.routesModalVisible) {
      if (this.state.editMode) {
        return (
          <RoutesEditModal
            onClose={this.closeRoutesModal}
            sector={
              this.state.sectorId === 0
                ? (
                  R.find(
                    s => s.id === currentShown.sector_id,
                    sectors,
                  )
                )
                : this.state.sector
            }
            cancel={this.cancelEdit}
            users={this.state.users}
            routeMarkColors={this.props.routeMarkColors}
            user={userStateToUser(user)}
            numOfActiveRequests={this.props.numOfActiveRequests}
            createRoute={this.createRoute}
            updateRoute={this.updateRoute}
            isWaiting={this.state.editRouteIsWaiting}
            route={currentShown}
            diagram={
              sectorId === 0
                ? (currentSector.diagram && currentSector.diagram.url)
                : (sector.diagram && sector.diagram.url)
            }
          />
        );
      }
      return (
        <RoutesShowModal
          onClose={this.closeRoutesModal}
          openEdit={this.openEdit}
          removeRoute={this.removeRoute}
          ctrlPressed={this.state.ctrlPressed}
          goToProfile={this.goToProfile}
          comments={this.state.comments}
          removeComment={this.removeComment}
          saveComment={this.saveComment}
          numOfComments={this.state.numOfComments}
          numOfLikes={this.state.numOfLikes}
          isLiked={this.state.isLiked}
          likeBtnIsBusy={likeBtnIsBusy}
          onLikeChange={this.onLikeChange}
          user={userStateToUser(user)}
          numOfActiveRequests={this.props.numOfActiveRequests}
          ascent={this.state.ascent}
          numOfRedpoints={this.state.numOfRedpoints}
          numOfFlash={this.state.numOfFlash}
          changeAscentResult={this.changeAscentResult}
          route={currentShown}
          diagram={
            sectorId === 0
              ? (currentSector.diagram && currentSector.diagram.url)
              : (sector.diagram && sector.diagram.url)
          }
          submitNoticeForm={this.submitNoticeForm}
        />
      );
    }
    const routes = R.pathOr([], [this.state.spotId, this.state.sectorId], this.props.routes);
    return (
      <>
        <div className="sticky-bar">
          <Header
            data={data}
            sectors={sectors}
            sectorId={sectorId}
            infoData={infoData}
            changeSectorFilter={this.changeSectorFilter}
            showMenu={() => this.setState({ showMenu: true })}
          />
          {
            this.state.showMenu
              ? (
                <MainMenu
                  user={userStateToUser(user)}
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
            routes={routes}
            ascents={this.state.ascents}
            user={userStateToUser(user)}
            addRoute={this.goToNew}
            sectorId={this.state.sectorId}
            diagram={sector.diagram && sector.diagram.url}
            page={
              (this.props.selectedPages && this.props.selectedPages[this.state.spotId])
                ? this.props.selectedPages[this.state.spotId][this.state.sectorId]
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
          <StickyBar loading={this.props.numOfActiveRequests > 0} />
        </div>
        <Footer
          user={userStateToUser(user)}
          logIn={this.logIn}
          signUp={this.signUp}
          logOut={this.logOut}
        />
      </>
    );
  };

  render() {
    const { user, selectedViewModes, sectors } = this.props;
    const { spotId, sectorId } = this.state;
    let viewMode;
    if (selectedViewModes && selectedViewModes[spotId] && selectedViewModes[spotId][sectorId]) {
      viewMode = selectedViewModes[spotId][sectorId];
    } else if (sectorId === 0) {
      viewMode = DEFAULT_SPOT_VIEW_MODE;
    } else if (R.find(s => s.id === sectorId, sectors).diagram) {
      [viewMode] = DEFAULT_SECTOR_VIEW_MODE_LIST;
    } else {
      viewMode = R.last(DEFAULT_SECTOR_VIEW_MODE_LIST);
    }
    const period = (
      (this.props.selectedFilters && this.props.selectedFilters[this.state.spotId])
        ? this.props.selectedFilters[this.state.spotId][this.state.sectorId].period
        : DEFAULT_FILTERS.period
    );
    let date = (
      (this.props.selectedFilters && this.props.selectedFilters[this.state.spotId])
        ? this.props.selectedFilters[this.state.spotId][this.state.sectorId].date
        : DEFAULT_FILTERS.date
    );
    date = date || DEFAULT_FILTERS.date;
    const filters = (
      (this.props.selectedFilters && this.props.selectedFilters[this.state.spotId])
        ? this.props.selectedFilters[this.state.spotId][this.state.sectorId].filters
        : DEFAULT_FILTERS.filters
    );
    const categoryFrom = (
      (this.props.selectedFilters && this.props.selectedFilters[this.state.spotId])
        ? this.props.selectedFilters[this.state.spotId][this.state.sectorId].categoryFrom
        : DEFAULT_FILTERS.categoryFrom
    );
    const categoryTo = (
      (this.props.selectedFilters && this.props.selectedFilters[this.state.spotId])
        ? this.props.selectedFilters[this.state.spotId][this.state.sectorId].categoryTo
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
                  avail(user.id)
                    ? filters
                    : (
                      R.filter(
                        e => !R.contains(e.id, R.map(f => f.id, RESULT_FILTERS)),
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
          this.state.resetPasswordFormVisible
            ? (
              <ResetPasswordForm
                onFormSubmit={this.submitResetPasswordForm}
                closeForm={this.closeResetPasswordForm}
                isWaiting={this.state.resetPasswordIsWaiting}
                formErrors={this.state.resetPasswordFormErrors}
                email={this.state.email}
                resetErrors={this.resetPasswordResetErrors}
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
          (avail(user.id) && this.state.profileFormVisible) && (
            <Profile
              user={user}
              onFormSubmit={this.submitProfileForm}
              removeVk={this.removeVk}
              numOfActiveRequests={this.props.numOfActiveRequests}
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
        {this.content()}
      </>
    );
  }
}

const mapStateToProps = state => ({
  selectedViewModes: state.selectedViewModes,
  selectedPages: state.selectedPages,
  selectedFilters: state.selectedFilters,
  routes: state.routes,
  sectors: state.sectors,
  user: state.user,
  token: state.token,
  numOfActiveRequests: state.numOfActiveRequests,
  routeMarkColors: state.routeMarkColors,
});

const mapDispatchToProps = dispatch => ({
  loadRoutes: (spotId, sectorId, routes) => dispatch(loadRoutes(spotId, sectorId, routes)),
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
  loadSectors: sectors => dispatch(loadSectors(sectors)),
  loadRouteMarkColors: routeMarkColors => dispatch(loadRouteMarkColors(routeMarkColors)),
  saveUser: user => dispatch(saveUser(user)),
  saveToken: token => dispatch(saveToken(token)),
  removeToken: () => dispatch(removeToken()),
  updateRoute: (spotId, sectorId, id, route) => dispatch(updateRoute(spotId, sectorId, id, route)),
  addRoute: (spotId, sectorId, route) => dispatch(addRoute(spotId, sectorId, route)),
  increaseNumOfActiveRequests: () => dispatch(increaseNumOfActiveRequests()),
  decreaseNumOfActiveRequests: () => dispatch(decreaseNumOfActiveRequests()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsShow));
