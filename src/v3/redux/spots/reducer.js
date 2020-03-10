import * as R from 'ramda';
import { acts } from './actions';


const spotsReducer = (
  state = {},
  action,
) => {
  switch (action.type) {
  case acts.LOAD_SPOTS:
    return {
      ...state,
      ...R.reduce((l, u) => ({ ...l, [u.id]: u }), {})(action.spots),
    };
  default:
    return state;
  }
};

export default spotsReducer;
