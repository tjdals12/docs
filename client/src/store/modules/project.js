import { Map, List, fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import { pender } from 'redux-pender';
import * as api from 'lib/api';

const GET_PROJECTS = 'project/GET_PROJECTS';
const GET_PROJECTS_FOR_SELECT = 'project/GET_PROJECTS_FOR_SELECT';
const GET_PROJECT = 'project/GET_PROJECT';
const ADD_PROJECT = 'project/ADD_PROJECT';
const EDIT_PROJECT = 'project/EDIT_PROJECT';
const SELECT_PROJECT = 'project/SELECT_PROJECT';
const ON_CHANGE = 'project/ON_CHANGE';
const ON_CHANGE_DEEP = 'project/ON_CHANGE_DEEP';
const INITIALIZE = 'project/INITIALIZE';

export const getProjects = createAction(GET_PROJECTS, api.getProjects);
export const getProjectsForSelect = createAction(GET_PROJECTS_FOR_SELECT, api.getProjectsForSelect);
export const getProject = createAction(GET_PROJECT, api.getProject);
export const addProject = createAction(ADD_PROJECT, api.addProject);
export const editProject = createAction(EDIT_PROJECT, api.editProject);
export const selectProject = createAction(SELECT_PROJECT);
export const onChange = createAction(ON_CHANGE);
export const onChangeDeep = createAction(ON_CHANGE_DEEP);
export const initialize = createAction(INITIALIZE);

const initialState = Map({
	projects: List(),
	projectList: List(),
	project: Map({}),
	add: Map({
		projectGb: '',
		projectName: '',
		projectCode: '',
		effStaDt: '',
		effEndDt: '',
		client: '',
		clientCode: '',
		contractorCode: '',
		contractor: '',
		memo: ''
	}),
	errors: Map({
		projectGbError: false,
		projectNameError: false,
		projectCodeError: false,
		effStaDtError: false,
		effEndDtError: false,
		clientError: false,
		clientCodeError: false,
		contractorCodeError: false,
		contractorError: false
	}),
	total: 0,
	lastPage: null
});

export default handleActions(
	{
		...pender({
			type: GET_PROJECTS,
			onSuccess: (state, action) => {
				let { data: projects } = action.payload.data;

				projects = projects.map((project, index) => ({
					...project,
					index: index + 1,
					period: `${project.effStaDt.substr(0, 7)} ~ ${project.effEndDt.substr(0, 7)}`
				}));

				const count = action.payload.headers['total'];
				const lastPage = action.payload.headers['last-page'];

				return state
					.set('projects', fromJS(projects))
					.set('total', parseInt(count, 10))
					.set('lastPage', parseInt(lastPage || 1, 10));
			}
		}),
		...pender({
			type: GET_PROJECTS_FOR_SELECT,
			onSuccess: (state, action) => {
				const { data: projectList } = action.payload.data;

				return state.set('projectList', fromJS(projectList));
			}
		}),
		...pender({
			type: GET_PROJECT,
			onSuccess: (state, action) => {
				const { data: project } = action.payload.data;

				return state.set('project', fromJS(project));
			}
		}),
		...pender({
			type: ADD_PROJECT,
			onSuccess: (state, action) => {
				const { data: project } = action.payload.data;

				return state.set('project', fromJS(project)).set('add', initialState.get('add'));
			},
			onFailure: (state, action) => {
				const add = state.get('add');

				return state
					.setIn([ 'errors', 'projectGbError' ], add.get('projectGb') === '')
					.setIn([ 'errors', 'projectNameError' ], add.get('projectName') === '')
					.setIn([ 'errors', 'projectCodeError' ], add.get('projectCode') === '')
					.setIn([ 'errors', 'effStaDtError' ], add.get('effStaDt') === '')
					.setIn([ 'errors', 'effEndDtError' ], add.get('effEndDt') === '')
					.setIn([ 'errors', 'clientError' ], add.get('client') === '')
					.setIn([ 'errors', 'clientCodeError' ], add.get('clientCode') === '')
					.setIn([ 'errors', 'contractorError' ], add.get('contractor') === '')
					.setIn([ 'errors', 'contractorCodeError' ], add.get('contractorCode') === '');
			}
		}),
		...pender({
			type: EDIT_PROJECT,
			onFailure: (state, action) => {
				const project = state.get('project');

				return state
					.setIn([ 'errors', 'projectGbError' ], project.get('projectGb') === '')
					.setIn([ 'errors', 'projectNameError' ], project.get('projectName') === '')
					.setIn([ 'errors', 'projectCodeError' ], project.get('projectCode') === '')
					.setIn([ 'errors', 'effStaDtError' ], project.get('effStaDt') === '')
					.setIn([ 'errors', 'effEndDtError' ], project.get('effEndDt') === '')
					.setIn([ 'errors', 'clientError' ], project.get('client') === '')
					.setIn([ 'errors', 'clientCodeError' ], project.get('clientCode') === '')
					.setIn([ 'errors', 'contractorError' ], project.get('contractor') === '')
					.setIn([ 'errors', 'contractorCodeError' ], project.get('contractorCode') === '');
			}
		}),
		[SELECT_PROJECT]: (state, action) => {
			const { payload: id } = action;

			const project = state.get('projects').find((project) => project.get('_id') === id);

			return state.set('project', Map({ ...project.toJS(), projectGb: project.getIn([ 'projectGb', '_id' ]) }));
		},
		[ON_CHANGE]: (state, action) => {
			let { target, name, value } = action.payload;

			return target ? state.setIn([ target, name ], value) : state.set(name, value);
		},
		[INITIALIZE]: (state, action) => {
			const { payload } = action;

			return state.set(payload, initialState.get(payload));
		}
	},
	initialState
);
