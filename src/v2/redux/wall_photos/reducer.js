import * as R from 'ramda';
import { acts } from './actions';


const routePhotosReducer = (
  state = {},
  action,
) => {
  switch (action.type) {
  case acts.LOAD_PHOTOS_SUCCESS:
    return {
      ...state,
      ...R.reduce((l, u) => ({ ...l, [u.id]: u }), {})(action.route_photos),
    };
  case acts.LOAD_PHOTO_SUCCESS:
    return {
      ...state,
      [action.routePhoto.id]: action.routePhoto,
    };
  default:
    return state;
  }
};

export default routePhotosReducer;
