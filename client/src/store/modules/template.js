import { Map, List, fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as api from 'lib/api';

const GET_TEMPLATES = 'template/GET_TEMPLATES';
const GET_TEMPLATES_FOR_SELECT = 'template/GET_TEMPLATES_FOR_SELECT';
const GET_TEMPLATE = 'template/GET_TEMPLATE';
const ADD_TEMPLATE = 'template/ADD_TEMPLATE';
const EDIT_TEMPLATE = 'template/EDIT_TEMPLATE';
const DOWNLOAD_TEMPLATE = 'template/DOWNLOAD_TEMPLATE';
const DELETE_TEMPLATE = 'template/DELETE_TEMPLATE';
const SELECT_TEMPLATE = 'template/SELECT_TEMPLATE';
const ON_CHANGE = 'template/ON_CHANGE';
const INITIALIZE = 'template/INITIALIZE';

export const getTemplates = createAction(GET_TEMPLATES, api.getTemplates);
export const getTemplatesForSelect = createAction(GET_TEMPLATES_FOR_SELECT, api.getTemplatesForSelect);
export const getTemplate = createAction(GET_TEMPLATE, api.getTemplate);
export const addTemplate = createAction(ADD_TEMPLATE, api.addTemplate);
export const editTemplate = createAction(EDIT_TEMPLATE, api.editTemplate);
export const downloadTemplate = createAction(DOWNLOAD_TEMPLATE, api.downloadTemplate);
export const deleteTemplate = createAction(DELETE_TEMPLATE, api.deleteTemplate);
export const selectTemplate = createAction(SELECT_TEMPLATE);
export const onChange = createAction(ON_CHANGE);
export const initialize = createAction(INITIALIZE);

const initialState = Map({
	templates: List(),
	templateList: List(),
	template: Map(),
	add: Map({
		templateGb: '',
		templateName: '',
		templateType: '',
		templatePath: '',
		templateDescription: ''
	}),
	errors: Map({
		templateGbError: false,
		templateNameError: false,
		templateTypeError: false,
		templatePathError: false,
		templateDescriptionError: false
	}),
	total: 0,
	selectedTemplate: '',
	page: 1,
	lastPage: null
});

export default handleActions(
	{
		...pender({
			type: GET_TEMPLATES,
			onSuccess: (state, action) => {
				let { data: templates } = action.payload.data;

				templates = templates.map((template, index) => ({
					...template,
					index: index + 1
				}));

				const count = action.payload.headers['total'];
				const lastPage = action.payload.headers['last-page'];

				return state
					.set('templates', fromJS(templates))
					.set('total', parseInt(count, 10))
					.set('lastPage', parseInt(lastPage || 1, 10));
			}
		}),
		...pender({
			type: GET_TEMPLATES_FOR_SELECT,
			onSuccess: (state, action) => {
				const { data: templateList } = action.payload.data;

				return state.set('templateList', fromJS(templateList));
			}
		}),
		...pender({
			type: GET_TEMPLATE,
			onSuccess: (state, action) => {
				const { data: template } = action.payload.data;

				return state.set('template', fromJS(template));
			}
		}),
		...pender({
			type: ADD_TEMPLATE,
			onSuccess: (state, action) => {
				const { data: template } = action.payload.data;

				return state
					.set('template', Map({ ...template, templateGb: template.templateGb._id }))
					.set('add', initialState.get('add'));
			},
			onFailure: (state, action) => {
				const template = state.get('add');

				return state
					.setIn(['errors', 'templateGbError'], template.get('templateGb') === '')
					.setIn(['errors', 'templateNameError'], template.get('templateName') === '')
					.setIn(['errors', 'templateTypeError'], template.get('templateType') === '')
					.setIn(['errors', 'templatePathError'], template.get('templatePath') === '')
					.setIn(['errors', 'templateDescriptionError'], template.get('templateDescription') === '');
			}
		}),
		...pender({
			type: EDIT_TEMPLATE,
			onSuccess: (state, action) => {
				const { data: template } = action.payload;

				return state.set('template', Map({ ...template, templateGb: template.templateGb._id }));
			}
		}),
		...pender({
			type: DOWNLOAD_TEMPLATE,
			onSuccess: (state, action) => {
				return state.set('selectedTemplate', '');
			}
		}),
		...pender({
			type: DELETE_TEMPLATE
		}),
		[SELECT_TEMPLATE]: (state, action) => {
			const { payload: id } = action;

			const template = state.get('templates').find((template) => template.get('_id') === id);

			return state.set(
				'template',
				Map({ ...template.toJS(), templateGb: template.getIn(['templateGb', '_id']) })
			);
		},
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
