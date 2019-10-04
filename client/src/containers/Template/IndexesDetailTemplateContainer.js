import React from 'react';
import { withRouter } from 'react-router-dom';
import IndexesDetailTemplate from 'templates/IndexesDetailTemplate';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as vendorLetterActions from 'store/modules/vendorLetter';
import * as indexesActions from 'store/modules/indexes';
import * as documentActions from 'store/modules/document';
import * as modalActions from 'store/modules/modal';

class IndexesDetailTemplateContainer extends React.Component {
	getIndex = async () => {
		const { IndexesActions, id } = this.props;

		await IndexesActions.getIndex({ id });
	};

	componentDidMount() {
		this.getIndex();
	}

	render() {
		const { id, vendor, page, loading } = this.props;

		if (loading || loading === undefined) return null;

		return <IndexesDetailTemplate id={id} vendor={vendor} currentPage={page} />;
	}
}

export default connect(
	(state) => ({
		vendor: state.indexes.getIn([ 'index', 'vendor', '_id' ]),
		loading: state.pender.pending['indexes/GET_INDEX']
	}),
	(dispatch) => ({
		VendorLetterActions: bindActionCreators(vendorLetterActions, dispatch),
		IndexesActions: bindActionCreators(indexesActions, dispatch),
		DocumentActions: bindActionCreators(documentActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch)
	})
)(withRouter(IndexesDetailTemplateContainer));
