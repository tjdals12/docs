import React from 'react';
import { withRouter } from 'react-router-dom';
import VendorLetterTable from 'components/Table/VendorLetterTable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modalActions from 'store/modules/modal';
import * as vendorActions from 'store/modules/vendor';
import * as vendorLetterActions from 'store/modules/vendorLetter';

class VendorLetterTableContainer extends React.Component {
	getVendorLetters = async (page) => {
		const { VendorLetterActions, isSearch, search, history } = this.props;

		if (isSearch) {
			await VendorLetterActions.searchVendorLetters(1, search.toJS());
		} else {
			await VendorLetterActions.getVendorLetters({ page });
		}

		history.push(`/letters/vendor?page=${page}`);
	};

	getVendorLetter = (id) => {
		const { VendorLetterActions } = this.props;

		VendorLetterActions.getVendorLetter({ id });
	};

	handleTarget = (id) => {
		const { VendorActions } = this.props;

		VendorActions.setTarget(id);
	};

	handleOpen = (name) => {
		const { ModalActions } = this.props;

		ModalActions.open(name);
	};

	handleOpenDetail = (id) => async () => {
		const { ModalActions } = this.props;

		await this.getVendorLetter(id);
		ModalActions.open('vendorLetterDetail');
	};

	componentDidMount() {
		this.getVendorLetters(1);
	}

	render() {
		const { vendorletters, page, lastPage, loading, searchLoading } = this.props;

		if(loading || loading === undefined) return null;

		return (
			<VendorLetterTable
				loading={searchLoading}
				page={page}
				lastPage={lastPage}
				data={vendorletters}
				onPage={this.getVendorLetters}
				onTarget={this.handleTarget}
				onOpen={this.handleOpen}
				onOpenDetail={this.handleOpenDetail}
			/>
		);
	}
}

export default connect(
	(state) => ({
		vendorletters: state.vendorLetter.get('vendorLetters'),
		lastPage: state.vendorLetter.get('lastPage'),
		isSearch: state.vendorLetter.getIn(['search', 'isSearch']),
		search: state.vendorLetter.get('search'),
		loading: state.pender.pending['vendorletter/GET_VENDORLETTERS'],
		searchLoading: state.pender.pending['vendorletter/SEARCH_VENDORLETTERS']
	}),
	(dispatch) => ({
		ModalActions: bindActionCreators(modalActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch),
		VendorLetterActions: bindActionCreators(vendorLetterActions, dispatch)
	})
)(withRouter(VendorLetterTableContainer));
