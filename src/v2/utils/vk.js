import * as R from 'ramda';
import { ApiUrl } from '@/v1/Environ';
import { CLIENT_ID, REDIRECT_URI_PATH } from '@/v1/Constants/Vk';
import closeForm from '@/v2/utils/closeForm';

const redirectUri = () => (
  ApiUrl.match(/^https?:\/\/.*/) ? (
    `${ApiUrl}${REDIRECT_URI_PATH}`
  ) : (
    `${window.location.origin}${ApiUrl}${REDIRECT_URI_PATH}`
  )
);

const params = (type, token) => ({
  client_id: CLIENT_ID,
  scope: 'email%2Cphotos',
  redirect_uri: redirectUri(),
  response_type: 'code',
  v: '5.74',
  state: JSON.stringify({
    method: type,
    token,
  }),
});

const paramsSerialized = (type, token) => (
  R.join('&')(
    R.map(v => `${v[0]}=${v[1]}`)(
      R.toPairs(params(type, token)),
    ),
  )
);

export const afterVkEnter = (ev) => {
  if (ev.data.result !== 'success') {
    return;
  }
  ev.source.close();
  closeForm();
  window.removeEventListener('message', afterVkEnter);
};

export const enterWithVk = (type, token) => {
  window.open(
    `https://oauth.vk.com/authorize?${paramsSerialized(type, token)}`,
    'VK',
    'resizable,scrollbars,status',
  );

  window.addEventListener('message', afterVkEnter);
};
