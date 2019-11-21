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
	state = {
		page: 1
	}

	getCmcodes = (major) => {
		const { CmcodeActions } = this.props;

		CmcodeActions.getCmcodeByMajorExcludeRemoved({ major: major });
	};

	getDocument = (id) => {
		const { DocumentActions } = this.props;

		DocumentActions.getDocument({ id });
	};

	handleMoreDocument = async (id, stopIndex) => {
		const { VendorLetterActions } = this.props;
		const nextPage = Math.ceil(stopIndex / 20);
		const page = this.state.page;

		if(page < nextPage) {
			this.setState({
				page: nextPage
			});

			await VendorLetterActions.getVendorLetterOnlyDocuments({ id, page: nextPage });
		}
	}

	handleClose = (name) => () => {
		const { ModalActions, VendorLetterActions } = this.props;

		this.setState({
			page: 1
		})
		VendorLetterActions.initialize('reasonError');
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

	handleOpenDetail = async (id) => {
		const { ModalActions } = this.props;

		await this.getDocument(id);
		ModalActions.open('documentDetail');
	};

	handleDelete = async ({ id, yn }) => {
		const { VendorLetterActions, reason } = this.props;

		await VendorLetterActions.deleteVendorLetter({ id, yn, reason });
		this.setState({
			page: 1
		})
	};

	handleDate = (date) => {
		const { VendorLetterActions } = this.props;

		VendorLetterActions.onChange({ name: 'date', value: date });
	};

	handleStatus = async ({ id }) => {
		const { VendorLetterActions, selectedStatus, date } = this.props;

		await VendorLetterActions.inOutVendorLetter(id, Object.assign(JSON.parse(selectedStatus), { date: date }));
		this.setState({
			page: 1
		});
	};

	handleDeleteStatus = async () => {
		const { ModalActions, VendorLetterActions, transmittal, target } = this.props;

		await VendorLetterActions.deleteInOutVendorLetter({ id: transmittal.get('_id'), target });
		this.setState({
			page: 1
		});
		ModalActions.close('question');
	};

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getCmcodes('0003');
		}
	}

	render() {
		const { codes, date, isOpen, isOpenQuestion, transmittal, documentsCount, reasonError, loading, inOutLoading } = this.props;

		if (!codes || loading || loading === undefined) return null;

		return (
			<VendorLetterDetailModal
				loading={inOutLoading}
				codes={codes}
				date={date}
				reasonError={reasonError}
				isOpen={isOpen}
				isOpenQuestion={isOpenQuestion}
				data={transmittal}
				documentsCount={documentsCount}
				onMoreDocuments={this.handleMoreDocument}
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
		documentsCount: state.vendorLetter.get('documentsCount'),
		reason: state.vendorLetter.get('reason'),
		reasonError: state.vendorLetter.get('reasonError'),
		target: state.vendorLetter.get('target'),
		loading: state.pender.pending['vendorletter/GET_VENDORLETTER'],
		inOutLoading: state.pender.pending['vendorletter/INOUT_VENDORLETTER']
	}),
	(dispatch) => ({
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch),
		VendorLetterActions: bindActionCreators(vendorLetterActions, dispatch),
		DocumentActions: bindActionCreators(documentActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch)
	})
)(VendorLetterDetailModalContainer);
