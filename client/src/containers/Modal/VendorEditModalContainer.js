import React from 'react';
import VendorEditModal from 'components/Modal/VendorEditModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cmcodeActions from 'store/modules/cmcode';
import * as modalActions from 'store/modules/modal';
import * as vendorActions from 'store/modules/vendor';

class VendorEditModalContainer extends React.Component {
	getCmcodes = async (major) => {
		const { CmcodeActions } = this.props;

		await CmcodeActions.getCmcodeByMajor({ major: major });
	};

	handleEdit = async () => {
		const { ModalActions, VendorActions, id, vendor } = this.props;

		await VendorActions.editVendor({ id, vendor: vendor.toJS() });
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

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getCmcodes('0001');
		}
	}

	render() {
		const { parts, vendor, errors, isOpen } = this.props;

		if (!parts) return null;

		return (
			<VendorEditModal
				parts={parts}
				data={vendor}
				errors={errors}
				isOpen={isOpen}
				onClose={this.handleClose}
				onChange={this.handleChange}
				onEdit={this.handleEdit}
			/>
		);
	}
}

export default connect(
	(state) => ({
		id: state.vendor.getIn([ 'vendor', 'id' ]),
		parts: state.cmcode.get('0001'),
		vendor: state.vendor.get('edit'),
		errors: state.vendor.get('errors'),
		isOpen: state.modal.get('vendorEditModal')
	}),
	(dispatch) => ({
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch)
	})
)(VendorEditModalContainer);
