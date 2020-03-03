import * as R from 'ramda';
import { CLIENT_ID, REDIRECT_URI } from '@/v1/Constants/Vk';
import closeForm from '@/v2/utils/closeForm';


export const enterWithVk = (type, token) => {
  const params = {
    client_id: CLIENT_ID,
    scope: 'email%2Cphotos',
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    v: '5.74',
    state: JSON.stringify({
      method: type,
      token,
    }),
  };

  window.open(
    `https://oauth.vk.com/authorize?${R.join('&')(R.map(v => `${v[0]}=${v[1]}`)(R.toPairs(params)))}`,
    'VK',
    'resizable,scrollbars,status',
  );

  window.addEventListener('message', afterVkEnter);
};

export const afterVkEnter = (ev) => {
  if (ev.data.result !== 'success') {
    return;
  }
  ev.source.close();
  //store.dispatch(signIn());
  closeForm();
  window.removeEventListener('message', afterVkEnter);
};
