import { Map, List, fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as api from 'lib/api';

const GET_ROLES = 'role/GET_ROLES';

export const getRoles = createAction(GET_ROLES, api.getRoles);

const initialState = Map({
    roles: List()
});

export default handleActions({
    ...pender({
        type: GET_ROLES,
        onSuccess: (state, action) => {
            const { data: roles } = action.payload.data;

            return state.set('roles', fromJS(roles));
        }
    })
}, initialState);