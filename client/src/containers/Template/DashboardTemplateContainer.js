import React from 'react';
import DashboardTemplate from 'templates/DashboardTemplate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dashboardActions from 'store/modules/dashboard';
import Loader from 'components/Loader';

class DashboardTemplateContainer extends React.Component {
    getProjects = async () => {
        const { DashboardActions } = this.props;

        await DashboardActions.getDashboardProjects();
    }

    getWidgetDatas = async (id) => {
        const { DashboardActions } = this.props;

        await DashboardActions.getWidgetDatas(id);
    }

    getVendorDatas = async (id) => {
        const { DashboardActions } = this.props;

        await DashboardActions.getVendorDatas(id);
    }

    handleSelectProject = async (project) => {
        const { DashboardActions } = this.props;
        const { key, value } = project;

        DashboardActions.setTarget({ key, value });
    }

    componentDidMount() {
        this.getProjects();
        // const id = '5d89c8be523cbf13cd173729';
        // this.getWidgetDatas(id);
        // this.getVendorDatas(id);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.target.get('key') !== this.props.target.get('key')) {
            const { key } = this.props.target.toJS();

            this.getWidgetDatas(key);
            this.getVendorDatas(key);
        }
    }

    render() {
        const { 
            target,
            projects,
            project,
            contractedVendors,
            managedDocuments,
            receivedVendorLetters,
            vendorsCountGroupByPart,
            vendorsCountGroupByStartDt,
            widgetLoading,
            vendorLoading
        } = this.props;

        if((widgetLoading || vendorLoading) || (widgetLoading === undefined || vendorLoading === undefined))
            return <Loader size={30} margin={10} className="mt-5"/>

        return (
            <DashboardTemplate
                target={target.toJS()}
                projects={projects.toJS()}
                onSelectProject={this.handleSelectProject}
                project={project.toJS()}
                managedDocuments={managedDocuments.toJS()}
                receivedVendorLetters={receivedVendorLetters.toJS()}
                contractedVendors={contractedVendors}
                vendorsCountGroupByStartDt={vendorsCountGroupByStartDt.toJS()}
                vendorsCountGroupByPart={vendorsCountGroupByPart.toJS()}
            />
        )
    }
}

export default connect(
    (state) => ({
        target: state.dashboard.get('target'),
        projects: state.dashboard.get('projects'),
        project: state.dashboard.get('project'),
        contractedVendors: state.dashboard.get('contractedVendors'),
        managedDocuments: state.dashboard.get('managedDocuments'),
        receivedVendorLetters: state.dashboard.get('receivedVendorLetters'),
        vendorsCountGroupByStartDt: state.dashboard.get('vendorsCountGroupByStartDt'),
        vendorsCountGroupByPart: state.dashboard.get('vendorsCountGroupByPart'),
        widgetLoading: state.pender.pending['dashboard/GET_WIDGET_DATAS'],
        vendorLoading: state.pender.pending['dashboard/GET_VENDOR_DATAS']
    }),
    (dispatch) => ({
        DashboardActions: bindActionCreators(dashboardActions, dispatch)
    })
)(DashboardTemplateContainer)