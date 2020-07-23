import * as R from 'ramda';
import { enterWithVk } from '../vk';
import * as environ from '@/v1/Environ';
import * as VkConstants from '@/v1/Constants/Vk';

delete window.location;
window.location = { origin: 'http://localhost' };

describe(
  'enterWithVk',
  () => {
    const windowOpenCallback = jest.fn();

    beforeEach(() => {
      window.open = windowOpenCallback;
      window.eventListener = 'window.EventListener';
      jest.mock('@/v1/Constants/Vk');
      VkConstants.REDIRECT_URI_PATH = '/foo/baz/bar';
      VkConstants.CLIENT_ID = '12345';

      windowOpenCallback.mockReset();
    });

    R.map(
      locationOrigin => {
        describe(
          `location.origin=${locationOrigin}`,
          () => {
            it(
              'ApiUrl is relative',
              () => {
                environ.ApiUrl = '/api';
                window.location.origin = locationOrigin;

                enterWithVk('login', 'foobar');

                expect(windowOpenCallback.mock.calls.length).toBe(1);
                expect(windowOpenCallback.mock.calls[0][0]).toBe(
                  'https://oauth.vk.com/authorize?'
                  + 'client_id=12345&'
                  + 'scope=email%2Cphotos&'
                  + `redirect_uri=${locationOrigin}/api/foo/baz/bar&`
                  + 'response_type=code&'
                  + 'v=5.74&'
                  + 'state={"method":"login","token":"foobar"}',
                );
              },
            );

            it(
              'ApiUrl is absolute with protocol=https',
              () => {
                environ.ApiUrl = 'https://foobar.ru/api';
                window.location.origin = locationOrigin;

                enterWithVk('login', 'foobar');

                expect(windowOpenCallback.mock.calls.length).toBe(1);
                expect(windowOpenCallback.mock.calls[0][0]).toBe(
                  'https://oauth.vk.com/authorize?'
                  + 'client_id=12345&'
                  + 'scope=email%2Cphotos&'
                  + 'redirect_uri=https://foobar.ru/api/foo/baz/bar&'
                  + 'response_type=code&'
                  + 'v=5.74&'
                  + 'state={"method":"login","token":"foobar"}',
                );
              },
            );

            it(
              'ApiUrl is absolute with protocol=http',
              () => {
                environ.ApiUrl = 'http://foobar.ru/api';
                window.location.origin = locationOrigin;

                enterWithVk('login', 'foobar');

                expect(windowOpenCallback.mock.calls.length).toBe(1);
                expect(windowOpenCallback.mock.calls[0][0]).toBe(
                  'https://oauth.vk.com/authorize?'
                  + 'client_id=12345&'
                  + 'scope=email%2Cphotos&'
                  + 'redirect_uri=http://foobar.ru/api/foo/baz/bar&'
                  + 'response_type=code&'
                  + 'v=5.74&'
                  + 'state={"method":"login","token":"foobar"}',
                );
              },
            );
          },
        );
      },
    )(['https://rovingclimbers.ru', 'http://localhost:3042']);
  },
);
