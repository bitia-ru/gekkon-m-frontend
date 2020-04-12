import Axios from 'axios';
import * as R from 'ramda';
import Qs from 'qs';
import {
  loadRoutesRequest,
  loadRoutesFailed,
  loadRoutesSuccess,
  loadFiltrationResults,
  loadRouteSuccess,
  loadRouteDataSuccess,
  removeRoutePropertyByIdSuccess,
  loadRoutePropertySuccess,
  removeRouteSuccess,
} from './actions';
import CARDS_PER_PAGE from '../../Constants/RouteCardTable';
import getObjectFromArray from '../../utils/getObjectFromArray';
import { ApiUrl } from '../../Environ';

Axios.interceptors.request.use(
  config => ({
    ...config,
    paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'brackets' }),
  }),
);

const flatten = (arr) => {
  if (arr.length === 0) {
    return [];
  }
  return R.map(e => R.concat([e], flatten(e.route_comments)), arr);
};

const formattedCommentsData = data => R.map(
  comment => ({
    ...comment,
    route_comments: R.flatten(flatten(comment.route_comments)),
  }),
  data,
);

const prepareRoute = route => ({
  ...route,
  ...(route.ascents && { ascents: getObjectFromArray(route.ascents) }),
  ...(route.comments && { comments: formattedCommentsData(route.comments) }),
  ...(route.likes && { likes: getObjectFromArray(route.likes) }),
});

const prepareAllRoutes = routes => (
  R.map(
    prepareRoute,
    routes,
  )
);

export const loadRoutes = (url, params) => (
  (dispatch) => {
    dispatch(loadRoutesRequest());

    Axios.get(
      url,
      { params: { ...params, with: ['ascents'] }, withCredentials: true },
    )
      .then((response) => {
        const routeIds = R.map(route => route.id, response.data.payload);
        const numOfPages = Math.max(
          1, Math.ceil(response.data.metadata.all / CARDS_PER_PAGE),
        );
        dispatch(loadFiltrationResults(0, { routeIds, numOfPages }));
        dispatch(loadRoutesSuccess(prepareAllRoutes(response.data.payload)));
      }).catch((error) => {
        dispatch(loadRoutesFailed());
        // dispatch(pushError(error));
      });
  }
);

export const loadRoute = (url, afterLoad) => (
  (dispatch) => {
    dispatch(loadRoutesRequest());

    const params = { with: ['comments', 'likes', 'ascents'] };
    Axios.get(url, { params, withCredentials: true })
      .then((response) => {
        dispatch(loadRouteSuccess(prepareRoute(response.data.payload)));
        if (afterLoad) {
          afterLoad(response);
        }
      }).catch((error) => {
        dispatch(loadRoutesFailed());
        // dispatch(pushError(error));
      });
  }
);

export const removeLike = (url, afterAll) => (
  (dispatch) => {
    dispatch(loadRoutesRequest());

    Axios({
      url,
      method: 'delete',
      config: { withCredentials: true },
    })
      .then((response) => {
        dispatch(removeRoutePropertyByIdSuccess(
          response.data.payload.route_id,
          'likes',
          response.data.payload.id,
        ));
        afterAll();
      }).catch((error) => {
        dispatch(loadRoutesFailed());
        // dispatch(pushError(error));
        afterAll();
      });
  }
);

export const addRoute = (params, afterSuccess, afterAll) => (
  (dispatch) => {
    dispatch(loadRoutesRequest());

    Axios({
      url: `${ApiUrl}/v1/routes`,
      method: 'post',
      data: params,
      config: { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true },
    })
      .then((response) => {
        dispatch(loadRouteSuccess(response.data.payload));
        afterSuccess(response);
        afterAll();
      }).catch((error) => {
        dispatch(loadRoutesFailed());
        // dispatch(pushError(error));
        afterAll();
      });
  }
);

export const updateRoute = (url, params, afterSuccess, afterAll) => (
  (dispatch) => {
    dispatch(loadRoutesRequest());

    Axios({
      url,
      method: 'patch',
      data: params,
      config: { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true },
    })
      .then((response) => {
        dispatch(loadRouteSuccess(response.data.payload));
        afterSuccess(response);
        afterAll();
      }).catch((error) => {
        dispatch(loadRoutesFailed());
        // dispatch(pushError(error));
        afterAll();
      });
  }
);

export const removeRoute = (url, afterSuccess) => (
  (dispatch) => {
    dispatch(loadRoutesRequest());

    Axios({
      url,
      method: 'delete',
      config: { withCredentials: true },
    })
      .then((response) => {
        dispatch(removeRouteSuccess(response.data.payload.id));
        afterSuccess(response);
      }).catch((error) => {
        dispatch(loadRoutesFailed());
        // dispatch(pushError(error));
      });
  }
);

