const getNumOfPages = state => (
  state.routesStoreV2?.filtrationResults[0]?.numOfPages || 0
);

export default getNumOfPages;
