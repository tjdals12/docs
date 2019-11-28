import React from 'react';
import LatestDocumentsModal from 'components/Modal/LatestDocumentsModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as infoActions from 'store/modules/info';
import * as modalActions from 'store/modules/modal';
import * as vendorActions from 'store/modules/vendor';

class LatestDocumentsModalContainer extends React.Component {
	getLatestDocuments = (page) => {
		const { InfoActions, vendor } = this.props;

		InfoActions.onChange({ name: 'page', value: page });

		InfoActions.getLatestDocuments(vendor.get('_id'), page);
	};

	getInfo = (id) => {
		const { InfoActions } = this.props;

		InfoActions.getInfo(id);
	};

	handleClose = () => {
		const { ModalActions } = this.props;

		ModalActions.close('latestDocuments');
	};

	handleOpenVendorDetail = () => {
		const { ModalActions, VendorActions, vendor } = this.props;

		VendorActions.setTarget(vendor.get('_id'));
		ModalActions.open('vendorDetail');
	};

	handleOpenInfoDetail = (id) => async () => {
		const { ModalActions } = this.props;

		await this.getInfo(id);
		ModalActions.open('documentInfoDetail');
	};

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getLatestDocuments(1);
		}
	}

	render() {
		const { page, lastPage, latest, vendor, isOpen, loading } = this.props;

		if (loading || loading === undefined) return null;

		return (
			<LatestDocumentsModal
				page={page}
				lastPage={lastPage}
				vendor={vendor}
				data={latest}
				isOpen={isOpen}
				onClose={this.handleClose}
				onOpenVendorDetail={this.handleOpenVendorDetail}
				onOpenInfoDetail={this.handleOpenInfoDetail}
				onPage={this.getLatestDocuments}
			/>
		);
	}
}

export default connect(
	(state) => ({
		page: state.info.get('page'),
		lastPage: state.info.get('lastPage'),
		latest: state.info.get('latest'),
		vendor: state.indexes.getIn([ 'index', 'vendor' ]),
		isOpen: state.modal.get('latestDocumentsModal'),
		loading: state.pender.pending['info/GET_LATEST_DOCUMENTS']
	}),
	(dispatch) => ({
		InfoActions: bindActionCreators(infoActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch)
	})
)(LatestDocumentsModalContainer);
