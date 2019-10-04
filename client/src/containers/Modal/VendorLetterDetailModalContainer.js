import React from 'react';
import VendorLetterDetailModal from 'components/Modal/VendorLetterDetailModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cmcodeActions from 'store/modules/cmcode';
import * as vendorActions from 'store/modules/vendor';
import * as vendorLetterActions from 'store/modules/vendorLetter';
import * as documentActions from 'store/modules/document';
import * as modalActions from 'store/modules/modal';

class VendorLetterDetailModalContainer extends React.Component {
	getCmcodes = (major) => {
		const { CmcodeActions } = this.props;

		CmcodeActions.getCmcodeByMajor({ major: major });
	};

	getDocument = (id) => {
		const { DocumentActions } = this.props;

		DocumentActions.getDocument({ id });
	};

	handleClose = (name) => () => {
		const { ModalActions } = this.props;

		ModalActions.close(name);
	};

	handleChange = (e) => {
		const { VendorLetterActions } = this.props;
		const { name, value } = e.target;

		VendorLetterActions.onChange({ name, value });
	};

	handleTarget = ({ id }) => {
		const { VendorLetterActions } = this.props;

		VendorLetterActions.setTarget(id);
	};

	handleTargetVendor = (id) => {
		const { VendorActions } = this.props;

		VendorActions.setTarget(id);
	};

	handleOpen = (name) => () => {
		const { ModalActions } = this.props;

		if (name === 'vendorLetterEdit') {
			ModalActions.close('vendorLetterDetail');
		}

		ModalActions.open(name);
	};

	handleOpenDetail = (id) => async () => {
		const { ModalActions } = this.props;

		await this.getDocument(id);
		ModalActions.open('documentDetail');
	};

	handleDelete = ({ id, yn }) => () => {
		const { VendorLetterActions, reason } = this.props;

		VendorLetterActions.deleteVendorLetter({ id, yn, reason });
	};

	handleDate = (date) => {
		const { VendorLetterActions } = this.props;

		VendorLetterActions.onChange({ name: 'date', value: date });
	};

	handleStatus = ({ id }) => () => {
		const { VendorLetterActions, selectedStatus, date } = this.props;

		VendorLetterActions.inOutVendorLetter(id, Object.assign(JSON.parse(selectedStatus), { date: date }));
	};

	handleDeleteStatus = async () => {
		const { ModalActions, VendorLetterActions, transmittal, target } = this.props;

		await VendorLetterActions.deleteInOutVendorLetter({ id: transmittal.get('_id'), target });
		ModalActions.close('question');
	};

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getCmcodes('0003');
		}
	}

	render() {
		const { codes, date, isOpen, isOpenQuestion, transmittal, reasonError, loading } = this.props;

		if (!codes || loading || loading === undefined) return null;

		return (
			<VendorLetterDetailModal
				codes={codes}
				date={date}
				reasonError={reasonError}
				isOpen={isOpen}
				isOpenQuestion={isOpenQuestion}
				data={transmittal}
				onClose={this.handleClose}
				onChange={this.handleChange}
				onTarget={this.handleTarget}
				onTargetVendor={this.handleTargetVendor}
				onOpen={this.handleOpen}
				onOpenDetail={this.handleOpenDetail}
				onDelete={this.handleDelete}
				onDate={this.handleDate}
				onStatus={this.handleStatus}
				onDeleteStatus={this.handleDeleteStatus}
			/>
		);
	}
}

export default connect(
	(state) => ({
		codes: state.cmcode.get('0003'),
		selectedStatus: state.vendorLetter.get('status'),
		date: state.vendorLetter.get('date'),
		isOpen: state.modal.get('vendorLetterDetailModal'),
		isOpenQuestion: state.modal.get('questionModal'),
		transmittal: state.vendorLetter.get('vendorLetter'),
		reason: state.vendorLetter.get('reason'),
		reasonError: state.vendorLetter.get('reasonError'),
		target: state.vendorLetter.get('target'),
		loading: state.pender.pending['vendorletter/GET_VENDORLETTER']
	}),
	(dispatch) => ({
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch),
		VendorLetterActions: bindActionCreators(vendorLetterActions, dispatch),
		DocumentActions: bindActionCreators(documentActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch)
	})
)(VendorLetterDetailModalContainer);
