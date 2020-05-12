const getCurrentSector = (sectors, sectorId) => {
  return sectorId !== 0 ? sectors[sectorId] : undefined;
};

export default getCurrentSector;
