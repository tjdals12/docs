import React from 'react';
import { withRouter } from 'react-router-dom';
import DocumentTable from 'components/Table/DocumentTable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as documentActions from 'store/modules/document';
import * as modalActions from 'store/modules/modal';

class DocumentTableContainer extends React.Component {
	getDocuments = async (page) => {
		const { DocumentActions, isSearch, search, history } = this.props;

		if (isSearch) {
			await DocumentActions.searchDocuments(page, search.toJS());
		} else {
			await DocumentActions.getDocuments({ page });
		}
		history.push(`/documents?page=${page}`);
	};

	getDocument = async (id) => {
		const { DocumentActions } = this.props;

		await DocumentActions.getDocument({ id });
	};

	handleOpenDetail = (id) => {
		const { ModalActions, DocumentActions } = this.props;

		this.getDocument(id);

		DocumentActions.initialize('reasonError');
		ModalActions.open('documentDetail');
	};

	handleChecked = (e) => {
		const { DocumentActions } = this.props;
		const { checked, value } = e.target;

		DocumentActions.setCheckedList({ checked: checked, value: value });
	};

	handleCheckedAll = (e) => {
		const { DocumentActions, documents } = this.props;
		const { checked } = e.target;

		documents.forEach((document) => {
			DocumentActions.setCheckedList({ checked: checked, value: document.get('_id') });
		});
	};

	componentDidMount() {
		this.getDocuments(1);
	}

	render() {
		const { documents, checkedList, lastPage, page, loading, searchLoading } = this.props;

		return (
			<DocumentTable
				loading={loading || searchLoading}
				page={page}
				lastPage={lastPage}
				documents={documents.toJS()}
				checkedList={checkedList.toJS()}
				onOpenDetail={this.handleOpenDetail}
				onChecked={this.handleChecked}
				onCheckedAll={this.handleCheckedAll}
				onPage={this.getDocuments}
				bordered
				striped
				hover
			/>
		);
	}
}

export default connect(
	(state) => ({
		lastPage: state.document.get('lastPage'),
		documents: state.document.get('documents'),
		checkedList: state.document.get('checkedList'),
		isSearch: state.document.getIn(['search', 'isSearch']),
		search: state.document.get('search'),
		loading: state.pender.pending['document/GET_DOCUMENTS'],
		searchLoading: state.pender.pending['document/SEARCH_DOCUMENTS']
	}),
	(dispatch) => ({
		DocumentActions: bindActionCreators(documentActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch)
	})
)(withRouter(DocumentTableContainer));
