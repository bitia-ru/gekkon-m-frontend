// eslint-disable-next-line import/newline-after-import,import/order
import { SentryDsn } from './Environ';
Sentry.init({ dsn: SentryDsn }); // eslint-disable-line no-undef

/* eslint-disable import/first */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Main from './Main';
import { configureStoreAsync, saveState } from './store';
import ErrorBoundary from '@/ErrorBoundary';
import ExceptionTestComponent from '@/v2/utils/ExceptionTestComponent';
import './index.css';
import './fonts.css';
/* eslint-enable import/first */

const EVENTS_TO_MODIFY = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel'];

const originalAddEventListener = document.addEventListener.bind();
document.addEventListener = (type, listener, options, wantsUntrusted) => {
  let modOptions = options;
  if (EVENTS_TO_MODIFY.includes(type)) {
    if (typeof options === 'boolean') {
      modOptions = {
        capture: options,
        passive: false,
      };
    } else if (typeof options === 'object') {
      modOptions = {
        passive: false,
        ...options,
      };
    }
  }

  return originalAddEventListener(type, listener, modOptions, wantsUntrusted);
};

const originalRemoveEventListener = document.removeEventListener.bind();
document.removeEventListener = (type, listener, options) => {
  let modOptions = options;
  if (EVENTS_TO_MODIFY.includes(type)) {
    if (typeof options === 'boolean') {
      modOptions = {
        capture: options,
        passive: false,
      };
    } else if (typeof options === 'object') {
      modOptions = {
        passive: false,
        ...options,
      };
    }
  }
  return originalRemoveEventListener(type, listener, modOptions);
};

configureStoreAsync().then((result) => {
  const store = result;
  store.subscribe(() => {
    saveState(store.getState());
  });
  ReactDOM.render(
    (
      <ErrorBoundary>
        <Provider store={store}>
          <BrowserRouter>
            <Route path="/debug/test_exception_handler" component={ExceptionTestComponent} />
            <Main />
          </BrowserRouter>
        </Provider>
      </ErrorBoundary>
    ),
    document.getElementById('app'),
  );
});
