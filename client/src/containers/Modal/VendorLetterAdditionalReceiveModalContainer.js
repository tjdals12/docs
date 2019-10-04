import React from 'react';
import VendorLetterAdditionalReceiveModal from 'components/Modal/VendorLetterAdditionalReceiveModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as vendorLetterActions from 'store/modules/vendorLetter';
import * as vendorActions from 'store/modules/vendor';
import * as modalActions from 'store/modules/modal';

class VendorLetterAdditionalReceiveModalContainer extends React.Component {
	getVendorList = () => {
		const { VendorActions } = this.props;

		VendorActions.getVendorsForSelect();
	};

	getTransmittalsByVendor = (id) => {
		const { VendorLetterActions } = this.props;

		VendorLetterActions.getVendorLettersByVendor({ vendor: id });
	};

	handleClose = () => {
		const { ModalActions } = this.props;

		ModalActions.close('vendorLetterAdditionalReceive');
	};

	handleChange = (e) => {
		const { VendorLetterActions } = this.props;
		const { name, value } = e.target;

		if (name === 'vendor') {
			this.getTransmittalsByVendor(value);
		} else {
			VendorLetterActions.onChange({ target: 'additionalReceive', name, value });
		}
	};

	handleReadDirectory = (e) => {
		const { VendorLetterActions } = this.props;
		const { files } = e.target;
		const receiveDocuments = [];

		for (let i = 0; i < files.length; i++) {
			let file = files[i].name.split('_');

			if (file.length !== 3) continue;

			receiveDocuments.push({
				id: i,
				documentNumber: file[0],
				documentTitle: file[1],
				documentRev: file[2].replace('Rev.', '')
			});
		}

		VendorLetterActions.onChange({ target: 'errors', name: 'receiveDocumentsError', value: false });
		VendorLetterActions.onChange({
			target: 'additionalReceive',
			name: 'receiveDocuments',
			value: receiveDocuments
		});
	};

	handleDeleteReceiveDocument = (id) => () => {
		const { VendorLetterActions } = this.props;

		VendorLetterActions.deleteReceiveDocument({ id, target: 'additionalReceive' });
	};

	handleAdditionalReceive = async () => {
		const { ModalActions, VendorLetterActions, data } = this.props;
		const { id, receiveDocuments } = data.toJS();

		await VendorLetterActions.additionalReceiveVendorLetter({ id, param: receiveDocuments });
		ModalActions.close('vendorLetterAdditionalReceive');
	};

	render() {
		const { vendorList, transmittalsByVendor, data, errors, isOpen } = this.props;

		if (!vendorList) return null;

		return (
			<VendorLetterAdditionalReceiveModal
				vendorList={vendorList}
				transmittalsByVendor={transmittalsByVendor}
				data={data}
				errors={errors}
				isOpen={isOpen}
				onClose={this.handleClose}
				onChange={this.handleChange}
				onReadDirectory={this.handleReadDirectory}
				onDeleteReceiveDocument={this.handleDeleteReceiveDocument}
				onAdditionalReceive={this.handleAdditionalReceive}
			/>
		);
	}
}

export default connect(
	(state) => ({
		vendorList: state.vendor.get('vendorList'),
		transmittalsByVendor: state.vendorLetter.get('vendorLettersByVendor'),
		data: state.vendorLetter.get('additionalReceive'),
		errors: state.vendorLetter.get('errors'),
		isOpen: state.modal.get('vendorLetterAdditionalReceiveModal')
	}),
	(dispatch) => ({
		VendorLetterActions: bindActionCreators(vendorLetterActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch)
	})
)(VendorLetterAdditionalReceiveModalContainer);
