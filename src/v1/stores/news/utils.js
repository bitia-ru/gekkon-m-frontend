import Axios from 'axios';
import { ApiUrl } from '../../Environ';
import {
  loadNewsRequest,
  loadNewsFailed,
  loadNewsSuccess,
} from './actions';
import toastHttpError from '@/v2/utils/toastHttpError';

export const loadNews = params => (
  (dispatch) => {
    dispatch(loadNewsRequest());

    Axios.get(`${ApiUrl}/v1/news`, { params, withCredentials: true })
      .then((response) => {
        dispatch(loadNewsSuccess(response.data));
      }).catch((error) => {
        dispatch(loadNewsFailed());

        if (error.response?.status !== 501) {
          toastHttpError(error);
        }
      });
  }
);
