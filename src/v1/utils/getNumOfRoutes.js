import getCurrentSpotOrSectorData from './getCurrentSpotOrSectorData';

const getNumOfRoutes = (sectors, spotId, sectorId) => {
  const sector = sectors[sectorId];
  const data = getCurrentSpotOrSectorData(spotId, sectorId);
  if (sectorId === 0) {
    return data.infoData ? data.infoData[1].count : 0;
  }
  if (sector) {
    return data.infoData ? data.infoData[0].count : 0;
  }
  return 0;
};

export default getNumOfRoutes;
