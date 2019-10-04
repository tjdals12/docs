import React from 'react';
import VendorAddModal from 'components/Modal/VendorAddModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modalActions from 'store/modules/modal';
import * as cmcodeActions from 'store/modules/cmcode';
import * as vendorActions from 'store/modules/vendor';

class VendorAddModalContainer extends React.Component {
	getCmcodes = async (major) => {
		const { CmcodeActions } = this.props;

		await CmcodeActions.getCmcodeByMajor({ major: major });
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
		}
	}

	render() {
		const { parts, errors, isOpen } = this.props;

		if (!parts) return null;

		return (
			<VendorAddModal
				parts={parts}
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
		parts: state.cmcode.get('0001'),
		add: state.vendor.get('add'),
		errors: state.vendor.get('errors'),
		isOpen: state.modal.get('vendorAddModal')
	}),
	(dispatch) => ({
		ModalActions: bindActionCreators(modalActions, dispatch),
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch)
	})
)(VendorAddModalContainer);
