import React from 'react';
import DocumentTable from 'components/Table/DocumentTable';
import { withRouter } from 'react-router-dom';
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

	getDocument = (id) => {
		const { DocumentActions } = this.props;

		DocumentActions.getDocument({ id });
	};

	componentDidMount() {
		this.getDocuments(1);
	}

	handleOpenAdd = async () => {
		const { ModalActions, DocumentActions } = this.props;

		DocumentActions.initialize('errors');
		ModalActions.open('documentAdd');
	};

	handleDelete = () => {
		const { DocumentActions, checkedList, page } = this.props;

		DocumentActions.deleteDocuments(checkedList.toJS(), page);
	};

	handleOpenDetail = ({ id }) => async () => {
		const { ModalActions, DocumentActions } = this.props;

		await this.getDocument(id);

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

	render() {
		const { writable, documents, checkedList, lastPage, page, loading, searchLoading } = this.props;

		if (loading) return <div>Test</div>;

		return (
			<DocumentTable
				loading={searchLoading}
				writable={writable}
				page={page}
				lastPage={lastPage}
				data={documents}
				checkedList={checkedList.toJS()}
				onOpenAdd={this.handleOpenAdd}
				onDelete={this.handleDelete}
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
