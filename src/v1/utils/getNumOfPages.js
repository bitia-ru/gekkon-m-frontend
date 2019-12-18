const getNumOfPages = (state) => {
  const { routesStore } = state;
  if (routesStore.filtrationResults[0]) {
    return routesStore.filtrationResults[0].numOfPages;
  }
  return 0;
};

export default getNumOfPages;
