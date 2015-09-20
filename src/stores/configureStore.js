import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';
import { devTools, persistState } from 'redux-devtools';

const devStore = compose(
  // Enables your middleware:
  applyMiddleware(thunk),
  // Provides support for DevTools:
  devTools(),
  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);

const regularStore = compose(
  // Enables your middleware:
  applyMiddleware(thunk),
)(createStore);

export default function configureStore() {
  const store = __DEV__ ? devStore(rootReducer) : regularStore(rootReducer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }
  return store;
}
