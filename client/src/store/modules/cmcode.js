import { Map, fromJS, List } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import * as api from 'lib/api';
import { pender } from 'redux-pender';

const GET_CMCODE_BY_MAJOR = 'cmcode/GET_CMCODE_BY_MAJOR';
const GET_CDMAJORS = 'cmcode/GET_CDMAJORS';

export const getCmcodeByMajor = createAction(GET_CMCODE_BY_MAJOR, api.getCmcodeByMajor);
export const getCdMajors = createAction(GET_CDMAJORS, api.getCdMajors);

const initialState = Map({
	cdMajors: List()
});

export default handleActions(
	{
		...pender({
			type: GET_CMCODE_BY_MAJOR,
			onSuccess: (state, action) => {
				const { data: cmcode } = action.payload.data;

				return state.set(cmcode.cdMajor, fromJS(cmcode));
			}
		}),
		...pender({
			type: GET_CDMAJORS,
			onSuccess: (state, action) => {
				let { data: cdMajors } = action.payload.data;

				cdMajors = cdMajors.map((cdMajor, index) => ({
					index: index + 1,
					...cdMajor,
					effStaDt: cdMajor.effStaDt.substr(0, 10),
					effEndDt: cdMajor.effEndDt.substr(0, 10),
				}))

				return state.set('cdMajors', fromJS(cdMajors));
			}
		})
	},
	initialState
);
