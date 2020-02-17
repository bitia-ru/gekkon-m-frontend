import * as acts from './constants/actions';

export const loadNewsRequest = () => ({
  type: acts.LOAD_NEWS_REQUEST,
});

export const loadNewsFailed = () => ({
  type: acts.LOAD_NEWS_FAILED,
});

export const loadNewsSuccess = news => ({
  type: acts.LOAD_NEWS_SUCCESS,
  news,
});
