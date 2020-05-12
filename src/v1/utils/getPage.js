const getPage = (selectedPages, spotId, sectorId) => {
  if (selectedPages && selectedPages[spotId] && selectedPages[spotId][sectorId]) {
    return selectedPages[spotId][sectorId];
  }
  return 1;
};

export default getPage;
