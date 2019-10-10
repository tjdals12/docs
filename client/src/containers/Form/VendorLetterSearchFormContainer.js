import React from 'react';
import { withRouter } from 'react-router-dom';
import VendorLetterSearchForm from 'components/Form/VendorLetterSearchForm';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cmcodeActions from 'store/modules/cmcode';
import * as vendorActions from 'store/modules/vendor';
import * as vendorLetterActions from 'store/modules/vendorLetter';

class VendorLetterSearchFormContainer extends React.Component {
	getCmcodes = (major) => {
		const { CmcodeActions } = this.props;

		CmcodeActions.getCmcodeByMajorExcludeRemoved({ major: major });
	};

	getVendorList = () => {
		const { VendorActions } = this.props;

		VendorActions.getVendorsForSelect();
	};

	handleChange = (e) => {
		const { VendorLetterActions } = this.props;
		const { name, value } = e.target;

		VendorLetterActions.onChange({ target: 'search', name, value });
	};

	handleSearch = async () => {
		const { VendorLetterActions, search, history } = this.props;

		await VendorLetterActions.searchVendorLetters(1, search.toJS());
		history.push('/letters/vendor?page=1');
	};

	componentDidMount() {
		this.getVendorList();
		this.getCmcodes('0003');
	}

	render() {
		const { status, vendors, search, loading } = this.props;

		if (!status || !vendors || loading || loading === undefined) return null;

		return (
			<VendorLetterSearchForm
				status={status}
				vendors={vendors}
				search={search}
				onChange={this.handleChange}
				onSearch={this.handleSearch}
			/>
		);
	}
}

export default connect(
	(state) => ({
		vendors: state.vendor.get('vendorList'),
		status: state.cmcode.get('0003'),
		search: state.vendorLetter.get('search'),
		loading: state.pender.pending['vendor/GET_VENDORS_FOR_SELECT']
	}),
	(dispatch) => ({
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch),
		VendorLetterActions: bindActionCreators(vendorLetterActions, dispatch)
	})
)(withRouter(VendorLetterSearchFormContainer));
