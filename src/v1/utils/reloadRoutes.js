import moment from 'moment';
import store from '../store';
import { avail } from './index';
import { ApiUrl } from '../Environ';
import { loadRoutes } from '../stores/routes/utils';
import getViewMode from './getViewMode';
import getFilters from './getFilters';
import getPage from './getPage';
import { BACKEND_DATE_FORMAT } from '../Constants/Date';
import CARDS_PER_PAGE from '../Constants/RouteCardTable';

const reloadRoutes = (spotId, sectorId) => {
  const state = store.getState();
  const user = state.usersStore.users[state.usersStore.currentUserId];
  const currentViewMode = getViewMode(spotId, sectorId);
  const {
    categoryFrom: currentCategoryFrom,
    categoryTo: currentCategoryTo,
    period: currentPeriod,
    date: currentDate,
    result: currentResult,
    personal: currentPersonal,
    outdated: currentOutdated,
    liked: currentLiked,
  } = getFilters(spotId, sectorId);
  const currentPage = getPage(spotId, sectorId);
  const params = {
    filters: {
      category: [[currentCategoryFrom], [currentCategoryTo]],
      personal: currentPersonal,
      outdated: currentViewMode === 'scheme' ? true : currentOutdated,
    },
  };
  if (avail(user)) {
    params.filters.result = (currentResult.length === 0 ? [null] : currentResult);
    if (currentLiked) {
      params.filters.liked_by = 'self';
    }
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
  if (sectorId === 0) {
    store.dispatch(loadRoutes(`${ApiUrl}/v1/spots/${spotId}/routes`, params));
  } else {
    store.dispatch(loadRoutes(`${ApiUrl}/v1/sectors/${sectorId}/routes`, params));
  }
};

export default reloadRoutes;
