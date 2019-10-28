import React from 'react';
import CollapseCard from 'components/Card/CollapseCard';
import ManagerCollapse from 'components/Collapse/ManagerCollapse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cmcodeActions from 'store/modules/cmcode';
import * as teamActions from 'store/modules/team';
import * as modalActions from 'store/modules/modal';

class ManagerCollaseCardContainer extends React.Component {
    state = {
        isOpen: false
    }

    getCmcodes = (major) => {
        const { CmcodeActions } = this.props;

        CmcodeActions.getCmcodeByMajorExcludeRemoved({ major: major });
    }

    getTeams = (page) => {
        const { TeamActions } = this.props;

        TeamActions.onChange({ name: 'page', value: page });
        TeamActions.getTeams(page);
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
        this.getTeams(1);
    }

    handleEdit = async (id) => {
        const { TeamActions, edit, page } = this.props;

        await TeamActions.editTeam({ id, param: edit.toJS() });
        this.getTeams(page);
    }

    handleDelete = async (id) => {
        const { TeamActions } = this.props;

        await TeamActions.deleteTeam(id);
        TeamActions.initialize('team');
        TeamActions.initialize('edit');
        this.getTeams(1);
    }

    handleSaveManager = async (id) => {
        const { TeamActions, addManager, page } = this.props;

        await TeamActions.addManager({ id, param: { ...addManager.toJS() } });
        this.getTeams(page);
        this.getTeam(id);
    }

    handleEditManager = async (id) => {
        const { TeamActions, editManager } = this.props;
        const { _id, name, position, effStaDt, effEndDt } = editManager.toJS();

        await TeamActions.editManager({ id, param: { managerId: _id, name, position, effStaDt, effEndDt } });
        this.getTeam(id);
    }

    handleDeleteManager = (id) => async () => {
        const { ModalActions, TeamActions, manager, page } = this.props;

        await TeamActions.deleteManager({ id, param: { managerId: manager.get('_id') } });
        ModalActions.close('question');
        TeamActions.initialize('manager');
        TeamActions.initialize('editManager');
        this.getTeams(page);
        this.getTeam();
    }

    handleOpen = (name) => {
        const { ModalActions } = this.props;

        ModalActions.open(name);
    }

    handleClose = (name) => () => {
        const { ModalActions } = this.props;

        ModalActions.close(name);
    }

    componentDidMount() {
        this.getCmcodes('0001');
        this.getTeams(1);
    }

    render() {
        const { isOpen } = this.state;
        const { isOpenQuestion, parts, teams, team, add, edit, manager, addManager, editManager, count, page, loading } = this.props;

        if (loading || loading === undefined || !parts) return null;

        return (
            <CollapseCard
                title="담당자 관리"
                description="담당자 관리"
                onToggle={this.handleToggle}
                onAddForm={this.handleAddForm}
                collapse={
                    <ManagerCollapse
                        isOpenQuestion={isOpenQuestion}
                        parts={parts}
                        teams={teams}
                        team={team}
                        add={add}
                        edit={edit}
                        manager={manager}
                        addManager={addManager}
                        editManager={editManager}
                        count={count}
                        page={page}
                        isOpen={isOpen}
                        onPage={this.getTeams}
                        onSelectTeam={this.getTeam}
                        onSelectManager={this.getManager}
                        onChange={this.handleChange}
                        onSave={this.handleSave}
                        onEdit={this.handleEdit}
                        onDelete={this.handleDelete}
                        onSaveManager={this.handleSaveManager}
                        onEditManager={this.handleEditManager}
                        onDeleteManager={this.handleDeleteManager}
                        onOpen={this.handleOpen}
                        onClose={this.handleClose}
                    />
                }
            />
        )
    }
}

export default connect(
    (state) => ({
        isOpenQuestion: state.modal.get('questionModal'),
        parts: state.cmcode.get('0001'),
        teams: state.team.get('teams'),
        team: state.team.get('team'),
        add: state.team.get('add'),
        edit: state.team.get('edit'),
        manager: state.team.get('manager'),
        addManager: state.team.get('addManager'),
        editManager: state.team.get('editManager'),
        count: state.team.get('count'),
        page: state.team.get('page'),
        loading: state.pender.pending['team/GET_TEAMS']
    }),
    (dispatch) => ({
        CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
        TeamActions: bindActionCreators(teamActions, dispatch),
        ModalActions: bindActionCreators(modalActions, dispatch)
    })
)(ManagerCollaseCardContainer);