import React from 'react';
import { withRouter } from 'react-router-dom';
import DocumentInfoSearchForm from 'components/Form/DocumentInfoSearchForm';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as vendorActions from 'store/modules/vendor';
import * as cmcodeActions from 'store/modules/cmcode';
import * as infoActions from 'store/modules/info';

class DocumentInfoSearchFormContainer extends React.Component {
	getVendorList = () => {
		const { VendorActions } = this.props;

		VendorActions.getVendorsForSelect();
	};

	getCmcodes = (major) => {
		const { CmcodeActions } = this.props;

		CmcodeActions.getCmcodeByMajor({ major: major });
	};

	handleChange = (e) => {
		const { InfoActions } = this.props;
		const { name, value } = e.target;

		InfoActions.onChangeSearch({ name, value });
	};

	handleSearch = async () => {
		const { InfoActions, search, history } = this.props;

		await InfoActions.searchInfos(1, search.toJS());
		history.push('/indexes/infos?page=1');
	};

	componentDidMount() {
		this.getCmcodes('0002');
		this.getVendorList();
	}

	render() {
		const { vendors, gbs, search, loading } = this.props;

		if (!gbs || (loading || loading === undefined)) return null;

		return (
			<DocumentInfoSearchForm
				vendors={vendors}
				gbs={gbs}
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
		gbs: state.cmcode.get('0002'),
		search: state.info.get('search'),
		loading: state.pender.pending['vendor/GET_VENDORS_FOR_SELECT']
	}),
	(dispatch) => ({
		VendorActions: bindActionCreators(vendorActions, dispatch),
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		InfoActions: bindActionCreators(infoActions, dispatch)
	})
)(withRouter(DocumentInfoSearchFormContainer));
