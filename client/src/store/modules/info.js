import { Map, List, fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as api from 'lib/api';

const GET_INFOS = 'info/GET_INFOS';
const SEARCH_INFOS = 'info/SEARCH_INFOS';
const GET_INFO = 'info/GET_INFO';
const GET_LATEST_DOCUMENTS = 'info/GET_LATEST_DOCUMENTS';
const ON_CHANGE = 'info/ON_CHANGE';
const ON_CHANGE_SEARCH = 'info/ON_CHANGE_SEARCH';

export const getInfos = createAction(GET_INFOS, api.getInfos);
export const searchInfos = createAction(SEARCH_INFOS, api.searchInfos);
export const getInfo = createAction(GET_INFO, api.getInfo);
export const getLatestDocuments = createAction(GET_LATEST_DOCUMENTS, api.getLatestDocuments);
export const onChange = createAction(ON_CHANGE);
export const onChangeSearch = createAction(ON_CHANGE_SEARCH);

const initialState = Map({
	infos: List(),
	info: Map(),
	search: Map({
		vendor: '',
		documentNumber: '',
		documentTitle: '',
		documentGb: '',
		isSearch: false
	}),
	latest: List(),
	page: 1,
	lastPage: null
});

export default handleActions(
	{
		...pender({
			type: GET_INFOS,
			onSuccess: (state, action) => {
				const { data: infos } = action.payload.data;
				const lastPage = action.payload.headers['last-page'];

				return state.set('infos', fromJS(infos)).set('lastPage', parseInt(lastPage, 10));
			}
		}),
		...pender({
			type: SEARCH_INFOS,
			onSuccess: (state, action) => {
				const { data: infos } = action.payload.data;
				const lastPage = action.payload.headers['last-page'];

				return state
					.set('infos', fromJS(infos))
					.set('lastPage', parseInt(lastPage, 10))
					.setIn([ 'search', 'isSearch' ], true);
			}
		}),
		...pender({
			type: GET_INFO,
			onSuccess: (state, action) => {
				const { data: info } = action.payload.data;

				return state.set('info', fromJS(info));
			}
		}),
		...pender({
			type: GET_LATEST_DOCUMENTS,
			onSuccess: (state, action) => {
				const { data: latest } = action.payload.data;
				const lastPage = action.payload.headers['last-page'];

				return state.set('latest', fromJS(latest)).set('lastPage', parseInt(lastPage || 1, 10));
			}
		}),
		[ON_CHANGE]: (state, action) => {
			const { target, name, value } = action.payload;

			return target ? state.setIn([ target, name ], value) : state.set(name, value);
		},
		[ON_CHANGE_SEARCH]: (state, action) => {
			const { name, value } = action.payload;

			return state.setIn([ 'search', name ], value);
		}
	},
	initialState
);
