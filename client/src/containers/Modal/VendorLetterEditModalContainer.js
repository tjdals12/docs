import React from 'react';
import VendorLetterEditModal from 'components/Modal/VendorLetterEditModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as vendorActions from 'store/modules/vendor';
import * as vendorLetterActions from 'store/modules/vendorLetter';
import * as modalActions from 'store/modules/modal';

class VendorLetterEditModalContainer extends React.Component {
	state = {
		page: 2
	}

	getVendorList = () => {
		const { VendorActions } = this.props;

		VendorActions.getVendorsForSelect();
	};

	handleMoreDocument = async (id, startIndex) => {
		const { VendorLetterActions } = this.props;
		const nextPage = (startIndex / 20) + 1;
		const page = this.state.page;

		if(page < nextPage) {
			this.setState({
				page: nextPage
			});

			await VendorLetterActions.getVendorLetterOnlyDocuments(id, nextPage);
		}
	}

	handleClose = () => {
		const { ModalActions } = this.props;

		this.setState({
			page: 1
		});
		ModalActions.close('vendorLetterEdit');
	};

	handleChange = (e) => {
		const { VendorLetterActions } = this.props;
		const { name, value } = e.target;

		VendorLetterActions.onChange({ target: 'edit', name, value });
	};

	handleSetDeleteDocument = (id) => () => {
		const { VendorLetterActions } = this.props;

		VendorLetterActions.setDeleteDocument(id);
	};

	handleEdit = async () => {
		const { ModalActions, VendorLetterActions, edit } = this.props;
		const {
			_id,
			vendor,
			officialNumber,
			senderGb,
			sender,
			receiverGb,
			receiver,
			deleteDocuments,
			receiveDate,
			targetDate
		} = edit.toJS();

		await VendorLetterActions.editVendorLetter(
			_id,
			{
				vendor,
				officialNumber,
				senderGb,
				sender,
				receiverGb,
				receiver,
				deleteDocuments,
				receiveDate,
				targetDate
			});

		ModalActions.close('vendorLetterEdit');
	};

	componentDidMount() {
		this.getVendorList();
	}

	render() {
		const { vendorList, isOpen, edit, documentsCount, errors, loading, editLoading } = this.props;

		if (loading || loading === undefined) return null;

		return (
			<VendorLetterEditModal
				loading={editLoading}
				vendorList={vendorList}
				isOpen={isOpen}
				data={edit}
				documentsCount={documentsCount}
				errors={errors}
				onMoreDocuments={this.handleMoreDocument}
				onClose={this.handleClose}
				onChange={this.handleChange}
				onSetDeleteDocument={this.handleSetDeleteDocument}
				onEdit={this.handleEdit}
			/>
		);
	}
}

export default connect(
	(state) => ({
		vendorList: state.vendor.get('vendorList'),
		isOpen: state.modal.get('vendorLetterEditModal'),
		edit: state.vendorLetter.get('edit'),
		documentsCount: state.vendorLetter.get('documentsCount'),
		errors: state.vendorLetter.get('errors'),
		loading: state.pender.pending['vendorletter/GET_VENDORLETTER'],
		editLoading: state.pender.pending['vendorletter/EDIT_VENDORLETTER']
	}),
	(dispatch) => ({
		VendorActions: bindActionCreators(vendorActions, dispatch),
		VendorLetterActions: bindActionCreators(vendorLetterActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch)
	})
)(VendorLetterEditModalContainer);
