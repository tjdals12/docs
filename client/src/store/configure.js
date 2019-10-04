import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import * as modules from './modules';
import penderMiddleware from 'redux-pender';

const reducer = combineReducers(modules);
const middlewares = [ penderMiddleware() ];

const isDev = process.env.NODE_ENV === 'development';
const devTools = isDev && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = devTools || compose;

const configure = (preloadState) =>
	createStore(reducer, preloadState, composeEnhancers(applyMiddleware(...middlewares)));

export default configure;
