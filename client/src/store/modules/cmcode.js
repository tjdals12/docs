import { Map, fromJS, List } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import * as api from 'lib/api';
import { pender } from 'redux-pender';

const GET_CMCODE_BY_MAJOR = 'cmcode/GET_CMCODE_BY_MAJOR';
const GET_CMCODE_BY_MAJOR_EXCLUDE_REMOVED = 'cmcode/GET_CMCODE_BY_MAJOR_EXCLUDE_REMOVED';
const GET_CDMAJORS = 'cmcode/GET_CDMAJORS';
const GET_CDMINORS = 'cmcode/GET_CDMINORS';
const GET_CDMINOR = 'cmcode/GET_CDMINOR';
const ADD_CDMINOR = 'cmcode/ADD_CDMINOR';
const EDIT_CDMINOR = 'cmcode/EDIT_CDMINOR';
const DELETE_CDMINOR = 'cmcode/DELETE_CDMINOR';
const RECOVERY_CDMINOR = 'cmcode/RECOVERY_CDMINOR';
const ON_CHANGE = 'cmcode/ON_CHANGE';
const INITIALIZE = 'cmcode/INITIALIZE';

export const getCmcodeByMajor = createAction(GET_CMCODE_BY_MAJOR, api.getCmcodeByMajor);
export const getCmcodeByMajorExcludeRemoved = createAction(GET_CMCODE_BY_MAJOR_EXCLUDE_REMOVED, api.getCmcodeByMajorExcludeRemoved);
export const getCdMajors = createAction(GET_CDMAJORS, api.getCdMajors);
export const getCdMinors = createAction(GET_CDMINORS, api.getCmcodeById);
export const getCdMinor = createAction(GET_CDMINOR, api.getCdMinor);
export const addCdMinor = createAction(ADD_CDMINOR, api.addCdMinor);
export const editCdMinor = createAction(EDIT_CDMINOR, api.editCdMinor);
export const deleteCdMinor = createAction(DELETE_CDMINOR, api.deleteCdMinor);
export const recoveryCdMinor = createAction(RECOVERY_CDMINOR, api.recoveryCdMinor);
export const onChange = createAction(ON_CHANGE);
export const initialize = createAction(INITIALIZE);

const initialState = Map({
	cdMajors: List(),
	cdMajor: Map({}),
	cdMinor: Map({}),
	add: Map({
		cdMinor: '',
		cdSName: ''
	}),
	errors: Map({
		cdMinorError: false,
		cdSNameError: false
	}),
	majorCount: 0,
	majorPage: 1,
	majorLastPage: null,
	minorCount: 0,
	minorPage: 1,
	minorLastPage: null
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
			type: GET_CMCODE_BY_MAJOR_EXCLUDE_REMOVED,
			onSuccess: (state, action) => {
				const { data: cmcode } = action.payload.data;

				return state.set(cmcode.cdMajor, fromJS(cmcode));
			}
		}),
		...pender({
			type: GET_CDMAJORS,
			onSuccess: (state, action) => {
				let { data: cdMajors } = action.payload.data;
				const startIndex = (state.get('majorPage') - 1) * 10;

				cdMajors = cdMajors.map((cdMajor, index) => ({
					index: startIndex + (index + 1),
					...cdMajor,
					effStaDt: cdMajor.effStaDt.substr(0, 10),
					effEndDt: cdMajor.effEndDt.substr(0, 10)
				}));

				const count = action.payload.headers['total'];
				const lastPage = action.payload.headers['last-page'];

				return state
					.set('cdMajors', fromJS(cdMajors))
					.set('majorCount', parseInt(count, 10))
					.set('majorLastPage', parseInt(lastPage || 1, 10));
			}
		}),
		...pender({
			type: GET_CDMINORS,
			onSuccess: (state, action) => {
				let { data: cmcode } = action.payload.data;
				const startIndex = (state.get('minorPage') - 1) * 10;

				cmcode.cdMinors = cmcode.cdMinors.map((cdMinor, index) => ({
					index: startIndex + (index + 1),
					...cdMinor,
					timestamp: {
						...cdMinor.timestamp,
						regDt: cdMinor.timestamp.regDt.substr(0, 10)
					}
				}));

				const count = action.payload.headers['total'];
				const lastPage = action.payload.headers['last-page'];

				return state
					.set('cdMajor', fromJS(cmcode))
					.set('minorCount', parseInt(count, 10))
					.set('minorLastPage', parseInt(lastPage || 1, 10));
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
				return state.set('add', initialState.get('add')).set('errors', initialState.get('errors'));
			},
			onFailure: (state, action) => {
				const add = state.get('add');

				return state
					.setIn(['errors', 'cdMinorError'], add.get('cdMinor') === '')
					.setIn(['errors', 'cdSNameError'], add.get('cdSName') === '');
			}
		}),
		...pender({
			type: EDIT_CDMINOR,
			onSuccess: (state, action) => {
				return state.set('errors', initialState.get('errors'))
			},
			onFailure: (state, action) => {
				const edit = state.get('cdMinor');

				return state
					.setIn(['errors', 'cdMinorError'], edit.get('cdMinor') === '')
					.setIn(['errors', 'cdSNameError'], edit.get('cdSName') === '');
			}
		}),
		...pender({
			type: DELETE_CDMINOR,
			onSuccess: (state, action) => {
				return state.set('cdMinor', initialState.get('cdMinor'));
			}
		}),
		...pender({
			type: RECOVERY_CDMINOR,
			onSuccess: (state, action) => {
				return state.set('cdMinor', initialState.get('cdMinor'));
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
