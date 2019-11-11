import React from 'react';
import VendorList from 'components/List/VendorList';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modalActions from 'store/modules/modal';
import * as vendorActions from 'store/modules/vendor';

class VendorListContainer extends React.Component {
	getVendors = async (page) => {
		const { VendorActions, search, history, isSearch } = this.props;

		if (isSearch) {
			await VendorActions.searchVendors(page, search.toJS());
		} else {
			await VendorActions.getVendors({ page });
		}
		history.push(`/vendors?page=${page}`);
	};

	handleOpenDetail = (id) => async () => {
		const { ModalActions, VendorActions } = this.props;

		VendorActions.setTarget(id);

		ModalActions.open('vendorDetail');
	};

	componentDidMount() {
		this.getVendors(1);
	}

	render() {
		const { vendors, lastPage, page, loading } = this.props;

		if (loading) return null;

		return (
			<VendorList
				page={page}
				lastPage={lastPage}
				data={vendors}
				onPage={this.getVendors}
				onOpenDetail={this.handleOpenDetail}
			/>
		);
	}
}

export default connect(
	(state) => ({
		vendors: state.vendor.get('vendors'),
		isSearch: state.vendor.getIn(['search', 'isSearch']),
		search: state.vendor.get('search'),
		lastPage: state.vendor.get('lastPage'),
		loading: state.pender.pending['vendor/GET_VENDORS']
	}),
	(dispatch) => ({
		ModalActions: bindActionCreators(modalActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch)
	})
)(withRouter(VendorListContainer));
