import React from 'react';
import DashboardTemplate from 'templates/DashboardTemplate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dashboardActions from 'store/modules/dashboard';

class DashboardTemplateContainer extends React.Component {
    getWidgetDatas = async (id) => {
        const { DashboardActions } = this.props;

        await DashboardActions.getWidgetDatas({ id });
    }

    getVendorDatas = async (id) => {
        const { DashboardActions } = this.props;

        await DashboardActions.getVendorDatas({ id });
    }

    componentDidMount() {
        // TODO: Main Project의 ID를 가져오도록
        const id = '5d89c8be523cbf13cd173729';
        this.getWidgetDatas(id);
        this.getVendorDatas(id);
    }

    render() {
        const { 
            project,
            contractedVendors,
            managedDocuments,
            receivedVendorLetters,
            vendorsCountGroupByPart,
            vendorsCountGroupByStartDt,
            widgetLoading,
            vendorLoading
        } = this.props;

        if((widgetLoading || vendorLoading) || (widgetLoading === undefined || vendorLoading === undefined)) return null;

        return (
            <DashboardTemplate
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