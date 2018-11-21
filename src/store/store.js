import { createStore, applyMiddleware } from 'redux';
// import { combineReducers } from 'redux-immutablejs';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
// import Immutable from 'immutable';
import rootReducer from '../reducers';

const loggerMiddleware = createLogger();
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware, loggerMiddleware))
);
export default store;
