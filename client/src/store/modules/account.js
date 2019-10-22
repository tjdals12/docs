import { Map, fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as api from 'lib/api';

const LOGIN = 'account/LOGIN';

export const login = createAction(LOGIN, api.login);

const initialState = Map({
    userInfo: Map()
});

export default handleActions({
    ...pender({
        type: LOGIN,
        onSuccess: (state, action) => {
            const { data: userInfo } = action.payload.data;

            return state.set('userInfo', fromJS(userInfo));
        }
    })
}, initialState);