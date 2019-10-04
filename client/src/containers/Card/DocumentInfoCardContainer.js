import React from 'react';
import { withRouter } from 'react-router-dom';
import DocumentInfoCard from 'components/Card/DocumentInfoCard';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as indexesActions from 'store/modules/indexes';
import * as modalActions from 'store/modules/modal';

class DocumentInfoCardContainer extends React.Component {
	getTrackingDocument = async (page) => {
		const { IndexesActions, id, history } = this.props;

		await IndexesActions.getTrackingDocument({ id, page: page });
		history.push(`/indexes/detail?id=${id}&page=${page}`);
	};

	handleOpenLatest = () => {
		const { ModalActions } = this.props;

		ModalActions.open('latestDocuments');
	};

	componentDidMount() {
		this.getTrackingDocument(1);
	}

	render() {
		const { list, currentPage, lastPage } = this.props;

		if (!list) return null;

		return (
			<DocumentInfoCard
				data={list}
				currentPage={currentPage}
				lastPage={lastPage}
				onPage={this.getTrackingDocument}
				onOpenLatest={this.handleOpenLatest}
			/>
		);
	}
}

export default connect(
	(state) => ({
		list: state.indexes.getIn([ 'indexDetail', 'list' ]),
		lastPage: state.indexes.getIn([ 'indexDetail', 'lastPage' ])
	}),
	(dispatch) => ({
		IndexesActions: bindActionCreators(indexesActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch)
	})
)(withRouter(DocumentInfoCardContainer));
