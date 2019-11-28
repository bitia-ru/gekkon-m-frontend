import Axios from 'axios';
import store from '../store';
import { ApiUrl } from '../../src/Environ';
import {
  decreaseNumOfActiveRequests,
  increaseNumOfActiveRequests,
  setRoute,
  setRouteData,
} from '../../src/actions';
import getObjectFromArray from './getObjectFromArray';
import * as R from "ramda";

export const loadRoute = (id, afterSuccess, afterFail) => {
  store.dispatch(increaseNumOfActiveRequests());
  Axios.get(`${ApiUrl}/v1/routes/${id}`)
    .then((response) => {
      store.dispatch(decreaseNumOfActiveRequests());
      store.dispatch(setRoute(response.data.payload));
      if (afterSuccess) {
        afterSuccess(response);
      }
    }).catch((error) => {
      store.dispatch(decreaseNumOfActiveRequests());
      if (afterFail) {
        afterFail(error);
      }
    });
};

export const reloadAscents = (routeId, afterSuccess, afterFail) => {
  store.dispatch(increaseNumOfActiveRequests());
  Axios.get(`${ApiUrl}/v1/routes/${routeId}/ascents`)
    .then((response) => {
      store.dispatch(decreaseNumOfActiveRequests());
      store.dispatch(
        setRouteData(
          routeId,
          {
            ascents: getObjectFromArray(response.data.payload),
          },
        ),
      );
      if (afterSuccess) {
        afterSuccess(response);
      }
    }).catch((error) => {
      store.dispatch(decreaseNumOfActiveRequests());
      if (afterFail) {
        afterFail(error);
      }
    });
};

const flatten = (arr) => {
  if (arr.length === 0) {
    return [];
  }
  return R.map(e => R.concat([e], flatten(e.route_comments)), arr);
};

const formattedCommentsData = (data) => {
  return R.map((comment) => {
    const c = R.clone(comment);
    c.route_comments = R.flatten(flatten(c.route_comments));
    return c;
  }, data);
};

export const reloadComments = (routeId, afterSuccess, afterFail) => {
  store.dispatch(increaseNumOfActiveRequests());
  Axios.get(`${ApiUrl}/v1/routes/${routeId}/route_comments`)
    .then((response) => {
      store.dispatch(decreaseNumOfActiveRequests());
      store.dispatch(
        setRouteData(
          routeId,
          {
            comments: formattedCommentsData(response.data.payload),
            numOfComments: response.data.metadata.all,
          },
        ),
      );
      if (afterSuccess) {
        afterSuccess(response);
      }
    }).catch((error) => {
      store.dispatch(decreaseNumOfActiveRequests());
      if (afterFail) {
        afterFail(error);
      }
    });
};

export const reloadLikes = (routeId, afterSuccess, afterFail) => {
  store.dispatch(increaseNumOfActiveRequests());
  Axios.get(`${ApiUrl}/v1/routes/${routeId}/likes`)
    .then((response) => {
      store.dispatch(decreaseNumOfActiveRequests());
      store.dispatch(
        setRouteData(
          routeId,
          {
            likes: getObjectFromArray(response.data.payload),
          },
        ),
      );
      if (afterSuccess) {
        afterSuccess(response);
      }
    }).catch((error) => {
      store.dispatch(decreaseNumOfActiveRequests());
      store.dispatch(setRouteData(routeId, { likeBtnIsBusy: false }));
      if (afterFail) {
        afterFail(error);
      }
    });
};
