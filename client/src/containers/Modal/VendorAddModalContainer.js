import React from 'react';
import VendorAddModal from 'components/Modal/VendorAddModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as projectActions from 'store/modules/project';
import * as teamActions from 'store/modules/team';
import * as modalActions from 'store/modules/modal';
import * as cmcodeActions from 'store/modules/cmcode';
import * as vendorActions from 'store/modules/vendor';

class VendorAddModalContainer extends React.Component {
	getManagerList = async () => {
		const { TeamActions } = this.props;

		await TeamActions.getTeamsForSelect();
	}

	getProjectList = async () => {
		const { ProjectActions } = this.props;

		await ProjectActions.getProjectsForSelect();
	}

	getCmcodes = async (major) => {
		const { CmcodeActions } = this.props;

		await CmcodeActions.getCmcodeByMajorExcludeRemoved({ major: major });
	};

	handleClose = (name) => () => {
		const { ModalActions } = this.props;

		ModalActions.close(name);
	};

	handleChange = (e) => {
		const { VendorActions } = this.props;
		const { name, value } = e.target;

		VendorActions.onChange({ target: 'add', name, value });
	};

	handleInsert = async () => {
		const { VendorActions, add } = this.props;

		await VendorActions.addVendor(add.toJS());
		this.handleClose('vendorAdd')();
	};

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getCmcodes('0001');
			this.getProjectList();
			this.getManagerList();
		}
	}

	render() {
		const { projectList, parts, managerList, errors, isOpen } = this.props;

		if (!projectList || !parts || !managerList) return null;

		return (
			<VendorAddModal
				projectList={projectList}
				parts={parts}
				managerList={managerList}
				errors={errors}
				isOpen={isOpen}
				onClose={this.handleClose}
				onChange={this.handleChange}
				onInsert={this.handleInsert}
			/>
		);
	}
}

export default connect(
	(state) => ({
		managerList: state.team.get('teamList'),
		projectList: state.project.get('projectList'),
		parts: state.cmcode.get('0001'),
		add: state.vendor.get('add'),
		errors: state.vendor.get('errors'),
		isOpen: state.modal.get('vendorAddModal')
	}),
	(dispatch) => ({
		ProjectActions: bindActionCreators(projectActions, dispatch),
		TeamActions: bindActionCreators(teamActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch),
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch)
	})
)(VendorAddModalContainer);
