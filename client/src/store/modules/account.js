import { Map, fromJS, List } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as api from 'lib/api';

const GET_USERS = 'account/GET_USERS';
const GET_USER = 'account/GET_USER';
const LOGIN = 'account/LOGIN';
const CHECK = 'account/CHECK';
const LOGOUT = 'account/LOGOUT';
const SET_USER_INFO = 'account/SET_USER_INFO';
const SET_VALIDATED = 'account/SET_VALIDATED';

export const getUsers = createAction(GET_USERS, api.getUsers);
export const getUser = createAction(GET_USER, api.getUser);
export const login = createAction(LOGIN, api.login);
export const check = createAction(CHECK, api.check);
export const logout = createAction(LOGOUT, api.logout);
export const setUserInfo = createAction(SET_USER_INFO);
export const setValidated = createAction(SET_VALIDATED);

const initialState = Map({
    users: List(),
    user: Map(),
    count: 0,
    page: 1,
    lastPage: null,
    userInfo: Map(),
    logged: false,
    validated: false,
    result: Map(),
    error: false
});

export default handleActions({
    ...pender({
        type: GET_USERS,
        onSuccess: (state, action) => {
            let { data: users } = action.payload.data;
            const startIndex = (state.get('page') - 1) * 10;

            users = users.map((user, index) => ({ ...user, index: startIndex + (index + 1) }));

            const count = action.payload.headers['total'];
            const lastPage = action.payload.headers['last-page'];

            return state.set('users', fromJS(users)).set('count', parseInt(count, 10)).set('lastPage', parseInt(lastPage || 1, 10));
        }
    }),
    ...pender({
        type: GET_USER,
        onSuccess: (state, action) => {
            const { data: user } = action.payload.data;

            return state.set('user', fromJS(user));
        }
    }),
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