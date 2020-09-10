import * as R from 'ramda';
import Api from '../../utils/Api';
import { CARDS_PER_PAGE } from '@/v1/Constants/RouteCardTable';
import getObjectFromArray from '@/v1/utils/getObjectFromArray';
import toastHttpError from '@/v2/utils/toastHttpError';
import { loadRoutesRequest } from '@/v1/stores/routes/actions';

export const acts = {
  LOAD_ROUTES_REQUEST: 'LOAD_ROUTES_REQUEST_V2',
  LOAD_ROUTES_FAILED: 'LOAD_ROUTES_FAILED_V2',
  LOAD_ROUTES_SUCCESS: 'LOAD_ROUTES_SUCCESS_V2',
  LOAD_ROUTE_SUCCESS: 'LOAD_ROUTE_SUCCESS_V2',
  LOAD_ROUTE_DATA_SUCCESS: 'LOAD_ROUTE_DATA_SUCCESS_V2',
  LOAD_ROUTE_PROPERTY_SUCCESS: 'LOAD_ROUTE_PROPERTY_SUCCESS_V2',
  REMOVE_ROUTE_PROPERTY_BY_ID_SUCCESS: 'REMOVE_ROUTE_PROPERTY_BY_ID_SUCCESS_V2',
  REMOVE_ROUTE_SUCCESS: 'REMOVE_ROUTE_SUCCESS_V2',
  LOAD_FILTRATION_RESULTS: 'LOAD_FILTRATION_RESULTS_V2',
};

const flatten = (arr) => {
  if (arr.length === 0) {
    return [];
  }
  return R.map(e => R.concat([e], flatten(e.route_comments)), arr);
};

const formattedCommentsData = data => (R.map((comment) => {
  const c = R.clone(comment);
  c.route_comments = R.flatten(flatten(c.route_comments));
  return c;
}, data));

const prepareAscentsForRoute = (route) => {
  const routeCopy = R.clone(route);
  routeCopy.ascents = getObjectFromArray(routeCopy.ascents);
  return routeCopy;
};

const prepareCommentsForRoute = (route) => {
  const routeCopy = R.clone(route);
  routeCopy.comments = formattedCommentsData(routeCopy.comments);
  return routeCopy;
};

const prepareLikesForRoute = (route) => {
  const routeCopy = R.clone(route);
  routeCopy.likes = getObjectFromArray(routeCopy.likes);
  return routeCopy;
};

const prepareRoute = (route) => {
  let routeNew = R.clone(route);
  if (route.ascents) {
    routeNew = prepareAscentsForRoute(routeNew);
  }
  if (route.comments) {
    routeNew = prepareCommentsForRoute(routeNew);
  }
  if (route.likes) {
    routeNew = prepareLikesForRoute(routeNew);
  }
  return routeNew;
};

const prepareAllRoutes = routes => (
  R.map(
    prepareRoute,
    routes,
  )
);

export const loadRoutes = (url, params) => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_ROUTES_REQUEST,
    });

    const paramsCopy = R.clone(params);
    paramsCopy.with = ['ascents'];
    Api.get(
      url,
      {
        params: paramsCopy,
        success(payload, metadata) {
          const routeIds = R.map(route => route.id, payload);
          const numOfPages = Math.max(
            1, Math.ceil(metadata.all / CARDS_PER_PAGE),
          );
          dispatch({
            type: acts.LOAD_FILTRATION_RESULTS,
            filtersKey: 0,
            filtrationResults: { routeIds, numOfPages },
          });
          dispatch({
            type: acts.LOAD_ROUTES_SUCCESS,
            routes: prepareAllRoutes(payload),
          });
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_ROUTES_FAILED,
          });

          toastHttpError(error);
        },
      },
    );
  }
);

export const loadRoute = (id, afterLoad) => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_ROUTES_REQUEST,
    });

    const params = { with: ['comments', 'likes', 'ascents'] };
    Api.get(
      `/v1/routes/${id}`,
      {
        params,
        success(payload) {
          dispatch({
            type: acts.LOAD_ROUTE_SUCCESS,
            route: prepareRoute(payload),
          });
          if (afterLoad) {
            afterLoad(payload);
          }
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_ROUTES_FAILED,
          });

          toastHttpError(error);
        },
      },
    );
  }
);

export const removeLike = (id, afterAll) => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_ROUTES_REQUEST,
    });

    Api.post(
      `/v1/likes/${id}`,
      null,
      {
        method: 'delete',
        success(payload) {
          dispatch({
            type: acts.REMOVE_ROUTE_PROPERTY_BY_ID_SUCCESS,
            routeId: payload.route_id,
            routePropertyName: 'likes',
            routePropertyId: payload.id,
          });
          afterAll();
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_ROUTES_FAILED,
          });
          afterAll();

          toastHttpError(error);
        },
      },
    );
  }
);

