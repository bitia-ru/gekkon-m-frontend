const getCurrentSpotOrSectorData = (spots, sectors, spotId, sectorId) => {
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
