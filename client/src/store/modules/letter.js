import { Map, List, fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as api from 'lib/api';
import moment from 'moment';

const GET_LETTERS = 'letter/GET_LETTERS';
const SEARCH_LETTERS = 'letter/SEARCH_LETTERS';
const GET_LETTER = 'letter/GET_LETTER';
const ADD_LETTER = 'letter/ADD_LETTER';
const REFERENCE_SEARCH = 'letter/REFERENCE_SEARCH';
const EDIT_LETTER = 'letter/EDIT_LETTER';
const REPLY_LETTER = 'letter/REPLY_LETTER';
const CANCEL_LETTER = 'letter/CANCEL_LETTER';
const ON_CHANGE = 'letter/ON_CHANGE';
const INITIALIZE = 'letter/INITIALIZE';

export const getLetters = createAction(GET_LETTERS, api.getLetters);
export const searchLetters = createAction(SEARCH_LETTERS, api.searchLetters);
export const getLetter = createAction(GET_LETTER, api.getLetter);
export const addLetter = createAction(ADD_LETTER, api.addLetter);
export const referenceSearch = createAction(REFERENCE_SEARCH, api.referenceSearch);
export const editLetter = createAction(EDIT_LETTER, api.editLetter);
export const replyLetter = createAction(REPLY_LETTER, api.replyLetter);
export const cancelLetter = createAction(CANCEL_LETTER, api.cancelLetter);
export const onChange = createAction(ON_CHANGE);
export const initialize = createAction(INITIALIZE);

const initialState = Map({
	letters: List(),
	letter: Map({}),
	add: Map({
		project: '',
		letterGb: '',
		letterTitle: '',
		senderGb: '',
		sender: '',
		receiverGb: '',
		receiver: '',
		sendDate: moment().format('YYYY-MM-DD'),
		replyRequired: ''
	}),
	edit: Map({
		letterGb: '',
		letterTitle: '',
		senderGb: '',
		sender: '',
		receiverGb: '',
		receiver: '',
		sendDate: '',
		replyRequired: ''
	}),
	search: Map({
		senderGb: '',
		sender: '',
		receiverGb: '',
		receiver: '',
		letterGb: '',
		officialNumber: '',
		letterTitle: '',
		replyRequired: '',
		replyYn: '',
		sendDate: '9999-12-31',
		targetDate: '9999-12-31',
		isSearch: false
	}),
	references: List(),
	errors: Map({
		projectError: false,
		letterGbError: false,
		letterTitleError: false,
		senderGbError: false,
		senderError: false,
		receiverGbError: false,
		receiverError: false,
		sendDateError: false,
		replyRequiredError: false,
		targetDateError: false
	}),
	reason: '',
	reasonError: false,
	keyword: '',
	keywordError: false,
	replyDate: moment().format('YYYY-MM-DD'),
	replyDateError: false,
	lastPage: null
});

export default handleActions(
	{
		...pender({
			type: GET_LETTERS,
			onSuccess: (state, action) => {
				const { data: letters } = action.payload.data;
				const lastPage = action.payload.headers['last-page'];

				return state.set('letters', fromJS(letters)).set('lastPage', parseInt(lastPage, 10));
			}
		}),
		...pender({
			type: SEARCH_LETTERS,
			onSuccess: (state, action) => {
				const { data: letters } = action.payload.data;
				const lastPage = action.payload.headers['last-page'];

				return state
					.set('letters', fromJS(letters))
					.set('lastPage', parseInt(lastPage, 10))
					.setIn(['search', 'isSearch'], true);
			}
		}),
		...pender({
			type: GET_LETTER,
			onSuccess: (state, action) => {
				const { data: letter } = action.payload.data;

				return state
					.set('letter', fromJS(letter))
					.setIn(['edit', 'letterGb'], letter.letterGb)
					.setIn(['edit', 'reference'], fromJS(letter.reference))
					.setIn(['edit', 'letterTitle'], letter.letterTitle)
					.setIn(['edit', 'senderGb'], letter.senderGb)
					.setIn(['edit', 'sender'], letter.sender)
					.setIn(['edit', 'receiverGb'], letter.receiverGb)
					.setIn(['edit', 'receiver'], letter.receiver)
					.setIn(['edit', 'sendDate'], letter.sendDate)
					.setIn(['edit', 'replyRequired'], letter.replyRequired)
					.setIn(['edit', 'targetDate'], letter.targetDate)
					.setIn(['edit', 'memo'], letter.memo);
			}
		}),
		...pender({
			type: ADD_LETTER,
			onSuccess: (state, action) => {
				const { data: letter } = action.payload.data;

				return state.set('letter', fromJS(letter));
			},
			onFailure: (state, action) => {
				const add = state.get('add');

				return state
					.setIn(['errors', 'projectError'], add.get('project') === '')
					.setIn(['errors', 'letterGbError'], add.get('letterGb') === '')
					.setIn(['errors', 'letterTitleError'], add.get('letterTitle') === '')
					.setIn(['errors', 'senderGbError'], add.get('senderGb') === '')
					.setIn(['errors', 'senderError'], add.get('sender') === '')
					.setIn(['errors', 'receiverGbError'], add.get('receiverGb') === '')
					.setIn(['errors', 'receiverError'], add.get('receiver') === '')
					.setIn(['errors', 'sendDateError'], add.get('sendDate') === '')
					.setIn(['errors', 'replyRequiredError'], add.get('replyRequired') === '')
					.setIn(
						['errors', 'targetDateError'],
						add.get('replyRequired') === 'YES' && (!add.get('targetDate') || add.get('targetDate') === '')
					);
			}
		}),
		...pender({
			type: REFERENCE_SEARCH,
			onSuccess: (state, action) => {
				const { data: references } = action.payload.data;

				return state.set('references', fromJS(references)).set('keywordError', false);
			},

			onFailure: (state, action) => {
				return state.set('keywordError', state.get('keyword') === '');
			}
		}),
		...pender({
			type: EDIT_LETTER,
			onSuccess: (state, action) => {
				const { data: letter } = action.payload.data;

				return state.set('letter', fromJS(letter));
			},
			onFailure: (state, action) => {
				const data = state.get('edit');

				return state
					.setIn(['errors', 'letterGbError'], data.get('letterGb') === '')
					.setIn(['errors', 'letterTitleError'], data.get('letterTitle') === '')
					.setIn(['errors', 'senderGbError'], data.get('senderGb') === '')
					.setIn(['errors', 'senderError'], data.get('sender') === '')
					.setIn(['errors', 'receiverGbError'], data.get('receiverGb') === '')
					.setIn(['errors', 'receiverError'], data.get('receiver') === '')
					.setIn(['errors', 'sendDateError'], data.get('sendDate') === '')
					.setIn(['errors', 'replyRequiredError'], data.get('replyRequired') === '');
			}
		}),
		...pender({
			type: REPLY_LETTER,
			onSuccess: (state, action) => {
				const { data: letter } = action.payload.data;

				return state.set('letter', fromJS(letter));
			},
			onFailure: (state, action) => {
				return state.set('replyDateError', state.get('replyDate') === '');
			}
		}),
		...pender({
			type: CANCEL_LETTER,
			onSuccess: (state, action) => {
				const { data: letter } = action.payload.data;

				return state.set('letter', fromJS(letter));
			},
			onFailure: (state, action) => {
				return state.set('reasonError', state.get('reason') === '');
			}
		}),
		[ON_CHANGE]: (state, action) => {
			const { target, name, value } = action.payload;

			return !target ? state.set(name, value) : state.setIn([target, name], value);
		},
		[INITIALIZE]: (state, action) => {
			const { payload } = action;

			return state.set(payload, initialState.get(payload));
		}
	},
	initialState
);
