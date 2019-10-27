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

    componentDidMount() {
        this.getCmcodes('0001');
        this.getTeams();
    }

    render() {
        const { isOpen } = this.state;
        const { parts, teams, team, manager, loading } = this.props;

        if (loading || loading === undefined || !parts) return null;

        return (
            <CollapseCard
                title="담당자 관리"
                description="담당자 관리"
                onToggle={this.handleToggle}
                collapse={
                    <ManagerCollapse
                        parts={parts}
                        teams={teams}
                        team={team}
                        manager={manager}
                        isOpen={isOpen}
                        onSelectTeam={this.getTeam}
                        onSelectManager={this.getManager}
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
        manager: state.team.get('manager'),
        loading: state.pender.pending['team/GET_TEAMS']
    }),
    (dispatch) => ({
        CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
        TeamActions: bindActionCreators(teamActions, dispatch)
    })
)(ManagerCollaseCardContainer);