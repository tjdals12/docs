import React from 'react';
import DocumentAddModal from 'components/Modal/DocumentAddModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cmcodeActions from 'store/modules/cmcode';
import * as modalActions from 'store/modules/modal';
import * as documentActions from 'store/modules/document';
import * as vendorActions from 'store/modules/vendor';
class DocumentAddModalContainer extends React.Component {
	getCmcodes = (major) => {
		const { CmcodeActions } = this.props;

		CmcodeActions.getCmcodeByMajor({ major: major });
	};

	getVendorList = () => {
		const { VendorActions } = this.props;

		VendorActions.getVendorsForSelect();
	};

	handleInsert = async () => {
		const { document, DocumentActions } = this.props;

		await DocumentActions.addDocument(document.toJS());
		this.handleClose();
	};

	handleChange = (e) => {
		const { DocumentActions } = this.props;
		const { name, value } = e.target;

		DocumentActions.onChange({ target: 'add', name, value });
	};

	handleClose = () => {
		const { ModalActions } = this.props;

		ModalActions.close('documentAdd');
	};

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getCmcodes('0001');
			this.getCmcodes('0002');
			this.getVendorList();
		}
	}

	render() {
		const { vendorList, parts, gbs, errors, isOpen } = this.props;

		if (!parts || !gbs || !vendorList) return null;

		return (
			<DocumentAddModal
				vendorList={vendorList}
				parts={parts}
				gbs={gbs}
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
		vendorList: state.vendor.get('vendorList'),
		parts: state.cmcode.get('0001'),
		gbs: state.cmcode.get('0002'),
		document: state.document.get('add'),
		errors: state.document.get('errors'),
		isOpen: state.modal.get('documentAddModal')
	}),
	(dispatch) => ({
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch),
		DocumentActions: bindActionCreators(documentActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch)
	})
)(DocumentAddModalContainer);
