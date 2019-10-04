import React from 'react';
import DocumentInfoDetailModal from 'components/Modal/DocumentInfoDetailModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as documentActions from 'store/modules/document';
import * as vendorActions from 'store/modules/vendor';
import * as modalActions from 'store/modules/modal';

class DocumentInfoDetailModalContainer extends React.Component {
	getDocument = (id) => {
		const { DocumentActions } = this.props;

		DocumentActions.getDocument({ id });
	};

	handleTarget = (id) => {
		const { VendorActions } = this.props;

		VendorActions.setTarget(id);
	};

	handleOpenVendor = () => {
		const { ModalActions } = this.props;

		ModalActions.open('vendorDetail');
	};

	handleOpenDetail = (id) => async () => {
		const { ModalActions } = this.props;

		await this.getDocument(id);

		ModalActions.open('documentDetail');
	};

	handleClose = () => {
		const { ModalActions } = this.props;

		ModalActions.close('documentInfoDetail');
	};

	render() {
		const { isOpen, info, loading } = this.props;

		if (loading || loading === undefined) return null;

		return (
			<DocumentInfoDetailModal
				isOpen={isOpen}
				data={info}
				onClose={this.handleClose}
				onTarget={this.handleTarget}
				onOpenVendor={this.handleOpenVendor}
				onOpenDetail={this.handleOpenDetail}
			/>
		);
	}
}

export default connect(
	(state) => ({
		isOpen: state.modal.get('documentInfoDetailModal'),
		info: state.info.get('info'),
		loading: state.pender.pending['info/GET_INFO']
	}),
	(dispatch) => ({
		DocumentActions: bindActionCreators(documentActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch)
	})
)(DocumentInfoDetailModalContainer);
