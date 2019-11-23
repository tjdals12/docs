import React from 'react';
import CustomerDropdown from 'components/Dropdown/CustomDropdown';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as projectActions from 'store/modules/project';
import * as dashboardActions from 'store/modules/dashboard';

class ProjectDropdownContainer extends React.Component {
    getProjectList = async () => {
        const { ProjectActions } = this.props;

        await ProjectActions.getProjectsForSelect();
    }

    onSelectProject = async (project) => {
        const { DashboardActions } = this.props;
        const { key, value } = project;

        DashboardActions.setTarget({ key, value });
    }

    getter = (data) => {
        return ({ key: data._id, value: data.projectName });
    }

    componentDidMount() {
        this.getProjectList();
    }

    render() {
        const { target, projectList, loading, ...rest } = this.props;

        if(loading || loading === undefined) return null;

        return (
            <CustomerDropdown selectedMenu={target.toJS()} menus={projectList.toJS()} getter={this.getter} onSelect={this.onSelectProject} {...rest}/>
        )
    }
}

export default connect(
    (state) => ({
        target: state.dashboard.get('target'),
        projectList: state.project.get('projectList'),
        loading: state.pender.pending['project/GET_PROJECTS_FOR_SELECT']
    }),
    (dispatch) => ({
        ProjectActions: bindActionCreators(projectActions, dispatch),
        DashboardActions: bindActionCreators(dashboardActions, dispatch)
    })
)(ProjectDropdownContainer);