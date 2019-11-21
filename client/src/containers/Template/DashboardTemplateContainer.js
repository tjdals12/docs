import React from 'react';
import DashboardTemplate from 'templates/DashboardTemplate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dashboardActions from 'store/modules/dashboard';

class DashboardTemplateContainer extends React.Component {
    getDashboardDatas = async (id) => {
        const { DashboardActions } = this.props;

        await DashboardActions.getDashboardDatas({ id });
    }

    componentDidMount() {
        // TODO: Main Project의 ID를 가져오도록
        this.getDashboardDatas('5d89c8be523cbf13cd173729');
    }

    render() {
        const { project, contractedVendors, managedDocuments, receivedVendorLetters, loading } = this.props;

        if(loading || loading === undefined) return null;

        return (
            <DashboardTemplate
                project={project.toJS()}
                managedDocuments={managedDocuments.toJS()}
                receivedVendorLetters={receivedVendorLetters.toJS()}
                contractedVendors={contractedVendors}
            />
        )
    }
}

export default connect(
    (state) => ({
        project: state.dashboard.get('project'),
        contractedVendors: state.dashboard.get('contractedVendors'),
        managedDocuments: state.dashboard.get('managedDocuments'),
        receivedVendorLetters: state.dashboard.get('receivedVendorLetters'),
        loading: state.pender.pending['dashboard/GET_DASHBOARD_DATAS']
    }),
    (dispatch) => ({
        DashboardActions: bindActionCreators(dashboardActions, dispatch)
    })
)(DashboardTemplateContainer)