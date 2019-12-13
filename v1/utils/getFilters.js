import store from '../store';
import { DEFAULT_FILTERS } from '../../src/Constants/DefaultFilters';

const getFilters = (spotId, sectorId) => {
  const state = store.getState();
  const { selectedFilters } = state;
  if (selectedFilters && selectedFilters[spotId] && selectedFilters[spotId][sectorId]) {
    return selectedFilters[spotId][sectorId];
  }
  return DEFAULT_FILTERS;
};

export default getFilters;
