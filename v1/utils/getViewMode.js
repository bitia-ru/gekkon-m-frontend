import * as R from 'ramda';
import {
  DEFAULT_SECTOR_VIEW_MODE_LIST,
  DEFAULT_SPOT_VIEW_MODE,
} from '../../src/Constants/ViewModeSwitcher';
import store from '../store';

const getViewMode = (spotId, sectorId) => {
  const state = store.getState();
  const { sectors } = state.sectorsStore;
  const { selectedViewModes } = state;
  const currSector = sectors[sectorId];
  if (selectedViewModes && selectedViewModes[spotId] && selectedViewModes[spotId][sectorId]) {
    return selectedViewModes[spotId][sectorId];
  }
  if (sectorId === 0) {
    return DEFAULT_SPOT_VIEW_MODE;
  }
  if (currSector && currSector.diagram) {
    return DEFAULT_SECTOR_VIEW_MODE_LIST[0];
  }
  return R.last(DEFAULT_SECTOR_VIEW_MODE_LIST);
};

export default getViewMode;
