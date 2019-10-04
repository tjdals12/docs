import React from 'react';
import VendorLetterReceiveModal from 'components/Modal/VendorLetterReceiveModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as vendorActions from 'store/modules/vendor';
import * as vendorLetterActions from 'store/modules/vendorLetter';
import * as modalActions from 'store/modules/modal';

class VendorLetterReceiveModalContainer extends React.Component {
	getVendorList = () => {
		const { VendorActions } = this.props;

		VendorActions.getVendorsForSelect();
	};

	handleClose = () => {
		const { ModalActions } = this.props;

		ModalActions.close('vendorLetterReceive');
	};

	handleChange = (e) => {
		const { VendorLetterActions } = this.props;
		const { name, value } = e.target;

		VendorLetterActions.onChange({ target: 'receive', name, value });
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
		VendorLetterActions.onChange({ target: 'receive', name: 'receiveDocuments', value: receiveDocuments });
	};

	handleDeleteReceiveDocument = (id) => () => {
		const { VendorLetterActions } = this.props;

		VendorLetterActions.deleteReceiveDocument({ id, target: 'receive' });
	};

	handleReceive = async () => {
		const { ModalActions, VendorLetterActions, receive } = this.props;

		await VendorLetterActions.receiveVendorLetter(receive.toJS());
		ModalActions.close('vendorLetterReceive');
	};

	componentDidMount() {
		this.getVendorList();
	}

	render() {
		const { vendorList, receive, errors, isOpen } = this.props;

		if (!vendorList) return null;

		return (
			<VendorLetterReceiveModal
				vendorList={vendorList}
				isOpen={isOpen}
				data={receive}
				errors={errors}
				onClose={this.handleClose}
				onChange={this.handleChange}
				onReadDirectory={this.handleReadDirectory}
				onDeleteReceiveDocument={this.handleDeleteReceiveDocument}
				onReceive={this.handleReceive}
			/>
		);
	}
}

export default connect(
	(state) => ({
		vendorList: state.vendor.get('vendorList'),
		receive: state.vendorLetter.get('receive'),
		errors: state.vendorLetter.get('errors'),
		isOpen: state.modal.get('vendorLetterReceiveModal')
	}),
	(dispatch) => ({
		VendorActions: bindActionCreators(vendorActions, dispatch),
		VendorLetterActions: bindActionCreators(vendorLetterActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch)
	})
)(VendorLetterReceiveModalContainer);
