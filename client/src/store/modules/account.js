import { Map, fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as api from 'lib/api';

const LOGIN = 'account/LOGIN';
const CHECK = 'account/CHECK';
const LOGOUT = 'account/LOGOUT';
const SET_USER_INFO = 'account/SET_USER_INFO';
const SET_VALIDATED = 'account/SET_VALIDATED';

export const login = createAction(LOGIN, api.login);
export const check = createAction(CHECK, api.check);
export const logout = createAction(LOGOUT, api.logout);
export const setUserInfo = createAction(SET_USER_INFO);
export const setValidated = createAction(SET_VALIDATED);

const initialState = Map({
    userInfo: Map(),
    logged: false,
    validated: false,
    result: Map(),
    error: false
});

export default handleActions({
    ...pender({
        type: LOGIN,
        onSuccess: (state, action) => {
            const { data: userInfo } = action.payload.data;

            return state.set('result', fromJS(userInfo));
        },
        onFailure: (state, action) => {
            return state.set('error', true);
        }
    }),
    ...pender({
        type: CHECK,
        onSuccess: (state, action) => {
            const { data: userInfo } = action.payload.data;

            return state.set('userInfo', fromJS(userInfo)).set('validated', true);
        },
        onFailure: (state, action) => initialState
    }),
    ...pender({
        type: LOGOUT,
        onSuccess: (state, action) => initialState
    }),
    [SET_USER_INFO]: (state, action) => {
        const { payload: userInfo } = action;

        return state.set('userInfo', fromJS(userInfo)).set('logged', true);
    },
    [SET_VALIDATED]: (state, action) => {
        const { payload } = action;

        return state.set('validated', payload);
    }
}, initialState);