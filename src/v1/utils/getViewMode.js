import * as R from 'ramda';
import {
  DEFAULT_SECTOR_VIEW_MODE_LIST,
  DEFAULT_SPOT_VIEW_MODE,
} from '../Constants/ViewModeSwitcher';
import store from '../store';

const getViewMode = (sectors, selectedViewModes, spotId, sectorId) => {
  const currSector = sectors ? sectors[sectorId] : undefined;
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
