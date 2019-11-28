import React from 'react';
import DocumentIndexAddModal from 'components/Modal/DocumentIndexAddModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import * as cmcodeActions from 'store/modules/cmcode';
import * as modalActions from 'store/modules/modal';
import * as indexesActions from 'store/modules/indexes';
import * as vendorActions from 'store/modules/vendor';

class DocumentIndexAddModalContainer extends React.Component {
	getCmcodes = (major) => {
		const { CmcodeActions } = this.props;

		CmcodeActions.getCmcodeByMajorExcludeRemoved(major);
	};

	getVendorList = () => {
		const { VendorActions } = this.props;

		VendorActions.getVendorsForSelect();
	};

	handleClose = () => {
		const { ModalActions } = this.props;

		ModalActions.close('documentIndexAdd');
	};

	handleChange = (e) => {
		const { IndexesActions } = this.props;
		const { name, value } = e.target;

		IndexesActions.onChange({ target: 'add', name, value });
	};

	handleChangeGb = (index) => (e) => {
		const { IndexesActions } = this.props;
		const { name, value } = e.target;

		IndexesActions.onChangeAdd({ target: 'add', index, name, value });
	};

	handleExcelUpload = async (file) => {
		const { IndexesActions } = this.props;

		let formData = new FormData();
		formData.append('indexes', file);

		await axios({
			method: 'POST',
			// url: 'http://192.168.7.9/api/documentindexes/readexcel',
			url: '/api/documentindexes/readexcel',
			data: formData,
			config: { headers: { 'Content-Type': 'multipart/form-data' } }
		}).then((response) => {
			IndexesActions.onChange({
				name: 'fileError',
				value: false
			});

			IndexesActions.onChange({
				target: 'add',
				name: 'list',
				value: response.data.data
			});
		}).catch((err) => {
			IndexesActions.onChange({
				name: 'fileError',
				value: true
			});
		})
	};

	handleInsert = async () => {
		const { IndexesActions, documentIndex } = this.props;

		await IndexesActions.addIndex(documentIndex.toJS());
		this.handleClose();
	};

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getVendorList();
			this.getCmcodes('0002');
		}
	}

	render() {
		const { gbs, vendorList, documentIndex, error, infosError, fileError, isOpen } = this.props;

		if (!gbs || !vendorList) return null;

		return (
			<DocumentIndexAddModal
				gbs={gbs}
				vendorList={vendorList}
				data={documentIndex}
				error={error}
				infosError={infosError}
				fileError={fileError}
				isOpen={isOpen}
				onClose={this.handleClose}
				onChange={this.handleChange}
				onChangeGb={this.handleChangeGb}
				onExcelUpload={this.handleExcelUpload}
				onInsert={this.handleInsert}
			/>
		);
	}
}

export default connect(
	(state) => ({
		gbs: state.cmcode.get('0002'),
		vendorList: state.vendor.get('vendorList'),
		documentIndex: state.indexes.get('add'),
		error: state.indexes.get('error'),
		infosError: state.indexes.get('infosError'),
		fileError: state.indexes.get('fileError'),
		isOpen: state.modal.get('documentIndexAddModal')
	}),
	(dispatch) => ({
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch),
		IndexesActions: bindActionCreators(indexesActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch)
	})
)(DocumentIndexAddModalContainer);
