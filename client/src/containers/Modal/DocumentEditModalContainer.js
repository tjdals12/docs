import React from 'react';
import DocumentEditModal from 'components/Modal/DocumentEditModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cmcodeActions from 'store/modules/cmcode';
import * as modalActions from 'store/modules/modal';
import * as documentActions from 'store/modules/document';
import * as vendorActions from 'store/modules/vendor';

class DocumentEditModalContainer extends React.Component {
	getCmcodes = async (major) => {
		const { CmcodeActions } = this.props;

		await CmcodeActions.getCmcodeByMajor({ major: major });
	};

	getVendorList = async () => {
		const { VendorActions } = this.props;

		await VendorActions.getVendorsForSelect();
	};

	handleEdit = async () => {
		const { DocumentActions, ModalActions, id, document } = this.props;

		await DocumentActions.editDocument({ id, document: document.toJS() });
		ModalActions.close('documentEdit');
		ModalActions.open('documentDetail');
	};

	handleChange = (e) => {
		const { DocumentActions } = this.props;
		const { name, value } = e.target;

		DocumentActions.onChange({ target: 'edit', name, value });
	};

	handleClose = () => {
		const { ModalActions } = this.props;

		ModalActions.close('documentEdit');
	};

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getCmcodes('0001');
			this.getCmcodes('0002');
			this.getVendorList();
		}
	}

	render() {
		const { vendorList, parts, gbs, document, errors, isOpen } = this.props;

		if (!parts || !gbs || !vendorList) return null;

		return (
			<DocumentEditModal
				vendorList={vendorList}
				parts={parts}
				gbs={gbs}
				data={document}
				errors={errors}
				isOpen={isOpen}
				onClose={this.handleClose}
				onChange={this.handleChange}
				onEdit={this.handleEdit}
			/>
		);
	}
}

export default connect(
	(state) => ({
		id: state.document.getIn([ 'document', 'id' ]),
		vendorList: state.vendor.get('vendorList'),
		parts: state.cmcode.get('0001'),
		gbs: state.cmcode.get('0002'),
		document: state.document.get('edit'),
		errors: state.document.get('errors'),
		isOpen: state.modal.get('documentEditModal')
	}),
	(dispatch) => ({
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch),
		DocumentActions: bindActionCreators(documentActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch)
	})
)(DocumentEditModalContainer);
