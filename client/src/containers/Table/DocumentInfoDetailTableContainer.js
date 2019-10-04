import React from 'react';
import DocumentInfoDetailTable from 'components/Table/DocumentInfoDetailTable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as vendorLetterActions from 'store/modules/vendorLetter';
import * as modalActions from 'store/modules/modal';
import * as documentActions from 'store/modules/document';

class DocumentInfoDetailTableContainer extends React.Component {
	getDocument = (id) => {
		const { DocumentActions } = this.props;

		DocumentActions.getDocument({ id });
	};

	getVendorLetter = (id) => {
		const { VendorLetterActions } = this.props;

		VendorLetterActions.getVendorLetter({ id });
	};

	handleOpen = ({ id }) => async () => {
		const { ModalActions } = this.props;

		await this.getDocument(id);
		ModalActions.open('documentDetail');
	};

	render() {
		const { data } = this.props;

		return <DocumentInfoDetailTable data={data} onOpen={this.handleOpen} />;
	}
}

export default connect(
	(state) => ({}),
	(dispatch) => ({
		VendorLetterActions: bindActionCreators(vendorLetterActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch),
		DocumentActions: bindActionCreators(documentActions, dispatch)
	})
)(DocumentInfoDetailTableContainer);
