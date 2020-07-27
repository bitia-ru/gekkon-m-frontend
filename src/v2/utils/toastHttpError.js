import showToastr from './showToastr';

const toastHttpError = (error) => {
  if (!error?.response) {
    showToastr('Неожиданная ошибка', { type: 'error' });
    return;
  }

  if (error.response.status === 404) {
    showToastr(error.response.data?.message || 'Неожиданная ошибка (код 404)', { type: 'error' });
    return;
  }

  if (error.response.status === 401) {
    showToastr(error.response.data || 'Неожиданная ошибка (код 401)', { type: 'error' });
    return;
  }

  showToastr(`Неожиданная ошибка (код ${error.response.status})`, { type: 'error' });
};

export default toastHttpError;
