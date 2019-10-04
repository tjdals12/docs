import React from 'react';
import { withRouter } from 'react-router-dom';
import DocumentInfoTable from 'components/Table/DocumentInfoTable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as vendorLetterActions from 'store/modules/vendorLetter';
import * as modalActions from 'store/modules/modal';
import * as vendorActions from 'store/modules/vendor';
import * as infoActions from 'store/modules/info';

class DocumentInfoTableContainer extends React.Component {
	getInfos = async (page) => {
		const { InfoActions, isSearch, search, history } = this.props;

		if (isSearch) {
			await InfoActions.searchInfos(page, search.toJS());
		} else {
			await InfoActions.getInfos({ page });
		}

		history.push(`/indexes/infos?page=${page}`);
	};

	getInfo = (id) => {
		const { InfoActions } = this.props;

		InfoActions.getInfo({ id });
	};

	handleTargetVendor = ({ id }) => {
		const { VendorActions } = this.props;

		VendorActions.setTarget(id);
	};

	handleOpen = (name) => () => {
		const { ModalActions } = this.props;

		ModalActions.open(name);
	};

	handleOpenDetail = (id) => async () => {
		const { ModalActions } = this.props;

		await this.getInfo(id);
		ModalActions.open('documentInfoDetail');
	};

	componentDidMount() {
		this.getInfos(1);
	}

	render() {
		const { infos, page, lastPage, loading } = this.props;

		if (loading || loading === undefined) return null;

		return (
			<DocumentInfoTable
				page={page}
				lastPage={lastPage}
				data={infos}
				onPage={this.getInfos}
				onTargetVendor={this.handleTargetVendor}
				onOpen={this.handleOpen}
				onOpenDetail={this.handleOpenDetail}
				bordered
				striped
				hover
			/>
		);
	}
}

export default connect(
	(state) => ({
		infos: state.info.get('infos'),
		lastPage: state.info.get('lastPage'),
		isSearch: state.info.getIn([ 'search', 'isSearch' ]),
		search: state.info.get('search'),
		loading: state.pender.pending['info/GET_INFOS']
	}),
	(dispatch) => ({
		VendorLetterActions: bindActionCreators(vendorLetterActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch),
		InfoActions: bindActionCreators(infoActions, dispatch)
	})
)(withRouter(DocumentInfoTableContainer));
