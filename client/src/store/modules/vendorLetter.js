import { Map, List, fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import * as api from 'lib/api';
import { pender } from 'redux-pender';
import moment from 'moment';

const GET_VENDORLETTERS = 'vendorletter/GET_VENDORLETTERS';
const GET_VENDORLETTERS_BY_VENDOR = 'vendorletter/GET_VENDORLETTERS_BY_VENDOR';
const STATISTICS_BY_TRANSMITTAL = 'vendorletter/STATISTICS_BY_TRANSMITTAL';
const SEARCH_VENDORLETTERS = 'vendorletter/SEARCH_VENDORLETTERS';
const GET_VENDORLETTER = 'vendorletter/GET_VENDORLETTER';
const RECEIVE_VENDORLETTER = 'vendorletter/RECEIVE_VENDORLETTER';
const EDIT_VENDORLETTER = 'vendorletter/EDIT_VENDORLETTER';
const ADDITIONAL_RECEIVE_VENDORLETTER = 'vendorletter/ADDITIONAL_RECEIVE_VENDORLETTER';
const DELETE_VENDORLETTER = 'vendorletter/DELETE_VENDORLETTER';
const INOUT_VENDORLETTER = 'vendorletter/INOUT_VENDORLETTER';
const DELETE_INOUT_VENDORLETTER = 'vendorletter/DELETE_INOUT_VENDORLETTER';
const ON_CHANGE = 'vendorletter/ON_CHANGE';
const SET_TARGET = 'vendorletter/SET_TARGET';
const SET_DELETE_DOCUMENT = 'vendorletter/SET_DELETE_DOCUMENT';
const DELETE_RECEIVE_DOCUMENT = 'vendorletter/DELETE_RECEIVE_DOCUMENT';
const INITIALIZE = 'vendorletter/INITIALIZE';

const ON_CHANGE_VENDORLETTER = 'vendorletter/ON_CHANGE_VENDORLETTER';
export const onChangeVendorLetter = createAction(ON_CHANGE_VENDORLETTER);

export const getVendorLetters = createAction(GET_VENDORLETTERS, api.getVendorLetters);
export const getVendorLettersByVendor = createAction(GET_VENDORLETTERS_BY_VENDOR, api.getVendorLettersByVendor);
export const statisticsByTransmittal = createAction(STATISTICS_BY_TRANSMITTAL, api.statisticsByTransmittal);
export const searchVendorLetters = createAction(SEARCH_VENDORLETTERS, api.searchVendorLetters);
export const getVendorLetter = createAction(GET_VENDORLETTER, api.getVendorLetter);
export const receiveVendorLetter = createAction(RECEIVE_VENDORLETTER, api.receiveVendorLetter);
export const editVendorLetter = createAction(EDIT_VENDORLETTER, api.editVendorLetter);
export const additionalReceiveVendorLetter = createAction(
	ADDITIONAL_RECEIVE_VENDORLETTER,
	api.additionalReceiveVendorLetter
);
export const deleteVendorLetter = createAction(DELETE_VENDORLETTER, api.deleteVendorLetter);
export const inOutVendorLetter = createAction(INOUT_VENDORLETTER, api.inOutVendorLetter);
export const deleteInOutVendorLetter = createAction(DELETE_INOUT_VENDORLETTER, api.deleteInOutVendorLetter);
export const onChange = createAction(ON_CHANGE);
export const setTarget = createAction(SET_TARGET);
export const setDeleteDocument = createAction(SET_DELETE_DOCUMENT);
export const deleteReceiveDocument = createAction(DELETE_RECEIVE_DOCUMENT);
export const initialize = createAction(INITIALIZE);

const initialState = Map({
	vendorLetters: List(),
	vendorLettersByVendor: List(),
	vendorLetter: Map(),
	receive: Map({
		vendor: '',
		senderGb: '',
		sender: '',
		receiverGb: '',
		receiver: '',
		officialNumber: '',
		receiveDocuments: List(),
		receiveDate: moment().format('YYYY-MM-DD'),
		targetDate: moment().add(14, 'days').format('YYYY-MM-DD')
	}),
	additionalReceive: Map({
		id: '',
		receiveDocuments: List(),
		receiveDate: '',
	}),
	edit: Map({
		vendor: '',
		senderGb: '',
		sender: '',
		receiverGb: '',
		receiver: '',
		officialNumber: '',
		receiveDocuments: List(),
		receiveDate: '',
		targetDate: ''
	}),
	search: Map({
		senderGb: '',
		sender: '',
		receiverGb: '',
		receiver: '',
		vendor: '',
		officialNumber: '',
		receiveDate: '2010-01-01',
		targetDate: '9999-12-31',
		letterStatus: '',
		cancelYn: '',
		isSearch: false
	}),
	errors: Map({
		vendorError: false,
		senderGbError: false,
		senderError: false,
		receiverGbError: false,
		receiverError: false,
		officialNumberError: false,
		receiveDocumentsError: false,
		receiveDocumentsErrorList: List(),
		receiveDateError: false,
		targetDateError: false
	}),
	reason: '',
	reasonError: false,
	status: '',
	date: new Date(),
	target: '',
	lastPage: null
});

export default handleActions(
	{
		...pender({
			type: GET_VENDORLETTERS,
			onSuccess: (state, action) => {
				const { data: vendorLetters } = action.payload.data;
				const lastPage = action.payload.headers['last-page'];

				return state.set('vendorLetters', fromJS(vendorLetters)).set('lastPage', parseInt(lastPage, 10));
			}
		}),
		...pender({
			type: GET_VENDORLETTERS_BY_VENDOR,
			onSuccess: (state, action) => {
				const { data: vendorLetters } = action.payload.data;

				return state.set('vendorLettersByVendor', fromJS(vendorLetters));
			}
		}),
		...pender({
			type: STATISTICS_BY_TRANSMITTAL,
			onSuccess: (state, action) => {
				const { data: statisticsByTransmittal } = action.payload.data;

				return state.set('statisticsByTransmittal', fromJS(statisticsByTransmittal));
			}
		}),
		...pender({
			type: SEARCH_VENDORLETTERS,
			onSuccess: (state, action) => {
				const { data: vendorLetters } = action.payload.data;
				const lastPage = action.payload.headers['last-page'];

				return state
					.set('vendorLetters', fromJS(vendorLetters))
					.set('lastPage', parseInt(lastPage, 10))
					.setIn(['search', 'isSearch'], true);
			}
		}),
		...pender({
			type: GET_VENDORLETTER,
			onSuccess: (state, action) => {
				const { data: vendorLetter } = action.payload.data;

				return state
					.set('vendorLetter', fromJS(vendorLetter))
					.set('edit', fromJS(vendorLetter))
					.setIn(['edit', 'vendor'], vendorLetter.vendor._id)
					.setIn(['edit', 'deleteDocuments'], List());
			}
		}),
		...pender({
			type: RECEIVE_VENDORLETTER,
			onSuccess: (state, action) => {
				const { data: vendorLetter } = action.payload.data;

				return state.set('vendorLetter', fromJS(vendorLetter));
			},
			onFailure: (state, action) => {
				const { data } = action.payload.response.data;

				const receive = state.get('receive');

				return state
					.setIn(['errors', 'vendorError'], receive.get('vendor') === '')
					.setIn(['errors', 'senderGbError'], receive.get('senderGb') === '')
					.setIn(['errors', 'senderError'], receive.get('sender') === '')
					.setIn(['errors', 'receiverGbError'], receive.get('receiverGb') === '')
					.setIn(['errors', 'receiverError'], receive.get('receiver') === '')
					.setIn(['errors', 'officialNumberError'], receive.get('officialNumber') === '')
					.setIn(['errors', 'receiveDocumentsErrorList'], Array.isArray(data) ? data : List())
					.setIn(['errors', 'receiveDateError'], receive.get('receiveDate') === '')
					.setIn(['errors', 'targetDateError'], receive.get('targetDate') === '');
			}
		}),
		...pender({
			type: EDIT_VENDORLETTER,
			onSuccess: (state, action) => {
				const { data: vendorLetter } = action.payload.data;

				return state
					.set('vendorLetter', fromJS(vendorLetter))
					.set('edit', fromJS(vendorLetter))
					.setIn(['edit', 'vendor'], vendorLetter.vendor._id)
					.setIn(['edit', 'deleteDocuments'], List());
			},
			onFailure: (state, action) => {
				const receive = state.get('edit');

				return state
					.setIn(['errors', 'vendorError'], receive.get('vendor') === '')
					.setIn(['errors', 'senderGbError'], receive.get('senderGb') === '')
					.setIn(['errors', 'senderError'], receive.get('sender') === '')
					.setIn(['errors', 'receiverGbError'], receive.get('receiverGb') === '')
					.setIn(['errors', 'receiverError'], receive.get('receiver') === '')
					.setIn(['errors', 'officialNumberError'], receive.get('officialNumber') === '')
					.setIn(['errors', 'receiveDocumentsError'], receive.get('documents').size === 0)
					.setIn(['errors', 'receiveDateError'], receive.get('receiveDate') === '')
					.setIn(['errors', 'targetDateError'], receive.get('targetDate') === '');
			}
		}),
		...pender({
			type: ADDITIONAL_RECEIVE_VENDORLETTER,
			onSuccess: (state, action) => {
				const { data: vendorLetter } = action.payload.data;

				return state.set('vendorLetter', fromJS(vendorLetter));
			},
			onFailure: (state, action) => {
				const { data } = action.payload.response.data;

				const additionalReceive = state.get('additionalReceive');

				return state
					.setIn(['errors', 'officialNumberError'], additionalReceive.get('id') === '')
					.setIn(['errors', 'receiveDocumentsErrorList'], Array.isArray(data) ? data : List())
					.setIn(['errors', 'receiveDateError'], additionalReceive.get('receiveDate') === '');
			}
		}),
		...pender({
			type: DELETE_VENDORLETTER,
			onSuccess: (state, action) => {
				const { data: vendorLetter } = action.payload.data;

				return state.set('vendorLetter', fromJS(vendorLetter));
			},
			onFailure: (state, action) => {
				return state.set('reasonError', state.get('reason') === '');
			}
		}),
		...pender({
			type: INOUT_VENDORLETTER,
			onSuccess: (state, action) => {
				const { data: vendorLetter } = action.payload.data;

				return state.set('vendorLetter', fromJS(vendorLetter));
			}
		}),
		...pender({
			type: DELETE_INOUT_VENDORLETTER,
			onSuccess: (state, action) => {
				const { data: vendorLetter } = action.payload.data;

				return state.set('vendorLetter', fromJS(vendorLetter));
			}
		}),
		[ON_CHANGE]: (state, action) => {
			const { target, name, value } = action.payload;

			return !target ? state.set(name, value) : state.setIn([target, name], fromJS(value));
		},
		[SET_TARGET]: (state, action) => {
			const { payload } = action;

			return state.set('target', payload);
		},
		[SET_DELETE_DOCUMENT]: (state, action) => {
			const { payload: id } = action;
			const receiveDocuments = state.getIn(['edit', 'documents']);
			const index = receiveDocuments.findIndex((document) => document.get('_id') === id);

			return state
				.updateIn(['edit', 'documents'], (receiveDocuments) =>
					receiveDocuments.setIn([index, 'deleted'], true)
				)
				.updateIn(['edit', 'deleteDocuments'], (deleteDocuments) => deleteDocuments.push(id));
		},
		[DELETE_RECEIVE_DOCUMENT]: (state, action) => {
			const { id, target } = action.payload;
			const receiveDocuments = state.getIn([target, 'receiveDocuments']);
			const index = receiveDocuments.findIndex((document) => document.get('id') === id);

			return state.updateIn([target, 'receiveDocuments'], (receiveDocuments) => receiveDocuments.remove(index));
		},
		[INITIALIZE]: (state, action) => {
			const { payload } = action;

			return state.set(payload, initialState.get(payload));
		},
		[ON_CHANGE_VENDORLETTER]: (state, action) => {
			const id = action.payload;
			const vendorLetter = state.getIn(['vendorLettersByVendor', state.get('vendorLettersByVendor').findIndex(vendorLetter => vendorLetter.get('_id') === id)]);

			return state.setIn(['additionalReceive', 'id'], id)
						.setIn(['additionalReceive', 'receiveDate'], vendorLetter.get('receiveDate').substr(0, 10));
		}
	},
	initialState
);
