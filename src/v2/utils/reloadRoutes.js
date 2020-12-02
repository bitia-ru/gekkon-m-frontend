import moment from 'moment';
import * as R from 'ramda';
import { avail } from '@/v1/utils/index';
import { loadRoutes } from '@/v2/redux/routes/actions';
import getViewMode from '@/v1/utils/getViewMode';
import getFilters from '@/v1/utils/getFilters';
import getPage from '@/v1/utils/getPage';
import { BACKEND_DATE_FORMAT } from '@/v1/Constants/Date';
import CARDS_PER_PAGE from '@/v1/Constants/RouteCardTable';
import RESULT_FILTERS from '@/v1/Constants/ResultFilters';

const reloadRoutes = (spotId, sectorId) => (
  (dispatch, getState) => {
    const state = getState();
    const user = state.usersStore.users[state.usersStore.currentUserId];
    const sectors = state.sectorsStore.sectors;
    const { selectedViewModes, selectedFilters, selectedPages, } = state;
    const currentViewMode = getViewMode(sectors, selectedViewModes, spotId, sectorId);
    const filters = getFilters(selectedFilters, spotId, sectorId);
    const {
      categoryFrom: currentCategoryFrom,
      categoryTo: currentCategoryTo,
      period: currentPeriod,
      date: currentDate,
      personal: currentPersonal,
      outdated: currentOutdated,
      liked: currentLiked,
    } = filters;
    const currentResult = R.keys(R.filter(e => e, R.pick(R.keys(RESULT_FILTERS), filters)));
    const currentPage = getPage(selectedPages, spotId, sectorId);
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
        dFrom.setDate(d.getDate() - 14);
        break;
      case 4:
        dFrom.setMonth(d.getMonth() - 1);
        break;
      case 5:
        dFrom.setMonth(d.getMonth() - 2);
        break;
      default:
        break;
      }
      params.filters.installed_at = [[dFrom], [d]];
    }
    if (currentViewMode === 'scheme') {
      params.filters.installed_at = [[null], [moment(currentDate)
        .format(BACKEND_DATE_FORMAT)]];
      params.filters.installed_until = [
        [moment(currentDate)
          .add(1, 'days')
          .format(BACKEND_DATE_FORMAT)],
        [null],
      ];
    } else {
      params.limit = CARDS_PER_PAGE;
      params.offset = (currentPage - 1) * CARDS_PER_PAGE;
    }
    if (sectorId === 0) {
      dispatch(loadRoutes(`/v1/spots/${spotId}/routes`, params));
    } else {
      dispatch(loadRoutes(`/v1/sectors/${sectorId}/routes`, params));
    }
  }
);

export default reloadRoutes;
