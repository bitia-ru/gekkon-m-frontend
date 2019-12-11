import * as acts from './constants/actions';

export const loadSectorsRequest = () => ({
  type: acts.LOAD_SECTORS_REQUEST,
});

export const loadSectorsFailed = () => ({
  type: acts.LOAD_SECTORS_FAILED,
});

export const loadSectorSuccess = sector => ({
  type: acts.LOAD_SECTOR_SUCCESS,
  sector,
});

export const loadSectors = sectors => ({
  type: acts.LOAD_SECTORS,
  sectors,
});
