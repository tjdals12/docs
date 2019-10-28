import React from 'react';
import CollapseCard from 'components/Card/CollapseCard';
import ManagerCollapse from 'components/Collapse/ManagerCollapse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cmcodeActions from 'store/modules/cmcode';
import * as teamActions from 'store/modules/team';

class ManagerCollaseCardContainer extends React.Component {
    state = {
        isOpen: false
    }

    getCmcodes = (major) => {
        const { CmcodeActions } = this.props;

        CmcodeActions.getCmcodeByMajorExcludeRemoved({ major: major });
    }

    getTeams = () => {
        const { TeamActions } = this.props;

        TeamActions.getTeams();
    }

    getTeam = (id) => {
        const { TeamActions } = this.props;

        TeamActions.getTeam({ id });
    }

    getManager = (id) => {
        const { TeamActions } = this.props;

        TeamActions.selectManager(id);
    }

    handleToggle = () => {
        this.setState((prevState) => {
            let { isOpen } = prevState;

            return {
                isOpen: !isOpen
            }
        })
    }

    handleAddForm = () => {
        const { TeamActions } = this.props;

        TeamActions.initialize('team');
        TeamActions.initialize('add');
        TeamActions.initialize('manager');
        TeamActions.initialize('addManager');
    }

    handleChange = (target) => (e) => {
        const { TeamActions } = this.props;
        const { name, value } = e.target;

        TeamActions.onChange({ target, name, value });
    }

    handleSave = async () => {
        const { TeamActions, add } = this.props;

        await TeamActions.addTeam({ ...add.toJS() });
        this.getTeams();
    }

    handleEdit = async (id) => {
        const { TeamActions, edit } = this.props;

        await TeamActions.editTeam({ id, param: edit.toJS() });
        this.getTeams();
    }

    handleSaveManager = async (id) => {
        const { TeamActions, addManager } = this.props;

        await TeamActions.addManager({ id, param: { ...addManager.toJS() } });
        this.getTeams();
        this.getTeam(id);
    }

    handleEditManager = async (id) => {
        const { TeamActions, editManager } = this.props;
        const { _id, name, position, effStaDt, effEndDt } = editManager.toJS();

        await TeamActions.editManager({ id, param: { managerId: _id, name, position, effStaDt, effEndDt } });
        this.getTeam(id);
    }

    componentDidMount() {
        this.getCmcodes('0001');
        this.getTeams();
    }

    render() {
        const { isOpen } = this.state;
        const { parts, teams, team, add, edit, manager, addManager, editManager, loading } = this.props;

        if (loading || loading === undefined || !parts) return null;

        return (
            <CollapseCard
                title="담당자 관리"
                description="담당자 관리"
                onToggle={this.handleToggle}
                onAddForm={this.handleAddForm}
                collapse={
                    <ManagerCollapse
                        parts={parts}
                        teams={teams}
                        team={team}
                        add={add}
                        edit={edit}
                        manager={manager}
                        addManager={addManager}
                        editManager={editManager}
                        isOpen={isOpen}
                        onSelectTeam={this.getTeam}
                        onSelectManager={this.getManager}
                        onChange={this.handleChange}
                        onSave={this.handleSave}
                        onEdit={this.handleEdit}
                        onSaveManager={this.handleSaveManager}
                        onEditManager={this.handleEditManager}
                    />
                }
            />
        )
    }
}

export default connect(
    (state) => ({
        parts: state.cmcode.get('0001'),
        teams: state.team.get('teams'),
        team: state.team.get('team'),
        add: state.team.get('add'),
        edit: state.team.get('edit'),
        manager: state.team.get('manager'),
        addManager: state.team.get('addManager'),
        editManager: state.team.get('editManager'),
        loading: state.pender.pending['team/GET_TEAMS']
    }),
    (dispatch) => ({
        CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
        TeamActions: bindActionCreators(teamActions, dispatch)
    })
)(ManagerCollaseCardContainer);