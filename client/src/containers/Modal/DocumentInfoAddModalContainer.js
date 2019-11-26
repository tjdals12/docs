import React from 'react';
import DocumentInfoAddModal from 'components/Modal/DocumentInfoAddModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import * as cmcodeActions from 'store/modules/cmcode';
import * as modalActions from 'store/modules/modal';
import * as indexesActions from 'store/modules/indexes';

class DocumentInfoAddModalContainer extends React.Component {
	getCmcodes = (major) => {
		const { CmcodeActions } = this.props;

		CmcodeActions.getCmcodeByMajorExcludeRemoved({ major: major });
	};
	getVendorList = () => {
		const { IndexesActions } = this.props;

		IndexesActions.getIndexesForSelect();
	};

	handleClose = () => {
		const { ModalActions } = this.props;

		ModalActions.close('documentInfoAdd');
	};

	handleTarget = (e) => {
		const { value } = e.target;
		const { IndexesActions } = this.props;

		IndexesActions.setTarget(value);
	};

	handleChange = (index) => (e) => {
		const { IndexesActions } = this.props;
		const { name, value } = e.target;

		IndexesActions.onChangeInfo({ index, name, value });
	};

	handleExcelUpload = (file) => {
		const { IndexesActions } = this.props;

		let formData = new FormData();
		formData.append('indexes', file);

		axios({
			method: 'POST',
			// url: 'http://192.168.7.9/api/documentindexes/readexcel',
			url: '/api/documentindexes/readexcel',
			data: formData
		}).then((response) => {
			IndexesActions.addInfoByExcel(response.data.data);
		});
	};

	handleAddInfoForm = () => {
		const { IndexesActions } = this.props;

		IndexesActions.addInfoForm();
	};

	handleDeleteInfoForm = (index) => () => {
		const { IndexesActions } = this.props;

		IndexesActions.deleteInfoForm(index);
	};

	handleAddInfo = async () => {
		const { IndexesActions, target, infos } = this.props;

		await IndexesActions.addPartial(target, { list: infos });
		this.handleClose();
	};

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getVendorList();
			this.getCmcodes('0002');
		}
	}

	render() {
		const { vendorList, gbs, infos, error, infosError, isOpen, loading } = this.props;

		if (!vendorList || !gbs) return null;

		return (
			<DocumentInfoAddModal
				loading={loading}
				vendorList={vendorList}
				gbs={gbs}
				infos={infos.toJS()}
				error={error}
				infosError={infosError}
				isOpen={isOpen}
				onClose={this.handleClose}
				onTarget={this.handleTarget}
				onChange={this.handleChange}
				onExcelUpload={this.handleExcelUpload}
				onAddInfoForm={this.handleAddInfoForm}
				onDeleteInfoForm={this.handleDeleteInfoForm}
				onAddInfo={this.handleAddInfo}
			/>
		);
	}
}

export default connect(
	(state) => ({
		vendorList: state.indexes.get('vendorList'),
		gbs: state.cmcode.get('0002'),
		target: state.indexes.get('target'),
		infos: state.indexes.get('infos'),
		error: state.indexes.get('error'),
		infosError: state.indexes.get('infosError'),
		isOpen: state.modal.get('documentInfoAddModal'),
		loading: state.pender.pending['indexes/ADD_PARTIAL']
	}),
	(dispatch) => ({
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch),
		IndexesActions: bindActionCreators(indexesActions, dispatch)
	})
)(DocumentInfoAddModalContainer);
