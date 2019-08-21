import * as R from 'ramda';

export const isNeeded = (exifAngle) => {
  if (exifAngle === 0) { return false; }
  return true;
};

export const fixRoutePhotoUpdateParams = (exifAngle, photoParams) => {
  const newPhotoParams = R.clone(photoParams);
  newPhotoParams.rotate -= exifAngle;
  return newPhotoParams;
};
