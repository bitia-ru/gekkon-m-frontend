import * as R from 'ramda';
import { DEFAULT_FILTERS } from '../Constants/DefaultFilters';
import RESULT_FILTERS from '@/v1/Constants/ResultFilters';

const filtersLookUp = {
  personal: 'Авторские трассы',
  outdated: 'Скрученные',
  liked: 'Понравившиеся мне',
  flash: 'Флешанул',
  red_point: 'Пролез',
  unsuccessful: 'Не пройдена',
};

export const prepareFilters = (filters) => {
  return {
    ...filters,
    filters: R.map(
      e => (
        {
          clickable: true,
          id: e,
          selected: filters[e],
          text: `${filtersLookUp[e]} ${filters[e] ? ' ✓' : ''}`,
          value: e,
        }
      ),
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
