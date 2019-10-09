import { Map, fromJS, List } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import * as api from 'lib/api';
import { pender } from 'redux-pender';

const GET_CMCODE_BY_MAJOR = 'cmcode/GET_CMCODE_BY_MAJOR';
const GET_CDMAJORS = 'cmcode/GET_CDMAJORS';
const GET_CDMINORS = 'cmcode/GET_CDMINORS';
const GET_CDMINOR = 'cmcode/GET_CDMINOR';
const ADD_CDMINOR = 'cmcode/ADD_CDMINOR';
const ON_CHANGE = 'cmcode/ON_CHANGE';
const INITIALIZE = 'cmcode/INITIALIZE';

export const getCmcodeByMajor = createAction(GET_CMCODE_BY_MAJOR, api.getCmcodeByMajor);
export const getCdMajors = createAction(GET_CDMAJORS, api.getCdMajors);
export const getCdMinors = createAction(GET_CDMINORS, api.getCmcodeById);
export const getCdMinor = createAction(GET_CDMINOR, api.getCdMinor);
export const addCdMinor = createAction(ADD_CDMINOR, api.addCdMinor);
export const onChange = createAction(ON_CHANGE);
export const initialize = createAction(INITIALIZE);

const initialState = Map({
	cdMajors: List(),
	cdMajor: Map({}),
	cdMinor: Map({}),
	add: Map({
		cdMinor: '',
		cdSName: ''
	})
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
		}),
		...pender({
			type: GET_CDMINORS,
			onSuccess: (state, action) => {
				let { data: cmcode } = action.payload.data;

				cmcode.cdMinors = cmcode.cdMinors.map((cdMinor, index) => ({
					index: index + 1,
					...cdMinor,
					timestamp: {
						...cdMinor.timestamp,
						regDt: cdMinor.timestamp.regDt.substr(0, 10)
					}
				}))

				return state.set('cdMajor', fromJS(cmcode));
			}
		}),
		...pender({
			type: GET_CDMINOR,
			onSuccess: (state, action) => {
				const { data: cdMinor } = action.payload.data;

				return state.set('cdMinor', fromJS(cdMinor));
			}
		}),
		...pender({
			type: ADD_CDMINOR,
			onSuccess: (state, action) => {
				let { data: cmcode } = action.payload.data;

				cmcode.cdMinors = cmcode.cdMinors.map((cdMinor, index) => ({
					index: index + 1,
					...cdMinor,
					timestamp: {
						...cdMinor.timestamp,
						regDt: cdMinor.timestamp.regDt.substr(0, 10)
					}
				}))

				return state.set('cdMajor', fromJS(cmcode));
			}
		}),
		[ON_CHANGE]: (state, action) => {
			const { target, name, value } = action.payload;

			return target ? state.setIn([target, name], value) : state.set(name, value);
		},
		[INITIALIZE]: (state, action) => {
			const { payload } = action;

			return state.set(payload, initialState.get(payload));
		}
	},
	initialState
);
