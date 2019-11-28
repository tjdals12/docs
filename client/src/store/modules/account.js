import { Map, fromJS, List } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as api from 'lib/api';

const GET_USERS = 'account/GET_USERS';
const GET_USER = 'account/GET_USER';
const ADD_USER = 'account/ADD_USER';
const EDIT_USER = 'account/EDIT_USER';
const DELETE_USER = 'account/DELETE_USER';
const LOGIN = 'account/LOGIN';
const CHECK = 'account/CHECK';
const LOGOUT = 'account/LOGOUT';
const SET_USER_INFO = 'account/SET_USER_INFO';
const SET_VALIDATED = 'account/SET_VALIDATED';
const ON_CHANGE = 'account/ON_CHANGE';
const SET_CHECKED_LIST = 'account/SET_CHECKED_LIST';
const INITIALIZE = 'account/INITIALIZE';

export const getUsers = createAction(GET_USERS, api.getUsers);
export const getUser = createAction(GET_USER, api.getUser);
export const addUser = createAction(ADD_USER, api.addUser);
export const editUser = createAction(EDIT_USER, api.editUser);
export const deleteUser = createAction(DELETE_USER, api.deleteUser);
export const login = createAction(LOGIN, api.login);
export const check = createAction(CHECK, api.check);
export const logout = createAction(LOGOUT, api.logout);
export const setUserInfo = createAction(SET_USER_INFO);
export const setValidated = createAction(SET_VALIDATED);
export const onChange = createAction(ON_CHANGE);
export const setCheckedList = createAction(SET_CHECKED_LIST);
export const initialize = createAction(INITIALIZE);

const initialState = Map({
    users: List(),
    user: Map(),
    add: Map({
        username: '',
        description: '',
        userType: '',
        userId: '',
        pwd: '',
        roles: List()
    }),
    edit: Map({
        username: '',
        description: '',
        userType: '',
        userId: '',
        roles: List()
    }),
    errors: Map({
        usernameError: false,
        descriptionError: false,
        userTypeError: false,
        userIdError: false,
        pwdError: false
    }),
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

            return state.set('user', fromJS(user))
                .setIn(['edit', 'username'], user.profile.username)
                .setIn(['edit', 'description'], user.profile.description)
                .setIn(['edit', 'userType'], user.profile.userType)
                .setIn(['edit', 'userId'], user.userId)
                .setIn(['edit', 'roles'], fromJS(user.roles))
                .setIn(['edit', 'pwd'], '');
        }
    }),
    ...pender({
        type: ADD_USER,
        onFailure: (state, action) => {
            const add = state.get('add');

            return state.setIn(['errors', 'usernameError'], add.get('username') === '')
                .setIn(['errors', 'descriptionError'], add.get('description') === '')
                .setIn(['errors', 'userTypeError'], add.get('userType') === '')
                .setIn(['errors', 'userIdError'], add.get('userId') === '')
                .setIn(['errors', 'pwdError'], add.get('pwd') === '' || add.get('pwd').length < 4)
        }
    }),
    ...pender({
        type: EDIT_USER,
        onFailure: (state, action) => {
            const edit = state.get('user');

            return state.setIn(['errors', 'usernameError'], edit.get('username') === '')
                .setIn(['errors', 'descriptionError'], edit.get('description') === '')
                .setIn(['errors', 'userTypeError'], edit.get('userType') === '')
                .setIn(['errors', 'userIdError'], edit.get('userId') === '');
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
    },
    [ON_CHANGE]: (state, action) => {
        const { target, name, value } = action.payload;

        return target ? state.setIn([target, name], value) : state.set(name, value);
    },
    [SET_CHECKED_LIST]: (state, action) => {
        const { target, name, value, checked } = action.payload;
        const checkedList = target ? state.getIn([target, name]) : state.get(name);

        if (checked) {
            return target ? state.updateIn([target, name], (target) => target.push(value)) : state.update(name, (target) => target.push(value))
        } else {
            const index = checkedList.findIndex((item) => item === value);

            return target ? state.updateIn([target, name], (target) => target.remove(index)) : state.update(name, (target) => target.remove(index));
        }
    },
    [INITIALIZE]: (state, action) => {
        const { payload } = action;

        return state.set(payload, initialState.get(payload));
    }
}, initialState);