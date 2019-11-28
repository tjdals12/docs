import React from 'react';
import VendorEditModal from 'components/Modal/VendorEditModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as projectActions from 'store/modules/project';
import * as teamActions from 'store/modules/team';
import * as cmcodeActions from 'store/modules/cmcode';
import * as modalActions from 'store/modules/modal';
import * as vendorActions from 'store/modules/vendor';

class VendorEditModalContainer extends React.Component {
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

		await CmcodeActions.getCmcodeByMajorExcludeRemoved(major);
	};

	handleEdit = async () => {
		const { ModalActions, VendorActions, id, vendor } = this.props;

		await VendorActions.editVendor(id, vendor.toJS());
		ModalActions.close('vendorEdit');
		ModalActions.open('vendorDetail');
	};

	handleChange = (e) => {
		const { VendorActions } = this.props;
		const { name, value } = e.target;

		VendorActions.onChange({ target: 'edit', name, value });
	};

	handleClose = (name) => () => {
		const { ModalActions } = this.props;

		ModalActions.close(name);
	};

	handleChangePerson = (e, index) => {
		const { VendorActions } = this.props;
		const { name, value } = e.target;

		VendorActions.onChangeDeep({ target: 'edit', nestedTarget: 'vendorPerson', index: index, name, value });
	}

	handleDeletePerson = (index) => {
		const { VendorActions } = this.props;

		VendorActions.onDeletePerson(index);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getCmcodes('0001');
			this.getProjectList();
			this.getManagerList();
		}
	}

	render() {
		const { projectList, parts, managerList, vendor, errors, isOpen } = this.props;

		if (!projectList || !parts || !managerList) return null;

		return (
			<VendorEditModal
				projectList={projectList}
				parts={parts}
				managerList={managerList}
				data={vendor}
				errors={errors}
				isOpen={isOpen}
				onClose={this.handleClose}
				onChange={this.handleChange}
				onChangePerson={this.handleChangePerson}
				onDeletePerson={this.handleDeletePerson}
				onEdit={this.handleEdit}
			/>
		);
	}
}

export default connect(
	(state) => ({
		id: state.vendor.getIn(['vendor', 'id']),
		projectList: state.project.get('projectList'),
		parts: state.cmcode.get('0001'),
		managerList: state.team.get('teamList'),
		vendor: state.vendor.get('edit'),
		errors: state.vendor.get('errors'),
		isOpen: state.modal.get('vendorEditModal')
	}),
	(dispatch) => ({
		ProjectActions: bindActionCreators(projectActions, dispatch),
		TeamActions: bindActionCreators(teamActions, dispatch),
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch)
	})
)(VendorEditModalContainer);
