import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'gModules/reducers.js';
// import { devTools, persistState } from 'redux-devtools';
import { call, put, takeEvery, takeLatest } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'
import {dispatchCatchSaga} from './sagas.js'

const sagaMiddleware = createSagaMiddleware()
const devStore = compose(
  // Enables your middleware:
  applyMiddleware(thunk),
  applyMiddleware(sagaMiddleware)
  // Provides support for DevTools:
  // devTools(),
  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  // persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);

const regularStore = compose(
  // Enables your middleware:
  applyMiddleware(thunk),
  applyMiddleware(sagaMiddleware),
)(createStore);

export default function configureStore() {
  const store = __DEV__ ? devStore(rootReducer) : regularStore(rootReducer);
  sagaMiddleware.run(dispatchCatchSaga)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('gModules/reducers', () => {
      const nextReducer = require('gModules/reducers');
      store.replaceReducer(nextReducer);
    });
  }
  return store;
}
