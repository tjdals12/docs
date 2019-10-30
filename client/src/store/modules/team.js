import { Map, List, fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import * as api from 'lib/api';
import { pender } from 'redux-pender';

const GET_TEAMS = 'team/GET_TEAMS';
const GET_TEAMS_FOR_SELECT = 'team/GET_TEAMS_FOR_SELECT';
const GET_TEAM = 'team/GET_TEAM';
const ADD_TEAM = 'team/ADD_TEAM';
const EDIT_TEAM = 'team/EDIT_TEAE';
const DELETE_TEAM = 'team/DELETE_TEAM';
const ADD_MANAGER = 'team/ADD_MANAGER';
const EDIT_MANAGER = 'team/EDIT_MANAGER';
const DELETE_MANAGER = 'team/DELETE_TEAM';
const SELECT_MANAGER = 'team/SELECT_MANAGER';
const ON_CHANGE = 'team/ON_CHANGE';
const INITIALIZE = 'team/INITIALIZE';

export const getTeams = createAction(GET_TEAMS, api.getTeams);
export const getTeamsForSelect = createAction(GET_TEAMS_FOR_SELECT, api.getTeamsForSelect);
export const getTeam = createAction(GET_TEAM, api.getTeam);
export const addTeam = createAction(ADD_TEAM, api.addTeam);
export const editTeam = createAction(EDIT_TEAM, api.editTeam);
export const deleteTeam = createAction(DELETE_TEAM, api.deleteTeam);
export const addManager = createAction(ADD_MANAGER, api.addManager);
export const editManager = createAction(EDIT_MANAGER, api.editManager);
export const deleteManager = createAction(DELETE_MANAGER, api.deleteManager);
export const selectManager = createAction(SELECT_MANAGER);
export const onChange = createAction(ON_CHANGE);
export const initialize = createAction(INITIALIZE);

const initialState = Map({
    teams: List(),
    teamList: List(),
    team: Map(),
    manager: Map(),
    edit: Map({
        part: '',
        teamName: ''
    }),
    editManager: Map({
        name: '',
        position: '',
        effStaDt: '',
        effEndDt: '9999-12-31'
    }),
    add: Map({
        part: '',
        teamName: ''
    }),
    addManager: Map({
        name: '',
        position: '',
        effStaDt: '',
        effEndDt: '9999-12-31'
    }),
    teamErrors: Map({
        partError: false,
        teamNameError: false
    }),
    managerErrors: Map({
        nameError: false,
        positionError: false,
        effStaDtError: false,
        effEndDtError: false
    }),
    count: 0,
    page: 1,
    lastPage: null
});

export default handleActions({
    ...pender({
        type: GET_TEAMS,
        onSuccess: (state, action) => {
            let { data: teams } = action.payload.data;

            const startIndex = (state.get('page') - 1) * 10;

            const count = action.payload.headers['total'];
            const lastPage = action.payload.headers['last-page'];

            teams = teams.map((team, index) => ({ index: startIndex + (index + 1), ...team }));

            return state.set('teams', fromJS(teams)).set('lastPage', parseInt(lastPage || 1, 10)).set('count', parseInt(count, 10));
        }
    }),
    ...pender({
        type: GET_TEAMS_FOR_SELECT,
        onSuccess: (state, action) => {
            const { data: teamList } = action.payload.data;

            return state.set('teamList', fromJS(teamList));
        }
    }),
    ...pender({
        type: GET_TEAM,
        onSuccess: (state, action) => {
            let { data: team } = action.payload.data;

            team.managers = team.managers.map((manager, index) => {
                const { _id, part, name, position, effStaDt, effEndDt } = manager;

                return {
                    index: index + 1,
                    _id,
                    part,
                    name,
                    position,
                    effStaDt: effStaDt.substr(0, 10),
                    effEndDt: effEndDt.substr(0, 10)
                }
            });

            return state.set('team', fromJS(team)).set('edit', fromJS({ part: team.part._id, teamName: team.teamName }));
        }
    }),
    ...pender({
        type: ADD_TEAM,
        onSuccess: (state, action) => {
            return state.set('add', initialState.get('add')).set('teamErrors', initialState.get('teamErrors'));
        },
        onFailure: (state, action) => {
            const team = state.get('add');

            return state.setIn(['teamErrors', 'partError'], team.get('part') === '')
                .setIn(['teamErrors', 'teamNameError'], team.get('teamName') === '');
        }
    }),
    ...pender({
        type: EDIT_TEAM,
        onSuccess: (state, action) => {
            return state.set('teamErrors', initialState.get('teamErrors'));
        },
        onFailure: (state, action) => {
            const edit = state.get('edit');

            return state.setIn(['teamErrors', 'partError'], edit.get('part') === '')
                .setIn(['teamErrors', 'teamNameError'], edit.get('teamName') === '');
        }
    }),
    ...pender({
        type: DELETE_TEAM,
        onSuccess: (state, action) => {
            return state.set('team', initialState.get('team'));
        }
    }),
    ...pender({
        type: ADD_MANAGER,
        onSuccess: (state, action) => {
            return state.set('addManager', initialState.get('addManager')).set('managerErrors', initialState.get('managerErrors'));
        },
        onFailure: (state, action) => {
            const manager = state.get('addManager');

            return state.setIn(['managerErrors', 'nameError'], manager.get('name') === '')
                .setIn(['managerErrors', 'positionError'], manager.get('position') === '')
                .setIn(['managerErrors', 'effStaDtError'], manager.get('effStaDt') === '')
                .setIn(['managerErrors', 'effEndDtError'], manager.get('effEndDt') === '');
        }
    }),
    ...pender({
        type: EDIT_MANAGER,
        onSuccess: (state, action) => {
            return state.set('managerErrors', initialState.get('managerErrors'));
        },
        onFailure: (state, action) => {
            const manager = state.get('editManager');

            return state.setIn(['managerErrors', 'nameError'], manager.get('name') === '')
                .setIn(['managerErrors', 'positionError'], manager.get('position') === '')
                .setIn(['managerErrors', 'effStaDtError'], manager.get('effStaDt') === '')
                .setIn(['managerErrors', 'effEndDtError'], manager.get('effEndDt') === '');
        }
    }),
    [SELECT_MANAGER]: (state, action) => {
        const { payload: id } = action;

        const manager = state.getIn(['team', 'managers']).find(manager => manager.get('_id') === id)

        return state.set('manager', manager).set('editManager', manager).set('managerErrors', initialState.get('managerErrors'));;;
    },
    [ON_CHANGE]: (state, action) => {
        const { target, name, value } = action.payload;

        return target ? state.setIn([target, name], value) : state.set(name, value)
    },
    [INITIALIZE]: (state, action) => {
        const { payload } = action;

        return state.set(payload, initialState.get(payload));
    }
}, initialState);