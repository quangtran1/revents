import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducer/rootReducer';
//preloadedState:  initial State
export const configureStore = preloadedState => {
  const middlewares = [];

  const middlewareEnhancer = applyMiddleware(...middlewares);

  const storeEnhancer = [middlewareEnhancer];

  const composedEnhancer = composeWithDevTools(...storeEnhancer);

  const store = createStore(rootReducer, preloadedState, composedEnhancer);

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('../reducer/rootReducer.js', () => {
        const newRootReducer = require('../reducer/rootReducer').default;
        store.replaceReducer(newRootReducer);
      });
    }
  }

  return store;
};
