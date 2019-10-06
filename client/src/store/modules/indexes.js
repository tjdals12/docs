import { List, Map, fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as api from 'lib/api';

const GET_INDEXES = 'indexes/GET_INDEXES';
const GET_INDEXES_FOR_SELECT = 'indexes/GET_INDEXES_FOR_SELECT';
const SEARCH_INDEXES = 'indexes/SEARCH_INDEXES';
const GET_INDEX = 'indexes/GET_INDEX';
const GET_INDEX_OVERALL = 'indexes/GET_INDEX_OVERALL';
const GET_STATISTICS_BY_STATUS = 'indexes/GET_STATISTICS_BY_STATUS';
const GET_TRACKING_DOCUMENT = 'indexes/GET_TRACKING_DOCUMENT';
const ADD_INDEX = 'indexes/ADD_INDEX';
const ADD_PARTIAL = 'indexes/ADD_PARTIAL';
const EDIT_INDEX = 'indexes/EDIT_INDEX';
const DELETE_INDEX = 'indexes/DELETE_INDEX';
const ON_CHANGE = 'indexes/ON_CHANGE';
const ON_CHANGE_ADD = 'indexes/ON_CHANGE_ADD';
const ON_CHANGE_EDIT = 'indexes/ON_CHANGE_EDIT';
const ON_CHANGE_EDIT_INFO = 'indexes/ON_CHANGE_EDIT_INFO';
const ON_CHANGE_EDIT_LIST = 'indexes/ON_CHANGE_EDIT_LIST';
const ON_CHANGE_SEARCH = 'indexes/ON_CHANGE_SEARCH';
const ON_CHANGE_INFO = 'indexes/ON_CHNAGE_INFO';
const SET_TARGET = 'indexes/SET_TARGET';
const ADD_INFO_FORM = 'indexes/ADD_INFO_FORM';
const DELETE_INFO_FORM = 'indexes/DELETE_INFO_FORM';
const ADD_INFO_BY_EXCEL = 'indexes/ADD_INFO_BY_EXCEL';
const INITIALIZE = 'indexes/INITIALIZE';

export const getIndexes = createAction(GET_INDEXES, api.getIndexes);
export const getIndexesForSelect = createAction(GET_INDEXES_FOR_SELECT, api.getIndexesForSelect);
export const searchIndexes = createAction(SEARCH_INDEXES, api.searchIndexes);
export const getIndex = createAction(GET_INDEX, api.getIndex);
export const getIndexOverall = createAction(GET_INDEX_OVERALL, api.getIndexOverall);
export const getStatisticsByStatus = createAction(GET_STATISTICS_BY_STATUS, api.getStatisticsByStatus);
export const getTrackingDocument = createAction(GET_TRACKING_DOCUMENT, api.getTrackingDocument);
export const addIndex = createAction(ADD_INDEX, api.addIndex);
export const addPartial = createAction(ADD_PARTIAL, api.addPartial);
export const editIndex = createAction(EDIT_INDEX, api.editIndex);
export const deleteIndex = createAction(DELETE_INDEX, api.deleteIndex);
export const onChange = createAction(ON_CHANGE);
export const onChangeAdd = createAction(ON_CHANGE_ADD);
export const onChangeEdit = createAction(ON_CHANGE_EDIT);
export const onChangeEditInfo = createAction(ON_CHANGE_EDIT_INFO);
export const onChangeEditList = createAction(ON_CHANGE_EDIT_LIST);
export const onChangeSearch = createAction(ON_CHANGE_SEARCH);
export const onChangeInfo = createAction(ON_CHANGE_INFO);
export const setTarget = createAction(SET_TARGET);
export const addInfoForm = createAction(ADD_INFO_FORM);
export const deleteInfoForm = createAction(DELETE_INFO_FORM);
export const addInfoByExcel = createAction(ADD_INFO_BY_EXCEL);
export const initialize = createAction(INITIALIZE);

const initialState = Map({
	indexes: List(),
	vendorList: List(),
	index: Map(),
	indexDetail: Map(),
	add: Map({
		vendor: '',
		list: []
	}),
	edit: Map({
		vendor: '',
		list: List(),
		deleteList: List()
	}),
	search: Map({
		part: '',
		partNumber: '',
		vendorName: '',
		officialName: '',
		isSearch: false
	}),
	infos: List([
		Map({
			index: 0,
			documentNumber: '',
			documentTitle: '',
			documentGb: '',
			plan: ''
		})
	]),
	error: false,
	infosError: List(),
	target: '',
	lastPage: null
});

export default handleActions(
	{
		...pender({
			type: GET_INDEXES,
			onSuccess: (state, action) => {
				const { data: indexes } = action.payload.data;
				const lastPage = action.payload.headers['last-page'];

				return state.set('indexes', fromJS(indexes)).set('lastPage', parseInt(lastPage, 10));
			}
		}),
		...pender({
			type: GET_INDEXES_FOR_SELECT,
			onSuccess: (state, action) => {
				const { data: vendorList } = action.payload.data;

				return state.set('vendorList', fromJS(vendorList));
			}
		}),
		...pender({
			type: SEARCH_INDEXES,
			onSuccess: (state, action) => {
				const { data: indexes } = action.payload.data;
				const lastPage = action.payload.headers['last-page'];

				return state
					.set('indexes', fromJS(indexes))
					.set('lastPage', parseInt(lastPage, 10))
					.setIn(['search', 'isSearch'], true);
			}
		}),
		...pender({
			type: GET_INDEX,
			onSuccess: (state, action) => {
				const { data: index } = action.payload.data;

				let list = [];
				let deleteList = [];

				index.list.forEach((document) => {
					document.removeYn.yn === 'YES' ? deleteList.push(document) : list.push(document);
				});

				list = list.map((document) => {
					return {
						_id: document._id,
						documentNumber: document.documentNumber,
						documentTitle: document.documentTitle,
						documentGb: document.documentGb._id,
						plan: document.plan
					};
				});

				return state
					.set('index', fromJS(index))
					.setIn(['edit', 'vendor'], index.vendor._id)
					.setIn(['edit', 'list'], fromJS(list))
					.setIn(['edit', 'deleteList'], fromJS(deleteList));
			}
		}),
		...pender({
			type: GET_INDEX_OVERALL,
			onSuccess: (state, action) => {
				const { data: overall } = action.payload.data;

				return state.setIn(['indexDetail', 'overall'], Map(overall));
			}
		}),
		...pender({
			type: GET_STATISTICS_BY_STATUS,
			onSuccess: (state, action) => {
				const { data: statisticsByStatus } = action.payload.data;

				return state.setIn(['indexDetail', 'statisticsByStatus'], fromJS(statisticsByStatus));
			}
		}),
		...pender({
			type: GET_TRACKING_DOCUMENT,
			onSuccess: (state, action) => {
				const { data: list } = action.payload.data;
				const lastPage = action.payload.headers['last-page'];

				return state
					.setIn(['indexDetail', 'list'], fromJS(list))
					.setIn(['indexDetail', 'lastPage'], parseInt(lastPage, 10));
			}
		}),
		...pender({
			type: ADD_INDEX,
			onSuccess: (state, action) => {
				const { data: index } = action.payload.data;

				return state.set('add', initialState.get('add')).set('index', fromJS(index));
			},
			onFailure: (state, action) => {
				const add = state.get('add');

				const errors = add.get('list').map((item, index) => ({ ...item.toJS(), index })).filter(item => {
					const { documentNumber, documentTitle, documentGb, plan } = item;

					return documentNumber === '' || documentTitle === '' || documentGb === '' || plan === '' ? true : false;
				}).map(item => item.index);

				return state.set('error', add.get('vendor') === '').set('infosError', fromJS(errors));
			}
		}),
		...pender({
			type: ADD_PARTIAL,
			onSuccess: (state, action) => {
				const { data: index } = action.payload.data;

				return state.set('target', '').set('infos', initialState.get('infos')).set('index', fromJS(index));
			},
			onFailure: (state, action) => {
				let infos = state.get('infos');

				infos = infos
					.filter((info) => {
						const { documentNumber, documentTitle, documentGb, plan } = info.toJS();

						return documentNumber === '' || documentTitle === '' || documentGb === '' || plan === '' ? true : false;
					})
					.map((info) => info.get('index'));

				return state.set('error', state.get('target') === '').set('infosError', infos);
			}
		}),
		...pender({
			type: EDIT_INDEX,
			onSuccess: (state, action) => {
				return state.set('edit', initialState.get('edit'));
			},
			onFailure: (state, action) => {
				const edit = state.get('edit');
				let infos = state.getIn(['edit', 'list']);

				infos = infos
					.filter((info) => {
						const { documentNumber, documentTitle, documentGb, plan } = info.toJS();

						return documentNumber === '' || documentTitle === '' || documentGb === '' || plan === ''
							? true
							: false;
					})
					.map((info) => info.get('_id'));

				return state.set('error', edit.get('vendor') === '').set('infosError', infos);
			}
		}),
		...pender({
			type: DELETE_INDEX,
			onSuccess: (state, action) => {
				const { data: indexes } = action.payload.data;
				const lastPage = action.payload.headers['last-page'];

				return state.set('indexes', fromJS(indexes)).set('lastPage', parseInt(lastPage, 10));
			}
		}),
		[ON_CHANGE]: (state, action) => {
			const { target, name, value } = action.payload;

			return !target ? state.set(name, fromJS(value)) : state.setIn([target, name], fromJS(value));
		},
		[ON_CHANGE_ADD]: (state, action) => {
			const { target, index, name, value } = action.payload;

			return state.setIn([target, 'list', index, name], value);
		},
		[ON_CHANGE_INFO]: (state, action) => {
			const { index, name, value } = action.payload;
			const infos = state.get('infos');
			const target = infos.findIndex((info) => info.get('index') === index);

			return state.setIn(['infos', target, name], value);
		},
		[ON_CHANGE_EDIT_INFO]: (state, action) => {
			const { id, name, value } = action.payload;
			const list = state.getIn(['edit', 'list']);

			let target = list.findIndex((document) => document.get('_id') === id);
			target = target > -1 ? target : id;

			return state.setIn(['edit', 'list', target, name], value);
		},
		[ON_CHANGE_EDIT_LIST]: (state, action) => {
			const { id, type } = action.payload;
			const list = state.getIn(['edit', 'list']);
			const deleteList = state.getIn(['edit', 'deleteList']);

			let target;
			let index;

			switch (type) {
				case 'REMOVE':
					index = list.findIndex((document) => document.get('_id') === id);
					target = list.get(index);

					return state
						.setIn(['edit', 'list'], list.splice(index, 1))
						.setIn(['edit', 'deleteList'], deleteList.push(target));
				case 'RECOVERY':
					index = deleteList.findIndex((document) => document.get('_id') === id);
					target = deleteList.get(index);

					const { _id, documentNumber, documentTitle, documentGb, plan } = target.toJS();

					return state
						.setIn(['edit', 'deleteList'], deleteList.splice(index, 1))
						.setIn(['edit', 'list'], list.push(Map({ _id, documentNumber, documentTitle, documentGb: documentGb._id, plan })));

				case 'DELETE':
					return state.setIn(['edit', 'list'], list.splice(id, 1));

				default:
					return state;
			}
		},
		[SET_TARGET]: (state, action) => {
			const { payload } = action;

			return state.set('target', payload);
		},
		[ADD_INFO_FORM]: (state, action) => {
			return state.update('infos', (infos) =>
				infos.push(
					Map({
						...initialState.getIn(['infos', 0]).toJS(),
						index: infos.getIn([infos.size - 1, 'index']) + 1
					})
				)
			);
		},
		[DELETE_INFO_FORM]: (state, action) => {
			const { payload: index } = action;
			const infos = state.get('infos');

			const target = index === -1 ? -1 : infos.findIndex((info) => info.get('index') === index);

			return infos.size === 1 ? state : state.update('infos', (infos) => infos.remove(target));
		},
		[ADD_INFO_BY_EXCEL]: (state, action) => {
			const { payload: data } = action;
			const infos = state.get('infos');
			let currentIndex = infos.getIn([infos.size - 1, 'index']);

			const newInfos = data.map((info) => {
				return Map({
					...info,
					plan: info.plan.substr(0, 10),
					index: ++currentIndex
				});
			});

			return state.update('infos', (infos) => infos.concat(newInfos));
		},
		[INITIALIZE]: (state, action) => {
			const { payload } = action;

			return state.set(payload, initialState.get(payload));
		}
	},
	initialState
);
