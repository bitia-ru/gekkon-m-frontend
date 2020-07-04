import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
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
  setRoutes,
  setRoutesData,
  setRouteIds,
  removeRoute,
  setSectorIds,
  setSector,
  setSectors,
  loadRouteMarkColors,
  setUsers,
  saveUser,
  saveToken,
  removeToken,
  increaseNumOfActiveRequests,
  decreaseNumOfActiveRequests,
  setRoute,
  setRouteData,
  loadFromLocalStorageSelectedFilters,
  removeRoutePropertyById,
  setRouteProperty,
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
import SectorContext from '../contexts/SectorContext';
import getArrayFromObject from '../../v1/utils/getArrayFromObject';
import {
  reloadComments,
} from '../../v1/utils/RouteFinder';
import { reloadSector } from '../../v1/utils/SectorFinder';

Axios.interceptors.request.use((config) => {
  const configCopy = R.clone(config);
  configCopy.paramsSerializer = params => Qs.stringify(params, { arrayFormat: 'brackets' });
  return configCopy;
});

class SpotsShow extends Authorization {
  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      name: '',
      numOfPages: 1,
      spot: {},
      infoData: undefined,
      editRouteIsWaiting: false,
      showMenu: false,
      showFilters: false,
    });
  }

  componentDidMount() {
    const {
      history,
      saveToken: saveTokenProp,
      saveUser: saveUserProp,
    } = this.props;
    const sectorId = this.getSectorId();
    history.listen((location, action) => {
      if (action === 'POP') {
        this.setState({ profileFormVisible: (location.hash === '#profile') });
      }
    });

    if (Cookies.get('user_session_token') !== undefined) {
      const token = Cookies.get('user_session_token');
      saveTokenProp(token);
      this.signIn(token, (currentUser) => {
        this.reloadUserAscents(currentUser.id);
        this.reloadSectors(sectorId, currentUser);
        if (sectorId === 0) {
          this.reloadSpot(currentUser.id);
        } else {
          this.reloadSector(sectorId, currentUser.id);
        }
      });
    } else {
      this.reloadUserAscents();
      this.reloadSectors(sectorId);
      if (sectorId === 0) {
        this.reloadSpot();
      } else {
        this.reloadSector(sectorId);
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

  getSpotId = () => {
    const { match } = this.props;
    return parseInt(match.params.id, 10);
  };

  getSectorId = () => {
    const { match } = this.props;
    return match.params.sector_id ? parseInt(match.params.sector_id, 10) : 0;
  };

  reloadUserAscents = (userId) => {
    const { user, setRoutesData: setRoutesDataProp } = this.props;
    const id = (userId || (avail(user.id) ? user.id : null));
    if (!id) {
      return;
    }
    this.props.increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/users/${id}/ascents`, { withCredentials: true })
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        setRoutesDataProp(
          R.map(
            ascent => (
              {
                routeId: ascent.route_id,
                content: { ascents: R.fromPairs([[ascent.id, ascent]]) },
              }
            ),
            response.data.payload,
          ),
        );
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  onRouteClick = (id) => {
    const { history } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    if (sectorId === 0) {
      history.push(`/spots/${spotId}/routes/${id}`);
    } else {
      history.push(
        `/spots/${spotId}/sectors/${sectorId}/routes/${id}`,
      );
    }
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
    this.reloadUserAscents();
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
    const { user } = this.props;
    const spotId = this.getSpotId();
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
    Axios.get(`${ApiUrl}/v1/spots/${spotId}`, { params, withCredentials: true })
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
      reloadSector(
        id,
        currentUserId,
        (response) => {
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
          this.setState({ infoData });
        },
        (error) => {
          this.displayError(error);
        },
      );
    }
  };

  reloadSectors = (currentSectorId, user) => {
    const {
      selectedFilters,
      selectedPages,
      setSectors: setSectorsProp,
      setSectorIds: setSectorIdsProp,
    } = this.props;
    const spotId = this.getSpotId();
    this.props.increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/spots/${spotId}/sectors`, { withCredentials: true })
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        setSectorsProp(response.data.payload);
        setSectorIdsProp(R.map(sector => sector.id, response.data.payload));
        if (!selectedFilters || selectedFilters[spotId] === undefined) {
          this.props.setDefaultSelectedFilters(
            spotId,
            R.map(sector => sector.id, response.data.payload),
          );
        }
        if (!selectedPages || selectedPages[spotId] === undefined) {
          this.props.setDefaultSelectedPages(
            spotId,
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
              selectedFiltersCurr[spotId] === undefined
                ? DEFAULT_FILTERS
                : selectedFiltersCurr[spotId][currentSectorId]
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
    Axios.get(`${ApiUrl}/v1/route_mark_colors`, { withCredentials: true })
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
      setRoutes: setRoutesProp,
      setRouteIds: setRouteIdsProp,
    } = this.props;
    const { perPage } = this.state;
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
    const currSector = R.find(s => s.id === currentSectorId, sectors);
    if (viewModes && viewModes[spotId] && viewModes[spotId][currentSectorId]) {
      viewMode = selectedViewModes[spotId][currentSectorId];
    } else if (currentSectorId === 0) {
      viewMode = DEFAULT_SPOT_VIEW_MODE;
    } else if (currSector && currSector.diagram) {
      [viewMode] = DEFAULT_SECTOR_VIEW_MODE_LIST;
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
        ? selectedFilters[spotId][currentSectorId].liked
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
    if ((userCurr && avail(userCurr.id)) || (user && avail(user.id))) {
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
      this.props.increaseNumOfActiveRequests();
      Axios.get(`${ApiUrl}/v1/spots/${spotId}/routes`, { params, withCredentials: true })
        .then((response) => {
          this.props.decreaseNumOfActiveRequests();
          this.setState({
            numOfPages: Math.max(1, Math.ceil(response.data.metadata.all / CARDS_PER_PAGE)),
          });
          setRoutesProp(response.data.payload);
          setRouteIdsProp(R.map(route => route.id, response.data.payload));
        }).catch((error) => {
          this.props.decreaseNumOfActiveRequests();
          this.displayError(error);
        });
    } else {
      this.props.increaseNumOfActiveRequests();
      Axios.get(`${ApiUrl}/v1/sectors/${currentSectorId}/routes`, { params, withCredentials: true })
        .then((response) => {
          this.props.decreaseNumOfActiveRequests();
          this.setState({
            numOfPages: Math.max(1, Math.ceil(response.data.metadata.all / CARDS_PER_PAGE)),
          });
          setRoutesProp(response.data.payload);
          setRouteIdsProp(R.map(route => route.id, response.data.payload));
        }).catch((error) => {
          this.props.decreaseNumOfActiveRequests();
          this.displayError(error);
        });
    }
  };

  changeSectorFilter = (id) => {
    const { user } = this.props;
    const spotId = this.getSpotId();
    if (id !== 0) {
      this.reloadSector(id);
      this.props.history.push(`/spots/${spotId}/sectors/${id}`);
    } else {
      this.reloadSpot();
      this.props.history.push(`/spots/${spotId}`);
    }
    this.reloadRoutes({ sectorId: id }, null, user);
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
    this.props.setSelectedFilter(spotId, sectorId, 'personal', personal);
    filter = R.find(R.propEq('id', 'outdated'))(filters);
    let outdated = null;
    if (filter) {
      outdated = filter.selected;
      this.props.setSelectedFilter(spotId, sectorId, 'outdated', outdated);
    }
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
      this.reloadRoutes({
        categoryFrom,
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
    this.reloadUserAscents(userId);
  };

  afterSubmitSignUpForm = (userId) => {
    const sectorId = this.getSectorId();
    this.reloadRoutes();
    if (sectorId === 0) {
      this.reloadSpot(userId);
    } else {
      this.reloadSector(sectorId, userId);
    }
    this.reloadUserAscents(userId);
  };

  removeRoute = (routeId) => {
    const { removeRoute: removeRouteProp } = this.props;
    if (window.confirm('Удалить трассу?')) {
      this.props.increaseNumOfActiveRequests();
      Axios({
        url: `${ApiUrl}/v1/routes/${routeId}`,
        method: 'delete',
        headers: { TOKEN: this.props.token },
      })
        .then(() => {
          this.props.decreaseNumOfActiveRequests();
          this.reloadRoutes();
          removeRouteProp(routeId);
          this.closeRoutesModal();
        }).catch((error) => {
          this.props.decreaseNumOfActiveRequests();
          this.displayError(error);
        });
    }
  };

  goToProfile = () => {
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    if (sectorId === 0) {
      this.props.history.push(`/spots/${spotId}#profile`);
    } else {
      this.props.history.push(`/spots/${spotId}/sectors/${sectorId}#profile`);
    }
    this.setState({ profileFormVisible: true });
  };

  openProfileForm = () => {
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    this.setState({ profileFormVisible: true });
    if (sectorId === 0) {
      this.props.history.push(`/spots/${spotId}#profile`);
    } else {
      this.props.history.push(`/spots/${spotId}/sectors/${sectorId}#profile`);
    }
  };

  closeProfileForm = () => {
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    this.setState({ profileFormVisible: false });
    if (sectorId === 0) {
      this.props.history.push(`/spots/${spotId}`);
    } else {
      this.props.history.push(`/spots/${spotId}/sectors/${sectorId}`);
    }
  };

  removeComment = (routeId, comment) => {
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
        reloadComments(
          routeId,
          null,
          (error) => {
            this.displayError(error);
          },
        );
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  saveComment = (routeId, params, afterSuccess) => {
    this.props.increaseNumOfActiveRequests();
    Axios.post(`${ApiUrl}/v1/route_comments`, params, { headers: { TOKEN: this.props.token }, withCredentials: true })
      .then(() => {
        this.props.decreaseNumOfActiveRequests();
        reloadComments(
          routeId,
          null,
          (error) => {
            this.displayError(error);
          },
        );
        if (afterSuccess) {
          afterSuccess();
        }
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  onLikeChange = (routeId, afterChange) => {
    const {
      user,
      routes,
      setRouteProperty: setRoutePropertyProp,
      removeRoutePropertyById: removeRoutePropertyByIdProp,
    } = this.props;
    this.props.increaseNumOfActiveRequests();
    const route = routes[routeId];
    const like = R.find(R.propEq('user_id', user.id))(getArrayFromObject(route.likes));
    if (like) {
      Axios({
        url: `${ApiUrl}/v1/likes/${like.id}`,
        method: 'delete',
        headers: { TOKEN: this.props.token },
      })
        .then(() => {
          this.props.decreaseNumOfActiveRequests();
          removeRoutePropertyByIdProp(
            routeId,
            'likes',
            like.id,
          );
          afterChange();
        }).catch((error) => {
          this.props.decreaseNumOfActiveRequests();
          this.displayError(error);
          afterChange();
        });
    } else {
      const params = {
        like: {
          user_id: user.id,
          route_id: routeId,
        },
      };
      Axios.post(`${ApiUrl}/v1/likes`, params, { headers: { TOKEN: this.props.token }, withCredentials: true })
        .then((response) => {
          this.props.decreaseNumOfActiveRequests();
          setRoutePropertyProp(
            routeId,
            'likes',
            response.data.payload,
          );
          afterChange();
        }).catch((error) => {
          this.props.decreaseNumOfActiveRequests();
          this.displayError(error);
          afterChange();
        });
    }
  };

  changeAscentResult = (routeId) => {
    const {
      user,
      routes,
      setRouteProperty: setRoutePropertyProp,
    } = this.props;
    this.props.increaseNumOfActiveRequests();
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
      Axios({
        url: `${ApiUrl}/v1/ascents/${ascent.id}`,
        method: 'patch',
        params,
        headers: { TOKEN: this.props.token },
      })
        .then((response) => {
          this.props.decreaseNumOfActiveRequests();
          setRoutePropertyProp(
            routeId,
            'ascents',
            response.data.payload,
          );
        }).catch((error) => {
          this.props.decreaseNumOfActiveRequests();
          this.displayError(error);
        });
    } else {
      const result = 'red_point';
      const params = {
        ascent: {
          result,
          user_id: user.id,
          route_id: routeId,
        },
      };
      Axios.post(`${ApiUrl}/v1/ascents`, params, { headers: { TOKEN: this.props.token }, withCredentials: true })
        .then((response) => {
          this.props.decreaseNumOfActiveRequests();
          setRoutePropertyProp(
            routeId,
            'ascents',
            response.data.payload,
          );
        }).catch((error) => {
          this.props.decreaseNumOfActiveRequests();
          this.displayError(error);
        });
    }
  };

  loadUsers = () => {
    const {
      setUsers: setUsersProp,
    } = this.props;
    this.props.increaseNumOfActiveRequests();
    Axios.get(`${ApiUrl}/v1/users`, { headers: { TOKEN: this.props.token }, withCredentials: true })
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        const users = R.sort(
          (u1, u2) => u2.statistics.numOfCreatedRoutes - u1.statistics.numOfCreatedRoutes,
          response.data.payload,
        );
        setUsersProp(users);
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
      });
  };

  createRoute = (params) => {
    const {
      setRoute: setRouteProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
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
        setRouteProp(response.data.payload);
        this.props.history.replace(
          `/spots/${spotId}/sectors/${sectorId}/routes/${response.data.payload.id}`,
        );
        this.setState({
          editRouteIsWaiting: false,
        });
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
        this.setState({ editRouteIsWaiting: false });
      });
  };

  updateRoute = (routeId, params) => {
    const {
      setRoute: setRouteProp,
    } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    this.props.increaseNumOfActiveRequests();
    this.setState({ editRouteIsWaiting: true });
    Axios({
      url: `${ApiUrl}/v1/routes/${routeId}`,
      method: 'patch',
      data: params,
      headers: { TOKEN: this.props.token },
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then((response) => {
        this.props.decreaseNumOfActiveRequests();
        setRouteProp(response.data.payload);
        this.props.history.goBack();
        this.setState({
          editRouteIsWaiting: false,
        });
      }).catch((error) => {
        this.props.decreaseNumOfActiveRequests();
        this.displayError(error);
        this.setState({ editRouteIsWaiting: false });
      });
  };

  openEdit = (routeId) => {
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    if (sectorId === 0) {
      this.props.history.push(`/spots/${spotId}/routes/${routeId}/edit`);
    } else {
      this.props.history.push(
        `/spots/${spotId}/sectors/${sectorId}/routes/${routeId}/edit`,
      );
    }
  };

  cancelEdit = (routeId) => {
    if (routeId === null) {
      this.props.history.goBack();
    } else {
      this.props.history.goBack();
    }
  };

  goToNew = () => {
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    this.props.history.push(`/spots/${spotId}/sectors/${sectorId}/routes/new`);
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
      setSelectedFilterProp(spotId, sectorId, 'date', date);
    }
    this.reloadRoutes({date}, null, user, viewMode);

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
      user, sectors, selectedViewModes, match,
    } = this.props;
    const {
      spot, infoData,
    } = this.state;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    let numOfRoutes;
    if (sectorId === 0) {
      numOfRoutes = infoData ? infoData[1].count : 0;
    } else {
      numOfRoutes = infoData ? infoData[0].count : 0;
    }
    let data;
    const sector = sectors[sectorId];
    if (sectorId === 0) {
      data = spot;
    } else if (sector && sector.id === sectorId) {
      data = sector;
    } else {
      data = {};
    }
    let viewMode;
    const currSector = R.find(s => s.id === sectorId, sectors);
    if (selectedViewModes && selectedViewModes[spotId] && selectedViewModes[spotId][sectorId]) {
      viewMode = selectedViewModes[spotId][sectorId];
    } else if (sectorId === 0) {
      viewMode = DEFAULT_SPOT_VIEW_MODE;
    } else if (currSector && currSector.diagram) {
      [viewMode] = DEFAULT_SECTOR_VIEW_MODE_LIST;
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
              displayError={this.displayError}
              onClose={this.closeRoutesModal}
              cancel={this.cancelEdit}
              routeMarkColors={this.props.routeMarkColors}
              numOfActiveRequests={this.props.numOfActiveRequests}
              createRoute={this.createRoute}
              updateRoute={this.updateRoute}
              isWaiting={this.state.editRouteIsWaiting}
              loadUsers={this.loadUsers}
            />
          )}
        />
        <Route
          path={`${match.path}/:route_id`}
          render={() => (
            <RoutesShowModal
              displayError={this.displayError}
              onClose={this.closeRoutesModal}
              openEdit={this.openEdit}
              removeRoute={this.removeRoute}
              goToProfile={this.goToProfile}
              removeComment={this.removeComment}
              saveComment={this.saveComment}
              onLikeChange={this.onLikeChange}
              numOfActiveRequests={this.props.numOfActiveRequests}
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
                  user={userStateToUser(user)}
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
                <StickyBar loading={this.props.numOfActiveRequests > 0} />
              </div>
              <Footer
                user={userStateToUser(user)}
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
    const { user, selectedViewModes, sectors } = this.props;
    const spotId = this.getSpotId();
    const sectorId = this.getSectorId();
    const sector = sectorId !== 0 ? sectors[sectorId] : undefined;
    let viewMode;
    const currSector = R.find(s => s.id === sectorId, sectors);
    if (selectedViewModes && selectedViewModes[spotId] && selectedViewModes[spotId][sectorId]) {
      viewMode = selectedViewModes[spotId][sectorId];
    } else if (sectorId === 0) {
      viewMode = DEFAULT_SPOT_VIEW_MODE;
    } else if (currSector && currSector.diagram) {
      [viewMode] = DEFAULT_SECTOR_VIEW_MODE_LIST;
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
                  avail(user.id)
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
        <SectorContext.Provider value={{ sector }}>
          {this.content()}
        </SectorContext.Provider>
      </>
    );
  }
}

const mapStateToProps = state => ({
  routes: state.routes,
  selectedViewModes: state.selectedViewModes,
  selectedPages: state.selectedPages,
  selectedFilters: state.selectedFilters,
  sectors: state.sectors,
  user: state.user,
  token: state.token,
  numOfActiveRequests: state.numOfActiveRequests,
  routeMarkColors: state.routeMarkColors,
});

const mapDispatchToProps = dispatch => ({
  setRoutes: routes => dispatch(setRoutes(routes)),
  setRoutesData: routesData => dispatch(setRoutesData(routesData)),
  setRouteProperty: (routeId, routePropertyName, routePropertyData) => dispatch(
    setRouteProperty(routeId, routePropertyName, routePropertyData),
  ),
  removeRoutePropertyById: (routeId, routePropertyName, routePropertyId) => dispatch(
    removeRoutePropertyById(routeId, routePropertyName, routePropertyId),
  ),
  setRouteIds: routeIds => dispatch(setRouteIds(routeIds)),
  setSectorIds: sectorIds => dispatch(setSectorIds(sectorIds)),
  removeRoute: routeId => dispatch(removeRoute(routeId)),
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
  setSectors: sectors => dispatch(setSectors(sectors)),
  setSector: sector => dispatch(setSector(sector)),
  loadRouteMarkColors: routeMarkColors => dispatch(loadRouteMarkColors(routeMarkColors)),
  saveUser: user => dispatch(saveUser(user)),
  setUsers: users => dispatch(setUsers(users)),
  saveToken: token => dispatch(saveToken(token)),
  removeToken: () => dispatch(removeToken()),
  setRoute: route => dispatch(setRoute(route)),
  setRouteData: (routeId, routeData) => (
    dispatch(setRouteData(routeId, routeData))
  ),
  increaseNumOfActiveRequests: () => dispatch(increaseNumOfActiveRequests()),
  decreaseNumOfActiveRequests: () => dispatch(decreaseNumOfActiveRequests()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsShow));
