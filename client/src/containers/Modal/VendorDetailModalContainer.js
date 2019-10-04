import React from 'react';
import VendorDetailModal from 'components/Modal/VendorDetailModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modalActions from 'store/modules/modal';
import * as vendorActions from 'store/modules/vendor';

class VendorDetailModalContainer extends React.Component {
	getVendor = () => {
		const { VendorActions, target } = this.props;

		VendorActions.getVendor({ id: target });
	};

	handleTarget = ({ id }) => {
		const { VendorActions } = this.props;

		VendorActions.setTarget(id);
	};

	handleOpen = (name) => () => {
		const { ModalActions, VendorActions } = this.props;

		if (name === 'vendorEdit') {
			VendorActions.initialize('errors');
			ModalActions.close('vendorDetail');
		}

		ModalActions.open(name);
	};

	handleClose = (name) => () => {
		const { ModalActions } = this.props;

		ModalActions.close(name);
	};

	handleDelete = async () => {
		const { ModalActions, VendorActions, target } = this.props;

		await VendorActions.deleteVendor({ id: target });
		ModalActions.close('vendorDetail');
	};

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getVendor();
		}
	}

	render() {
		const { isOpen, isOpenQuestion, vendor, loading } = this.props;

		if (loading === undefined || loading) return null;

		return (
			<VendorDetailModal
				isOpen={isOpen}
				isOpenQuestion={isOpenQuestion}
				data={vendor}
				onOpen={this.handleOpen}
				onClose={this.handleClose}
				onDelete={this.handleDelete}
				onTarget={this.handleTarget}
			/>
		);
	}
}

export default connect(
	(state) => ({
		isOpen: state.modal.get('vendorDetailModal'),
		isOpenQuestion: state.modal.get('questionModal'),
		vendor: state.vendor.get('vendor'),
		target: state.vendor.get('target'),
		loading: state.pender.pending['vendor/GET_VENDOR']
	}),
	(dispatch) => ({
		ModalActions: bindActionCreators(modalActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch)
	})
)(VendorDetailModalContainer);
