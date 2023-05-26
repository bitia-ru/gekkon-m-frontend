import * as R from 'ramda';
import { DEFAULT_FILTERS } from '../Constants/DefaultFilters';
import RESULT_FILTERS from '@/v1/Constants/ResultFilters';

const filtersLookUp = {
  personal: 'Авторские трассы',
  outdated: 'Скрученные',
  liked: 'Понравившиеся мне',
  flash: 'Флешанул',
  red_point: 'Пролез',
  unsuccessful: 'Непройденные (пробовал, но не смог)',
  not_tried: 'Нетронутые',
};

export const prepareFilters = (filters) => {
  return {
    ...filters,
    filters: R.map(
      e => {
        const filter = filters[e] || R.find(R.propEq('id', e))(DEFAULT_FILTERS);
        return {
          clickable: true,
          id: e,
          selected: filter,
          text: `${filtersLookUp[e]} ${filter ? ' ✓' : ''}`,
          value: e,
        }
      },
      R.concat(R.keys(RESULT_FILTERS), ['personal', 'outdated', 'liked']),
    ),
  };
};

const getFilters = (selectedFilters, spotId, sectorId) => {
  if (selectedFilters && selectedFilters[spotId] && selectedFilters[spotId][sectorId]) {
    return prepareFilters(selectedFilters[spotId][sectorId]);
  }
  return prepareFilters(DEFAULT_FILTERS);
};

export default getFilters;
