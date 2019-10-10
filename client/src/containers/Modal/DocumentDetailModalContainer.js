import React from 'react';
import DocumentDetailModal from 'components/Modal/DocumentDetailModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cmcodeActions from 'store/modules/cmcode';
import * as modalActions from 'store/modules/modal';
import * as documentActions from 'store/modules/document';
import * as vendorActions from 'store/modules/vendor';

class DocumentDetailModalContainer extends React.Component {
	getCmcodes = async (major) => {
		const { CmcodeActions } = this.props;

		await CmcodeActions.getCmcodeByMajorExcludeRemoved({ major: major });
	};

	handleTarget = ({ id }) => {
		const { DocumentActions } = this.props;

		DocumentActions.setTarget(id);
	};

	handleTargetVendor = ({ id }) => {
		const { VendorActions } = this.props;

		VendorActions.setTarget(id);
	};

	handleOpen = (name) => () => {
		const { ModalActions, DocumentActions } = this.props;

		if (name === 'documentEdit') {
			ModalActions.close('documentDetail');
		}

		DocumentActions.initialize('errors');
		ModalActions.open(name);
	};

	handleClose = (name) => () => {
		const { ModalActions } = this.props;

		ModalActions.close(name);
	};

	handleHold = ({ id, yn }) => async () => {
		const { DocumentActions, reason } = this.props;

		await DocumentActions.holdDocument({ id, yn, reason });
		DocumentActions.onChange({ name: 'reason', value: '' });
	};

	handleDelete = ({ id, yn }) => async () => {
		const { DocumentActions, reason } = this.props;

		await DocumentActions.deleteDocument({ id, yn, reason });
		DocumentActions.onChange({ name: 'reason', value: '' });
	};

	handleChange = (e) => {
		const { DocumentActions } = this.props;
		const { name, value } = e.target;

		DocumentActions.onChange({ name, value });
	};

	handleDate = (date) => {
		const { DocumentActions } = this.props;

		DocumentActions.onChange({ name: 'date', value: date });
	};

	handleStatus = ({ id }) => async () => {
		const { DocumentActions, selectedStatus, date } = this.props;

		await DocumentActions.inOutDocument(id, Object.assign(JSON.parse(selectedStatus), { date: date }));
	};

	handleDeleteStatus = async () => {
		const { DocumentActions, ModalActions, document, target } = this.props;

		await DocumentActions.deleteInOutDocument({ id: document.get('_id'), target });
		ModalActions.close('question');
	};

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getCmcodes('0003');
		}
	}

	render() {
		const { codes, date, isOpen, isOpenQuestion, document, reason, reasonError, loading } = this.props;

		if (!codes || (loading === undefined || loading)) return null;

		return (
			<DocumentDetailModal
				codes={codes}
				date={date}
				isOpen={isOpen}
				isOpenQuestion={isOpenQuestion}
				data={document}
				reason={reason}
				reasonError={reasonError}
				onOpen={this.handleOpen}
				onClose={this.handleClose}
				onHold={this.handleHold}
				onDelete={this.handleDelete}
				onChange={this.handleChange}
				onDate={this.handleDate}
				onStatus={this.handleStatus}
				onDeleteStatus={this.handleDeleteStatus}
				onTarget={this.handleTarget}
				onTargetVendor={this.handleTargetVendor}
			/>
		);
	}
}

export default connect(
	(state) => ({
		codes: state.cmcode.get('0003'),
		selectedStatus: state.document.get('status'),
		date: state.document.get('date'),
		isOpen: state.modal.get('documentDetailModal'),
		isOpenQuestion: state.modal.get('questionModal'),
		document: state.document.get('document'),
		reason: state.document.get('reason'),
		reasonError: state.document.get('reasonError'),
		target: state.document.get('target'),
		loading: state.pender.pending['document/GET_DOCUMENT']
	}),
	(dispatch) => ({
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch),
		DocumentActions: bindActionCreators(documentActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch)
	})
)(DocumentDetailModalContainer);