export const addLike = (params, afterAll) => (
  (dispatch) => {
    dispatch(loadRoutesRequest());

    Axios.post(
      `${ApiUrl}/v1/likes`,
      params,
      { withCredentials: true },
    )
      .then((response) => {
        dispatch(loadRoutePropertySuccess(
          response.data.payload.route_id,
          'likes',
          response.data.payload,
        ));
        afterAll();
      }).catch((error) => {
        dispatch(loadRoutesFailed());
        // dispatch(pushError(error));
        afterAll();
      });
  }
);

export const addAscent = params => (
  (dispatch) => {
    dispatch(loadRoutesRequest());

    Axios.post(
      `${ApiUrl}/v1/ascents`,
      params,
      { withCredentials: true },
    )
      .then((response) => {
        dispatch(loadRoutePropertySuccess(
          response.data.payload.route_id,
          'ascents',
          response.data.payload,
        ));
      }).catch((error) => {
        dispatch(loadRoutesFailed());
        // dispatch(pushError(error));
      });
  }
);

export const updateAscent = (url, params) => (
  (dispatch) => {
    dispatch(loadRoutesRequest());

    Axios({
      url,
      method: 'patch',
      params,
      config: { withCredentials: true },
    })
      .then((response) => {
        dispatch(loadRoutePropertySuccess(
          response.data.payload.route_id,
          'ascents',
          response.data.payload,
        ));
      }).catch((error) => {
        dispatch(loadRoutesFailed());
        // dispatch(pushError(error));
      });
  }
);

export const addComment = (params, afterSuccess) => (
  (dispatch, getState) => {
    const state = getState();
    const { routes } = state.routesStore;
    dispatch(loadRoutesRequest());

    Axios.post(
      `${ApiUrl}/v1/route_comments`,
      params,
      { withCredentials: true },
    )
      .then((response) => {
        const comment = response.data.payload;
        const { comments, numOfComments } = routes[comment.route_id];
        let commentsNew = R.clone(comments);
        if (comment.route_comment_id === null) {
          commentsNew = R.append(comment, commentsNew);
        } else {
          const parentCommentIndex = R.findIndex(
            c => comment.route_comment_id === c.id || R.contains(
              comment.route_comment_id, R.map(rc => rc.id, c.route_comments),
            ),
          )(comments);
          commentsNew[parentCommentIndex].route_comments = R.append(
            comment, commentsNew[parentCommentIndex].route_comments,
          );
        }
        dispatch(
          loadRouteDataSuccess(
            comment.route_id,
            { comments: commentsNew, numOfComments: numOfComments + 1 },
          ),
        );
        if (afterSuccess) {
          afterSuccess();
        }
      }).catch((error) => {
        dispatch(loadRoutesFailed());
        // dispatch(pushError(error));
      });
  }
);

export const removeComment = url => (
  (dispatch, getState) => {
    const state = getState();
    const { routes } = state.routesStore;
    dispatch(loadRoutesRequest());

    Axios({
      url,
      method: 'delete',
      config: { withCredentials: true },
    })
      .then((response) => {
        const comment = response.data.payload;
        const { comments, numOfComments } = routes[comment.route_id];
        let commentsNew = R.clone(comments);
        let numOfCommentsNew;
        if (comment.route_comment_id === null) {
          const index = R.findIndex(c => c.id === comment.id)(commentsNew);
          numOfCommentsNew = numOfComments - commentsNew[index].route_comments.length - 1;
          commentsNew = R.remove(index, 1, commentsNew);
        } else {
          const parentCommentIndex = R.findIndex(
            c => R.contains(
              comment.id, R.map(rc => rc.id, c.route_comments),
            ),
          )(comments);
          const isChildComment = (id) => {
            let currentComment;
            const index = R.findIndex(c => c.id === id)(comments);
            if (index === -1) {
              const parentIndex = R.findIndex(
                c => R.contains(
                  id, R.map(rc => rc.id, c.route_comments),
                ),
              )(comments);
              currentComment = R.find(
                c => c.id === id,
              )(comments[parentIndex].route_comments);
            } else {
              currentComment = comments[index];
            }
            if (currentComment.route_comment_id === comment.id) {
              return true;
            }
            if (currentComment.route_comment_id === null) {
              return false;
            }
            return isChildComment(currentComment.route_comment_id);
          };
          numOfCommentsNew = numOfComments - R.filter(
            rc => isChildComment(rc.id),
            commentsNew[parentCommentIndex].route_comments,
          ).length - 1;
          commentsNew[parentCommentIndex].route_comments = R.reject(
            c => c.id === comment.id || isChildComment(c.id),
            commentsNew[parentCommentIndex].route_comments,
          );
        }
        dispatch(
          loadRouteDataSuccess(
            comment.route_id,
            { comments: commentsNew, numOfComments: numOfCommentsNew },
          ),
        );
      }).catch((error) => {
        dispatch(loadRoutesFailed());
        // dispatch(pushError(error));
      });
  }
);
