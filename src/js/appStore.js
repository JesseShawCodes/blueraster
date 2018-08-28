import { asyncActions } from 'js/utils/middleware';
import { createStore, applyMiddleware } from 'redux';
import appReducer from 'js/reducers/appReducer';
import logger from 'redux-logger';

const middleware = [asyncActions, logger];

const store = createStore(
  appReducer,
  applyMiddleware(...middleware)
);

export default store;
