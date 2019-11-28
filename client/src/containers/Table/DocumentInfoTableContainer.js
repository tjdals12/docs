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
			await InfoActions.getInfos(page);
		}

		history.push(`/indexes/infos?page=${page}`);
	};

	getInfo = (id) => {
		const { InfoActions } = this.props;

		InfoActions.getInfo(id);
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

	handleChecked = (e) => {
		const { InfoActions } = this.props;
		const { checked, value } = e.target;

		InfoActions.setCheckedList({ checked: checked, value: value });
	}

	handleCheckedAll = (e) => {
		const { InfoActions, infos } = this.props;
		const { checked } = e.target;

		infos.forEach((info) => {
			InfoActions.setCheckedList({ checked: checked, value: info.get('_id') })
		})
	}

	componentDidMount() {
		this.getInfos(1);
	}

	render() {
		const { infos, page, lastPage, checkedList, loading, searchLoading } = this.props;

		return (
			<DocumentInfoTable
				loading={loading || searchLoading}
				page={page}
				lastPage={lastPage}
				data={infos}
				checkedList={checkedList.toJS()}
				onPage={this.getInfos}
				onTargetVendor={this.handleTargetVendor}
				onOpen={this.handleOpen}
				onOpenDetail={this.handleOpenDetail}
				onChecked={this.handleChecked}
				onCheckedAll={this.handleCheckedAll}
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
		checkedList: state.info.get('checkedList'),
		loading: state.pender.pending['info/GET_INFOS'],
		searchLoading: state.pender.pending['info/SEARCH_INFOS']
	}),
	(dispatch) => ({
		VendorLetterActions: bindActionCreators(vendorLetterActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch),
		InfoActions: bindActionCreators(infoActions, dispatch)
	})
)(withRouter(DocumentInfoTableContainer));
