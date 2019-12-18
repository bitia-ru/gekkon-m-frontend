import store from '../store';

const getCurrentSpotOrSectorData = (spotId, sectorId) => {
  const state = store.getState();
  const { sectors } = state.sectorsStore;
  const { spots } = state.spotsStore;
  const sector = sectors[sectorId];
  const spot = spots[spotId];
  if (sectorId === 0 && spot) {
    return spot;
  }
  if (sector) {
    return sector;
  }
  return {};
};

export default getCurrentSpotOrSectorData;
