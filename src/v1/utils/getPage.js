import store from '../store';

const getPage = (spotId, sectorId) => {
  const state = store.getState();
  const { selectedPages } = state;
  if (selectedPages && selectedPages[spotId] && selectedPages[spotId][sectorId]) {
    return selectedPages[spotId][sectorId];
  }
  return 1;
};

export default getPage;
