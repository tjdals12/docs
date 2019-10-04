import { Map, fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import * as api from 'lib/api';
import { pender } from 'redux-pender';

const GET_CMCODE_BY_MAJOR = 'cmcode/GET_CMCODE_BY_MAJOR';

export const getCmcodeByMajor = createAction(GET_CMCODE_BY_MAJOR, api.getCmcodeByMajor);

const initialState = Map({});

export default handleActions(
	{
		...pender({
			type: GET_CMCODE_BY_MAJOR,
			onSuccess: (state, action) => {
				const { data: cmcode } = action.payload.data;

				return state.set(cmcode.cdMajor, fromJS(cmcode));
			}
		})
	},
	initialState
);
