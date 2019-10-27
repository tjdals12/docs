import { Map, List, fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';
import * as api from 'lib/api';
import { pender } from 'redux-pender';

const GET_TEAMS = 'team/GET_TEAMS';
const GET_TEAM = 'team/GET_TEAM';
const EDIT_TEAM = 'team/EDIT_TEAE';
const EDIT_MANAGER = 'team/EDIT_MANAGER';
const SELECT_MANAGER = 'team/SELECT_MANAGER';
const ON_CHANGE = 'team/ON_CHANGE';
const INITIALIZE = 'team/INITIALIZE';

export const getTeams = createAction(GET_TEAMS, api.getTeams);
export const getTeam = createAction(GET_TEAM, api.getTeam);
export const editTeam = createAction(EDIT_TEAM, api.editTeam);
export const editManager = createAction(EDIT_MANAGER, api.editManager);
export const selectManager = createAction(SELECT_MANAGER);
export const onChange = createAction(ON_CHANGE);
export const initialize = createAction(INITIALIZE);

const initialState = Map({
    teams: List(),
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
    })
});

export default handleActions({
    ...pender({
        type: GET_TEAMS,
        onSuccess: (state, action) => {
            let { data: teams } = action.payload.data;

            teams = teams.map((team, index) => ({ index: index + 1, ...team }));

            return state.set('teams', fromJS(teams));
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
        type: EDIT_TEAM,
        onSuccess: (state, action) => {
            let { data: team } = action.paylod.data;

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

            return state.set('team', fromJS(team))
        }
    }),
    ...pender({
        type: EDIT_MANAGER
    }),
    [SELECT_MANAGER]: (state, action) => {
        const { payload: id } = action;

        const manager = state.getIn(['team', 'managers']).find(manager => manager.get('_id') === id)

        return state.set('manager', manager).set('editManager', manager);
    },
    [ON_CHANGE]: (state, action) => {
        const { target, name, value } = action.payload;

        return target ? state.setIn([target, name], value) : state.set(name, value);
    },
    [INITIALIZE]: (state, action) => {
        const { payload } = action;

        return state.set(payload, initialState.get(payload));
    }
}, initialState);