import store from '../store';

const getCurrentSector = (sectorId) => {
  const state = store.getState();
  const { sectors } = state.sectorsStore;
  return sectorId !== 0 ? sectors[sectorId] : undefined;
};

export default getCurrentSector;
