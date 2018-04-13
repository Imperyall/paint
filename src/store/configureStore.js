import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';

const DEFAULT_STATE = {
  shapes: [],
  shape: [],
  drawingMode: null,
  purpose: '',
  config_id: 0,
};

function configureStoreProd(initialState) {
  const middlewares = [
    // Add other middleware on this line...

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    thunk,
  ];

  const newState = { ...DEFAULT_STATE, ...initialState};
  return createStore(rootReducer, newState, compose(
    applyMiddleware(...middlewares)
    )
  );
}

function configureStoreDev(initialState) {
  const logger = createLogger();

  const middlewares = [
    // Add other middleware on this line...

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    thunk,
    logger,
  ];

  const options = {
    // serialize: { 
    //   options: {
    //    undefined: true,
    //    function: function(fn) { return fn.toString() }
    //   }
    // },
    latency: 0
  };

  const newState = { ...DEFAULT_STATE, ...initialState};
  //const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
  const composeEnhancers = composeWithDevTools(options);
  const store = createStore(rootReducer, newState, composeEnhancers(
    applyMiddleware(...middlewares)
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

const configureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

export default configureStore;