export const addRoute = (params, afterSuccess, afterAll) => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_ROUTES_REQUEST,
    });

    Api.post(
      '/v1/routes',
      params,
      {
        method: 'post',
        type: 'form-multipart',
        success(payload) {
          dispatch({
            type: acts.LOAD_ROUTE_SUCCESS,
            route: prepareRoute(payload),
          });
          afterSuccess(payload);
          afterAll();
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_ROUTES_FAILED,
          });
          afterAll();

          toastHttpError(error);
        },
      },
    );
  }
);

export const updateRoute = (id, params, afterSuccess, afterAll) => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_ROUTES_REQUEST,
    });

    Api.post(
      `/v1/routes/${id}`,
      params,
      {
        method: 'patch',
        type: 'form-multipart',
        success(payload) {
          dispatch({
            type: acts.LOAD_ROUTE_SUCCESS,
            route: prepareRoute(payload),
          });
          afterSuccess(payload);
          afterAll();
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_ROUTES_FAILED,
          });
          afterAll();

          toastHttpError(error);
        },
      },
    );
  }
);

export const removeRoute = (id, afterSuccess) => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_ROUTES_REQUEST,
    });

    Api.post(
      `/v1/routes/${id}`,
      null,
      {
        method: 'delete',
        success(payload) {
          dispatch({
            type: acts.REMOVE_ROUTE_SUCCESS,
            routeId: payload.id,
          });
          afterSuccess(payload);
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_ROUTES_FAILED,
          });

          toastHttpError(error);
        },
      },
    );
  }
);

export const addLike = (params, afterAll) => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_ROUTES_REQUEST,
    });

    Api.post(
      '/v1/likes',
      params,
      {
        method: 'post',
        success(payload) {
          dispatch({
            type: acts.LOAD_ROUTE_PROPERTY_SUCCESS,
            routeId: payload.route_id,
            routePropertyName: 'likes',
            routePropertyData: payload,
          });
          afterAll();
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_ROUTES_FAILED,
          });
          afterAll();

          toastHttpError(error);
        },
      },
    );
  }
);

export const addAscent = (params, afterSuccess) => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_ROUTES_REQUEST,
    });

    Api.post(
      '/v1/ascents',
      params,
      {
        method: 'post',
        type: 'form-multipart',
        success(payload) {
          dispatch({
            type: acts.LOAD_ROUTE_PROPERTY_SUCCESS,
            routeId: payload.route_id,
            routePropertyName: 'ascents',
            routePropertyData: payload,
          });
          afterSuccess();
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_ROUTES_FAILED,
          });

          toastHttpError(error);
        },
      },
    );
  }
);

export const updateAscent = (id, params, afterSuccess) => (
  (dispatch) => {
    dispatch({
      type: acts.LOAD_ROUTES_REQUEST,
    });

    Api.post(
      `/v1/ascents/${id}`,
      params,
      {
        method: 'patch',
        type: 'form-multipart',
        success(payload) {
          dispatch({
            type: acts.LOAD_ROUTE_PROPERTY_SUCCESS,
            routeId: payload.route_id,
            routePropertyName: 'ascents',
            routePropertyData: payload,
          });
          afterSuccess();
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_ROUTES_FAILED,
          });

          toastHttpError(error);
        },
      },
    );
  }
);

export const removeAscent = (id, afterSuccess) => (
  (dispatch) => {
    Api.post(
      `/v1/ascents/${id}`,
      null,
      {
        method: 'delete',
        success(payload) {
          dispatch({
            type: acts.REMOVE_ROUTE_PROPERTY_BY_ID_SUCCESS,
            routeId: payload.route_id,
            routePropertyName: 'ascents',
            routePropertyId: payload.id,
          });
          afterSuccess();
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_ROUTES_FAILED,
          });
        },
      },
    );
  }
);

export const addComment = (params, afterSuccess) => (
  (dispatch, getState) => {
    const state = getState();
    const { routes } = state.routesStoreV2;
    dispatch({
      type: acts.LOAD_ROUTES_REQUEST,
    });

    Api.post(
      '/v1/route_comments',
      params,
      {
        method: 'post',
        success(payload) {
          const comment = payload;
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
          dispatch({
            type: acts.LOAD_ROUTE_DATA_SUCCESS,
            routeId: comment.route_id,
            routeData: { comments: commentsNew, numOfComments: numOfComments + 1 },
          });
          if (afterSuccess) {
            afterSuccess();
          }
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_ROUTES_FAILED,
          });

          toastHttpError(error);
        },
      },
    );
  }
);

export const removeComment = id => (
  (dispatch, getState) => {
    const state = getState();
    const { routes } = state.routesStoreV2;
    dispatch({
      type: acts.LOAD_ROUTES_REQUEST,
    });

    Api.post(
      `/v1/route_comments/${id}`,
      null,
      {
        method: 'delete',
        success(payload) {
          const comment = payload;
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
          dispatch({
            type: acts.LOAD_ROUTE_DATA_SUCCESS,
            routeId: comment.route_id,
            routeData: { comments: commentsNew, numOfComments: numOfCommentsNew },
          });
        },
        failed(error) {
          dispatch({
            type: acts.LOAD_ROUTES_FAILED,
          });

          toastHttpError(error);
        },
      },
    );
  }
);
