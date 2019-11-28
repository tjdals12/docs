import React from 'react';
import { withRouter } from 'react-router-dom';
import VendorSearchForm from 'components/Form/VendorSearchForm';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as projectActions from 'store/modules/project';
import * as teamActions from 'store/modules/team';
import * as cmcodeActions from 'store/modules/cmcode';
import * as vendorActions from 'store/modules/vendor';

class VendorSearchFormContainer extends React.Component {
	getProjectList = async () => {
		const { ProjectActions } = this.props;

		await ProjectActions.getProjectsForSelect();
	}

	getManagerList = async () => {
		const { TeamActions } = this.props;

		await TeamActions.getTeamsForSelect();
	}

	getCmcodes = async (major) => {
		const { CmcodeActions } = this.props;

		await CmcodeActions.getCmcodeByMajorExcludeRemoved(major);
	};

	handleChange = (e) => {
		const { VendorActions } = this.props;
		const { name, value } = e.target;

		VendorActions.onChange({ target: 'search', name, value });
	};

	handleSearch = async () => {
		const { VendorActions, search, history } = this.props;

		await VendorActions.searchVendors(1, search.toJS());
		history.push('/vendors?page=1');
	};

	handleFullPeriod = () => {
		const { VendorActions } = this.props;

		VendorActions.setToFullPeriod();
	};

	componentDidMount() {
		this.getProjectList();
		this.getManagerList();
		this.getCmcodes('0001');
	}

	render() {
		const { projectList, managerList, parts, search } = this.props;

		if (!projectList || !managerList || !parts) return null;

		return (
			<VendorSearchForm
				projectList={projectList}
				managerList={managerList}
				parts={parts}
				search={search}
				onChange={this.handleChange}
				onSearch={this.handleSearch}
				onFullPeriod={this.handleFullPeriod}
			/>
		);
	}
}

export default connect(
	(state) => ({
		projectList: state.project.get('projectList'),
		managerList: state.team.get('teamList'),
		parts: state.cmcode.get('0001'),
		search: state.vendor.get('search')
	}),
	(dispatch) => ({
		ProjectActions: bindActionCreators(projectActions, dispatch),
		TeamActions: bindActionCreators(teamActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch),
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch)
	})
)(withRouter(VendorSearchFormContainer));
