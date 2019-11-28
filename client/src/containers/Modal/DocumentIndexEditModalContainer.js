import React from 'react';
import DocumentIndexEditModal from 'components/Modal/DocumentIndexEditModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import * as cmcodeActions from 'store/modules/cmcode';
import * as modalActions from 'store/modules/modal';
import * as indexesActions from 'store/modules/indexes';
import * as vendorActions from 'store/modules/vendor';

class DocumentIndexEditModalContainer extends React.Component {
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

		ModalActions.close('documentIndexEdit');
	};

	handleChange = (e) => {
		const { IndexesActions } = this.props;
		const { name, value } = e.target;

		IndexesActions.onChange({ target: 'edit', name, value });
	};

	handleChangeInfo = (id) => (e) => {
		const { IndexesActions } = this.props;
		const { name, value } = e.target;

		IndexesActions.onChangeEditInfo({ id, name, value });
	};

	handleChangeList = (id, type) => () => {
		const { IndexesActions } = this.props;

		IndexesActions.onChangeEditList({ id, type });
	};

	handleEdit = async () => {
		const { IndexesActions, target, edit } = this.props;

		await IndexesActions.editIndex(target, edit.toJS());
		this.handleClose();
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
				target: 'edit',
				name: 'list',
				value: response.data.data
			});
		});
	};

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getVendorList();
			this.getCmcodes('0002');
		}
	}

	render() {
		const { vendorList, gbs, edit, infosError, isOpen, loading, editLoading } = this.props;

		if (!vendorList || !gbs || loading) return null;

		return (
			<DocumentIndexEditModal
				loading={editLoading}
				vendorList={vendorList.toJS()}
				gbs={gbs.toJS()}
				data={edit.toJS()}
				infosError={infosError.toJS()}
				isOpen={isOpen}
				onChange={this.handleChange}
				onChangeInfo={this.handleChangeInfo}
				onChangeList={this.handleChangeList}
				onClose={this.handleClose}
				onExcelUpload={this.handleExcelUpload}
				onEdit={this.handleEdit}
			/>
		);
	}
}

export default connect(
	(state) => ({
		vendorList: state.vendor.get('vendorList'),
		gbs: state.cmcode.get('0002'),
		isOpen: state.modal.get('documentIndexEditModal'),
		edit: state.indexes.get('edit'),
		error: state.indexes.get('error'),
		infosError: state.indexes.get('infosError'),
		target: state.indexes.get('target'),
		loading: state.pender.pending['indexes/GET_INDEX'],
		editLoading: state.pender.pending['indexes/EDIT_INDEX']
	}),
	(dispatch) => ({
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch),
		IndexesActions: bindActionCreators(indexesActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch)
	})
)(DocumentIndexEditModalContainer);
