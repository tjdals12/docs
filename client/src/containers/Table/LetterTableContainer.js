import React from 'react';
import { withRouter } from 'react-router-dom';
import LetterTable from 'components/Table/LetterTable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as letterActions from 'store/modules/letter';
import * as modalActions from 'store/modules/modal';

class LetterTableContainer extends React.Component {
	getLetters = async (page) => {
		const { LetterActions, search, isSearch, history } = this.props;

		if (isSearch) {
			await LetterActions.searchLetters(page, search.toJS());
		} else {
			await LetterActions.getLetters({ page });
		}

		history.push(`/letters/internal?page=${page}`);
	};

	getLetter = (id) => {
		const { LetterActions } = this.props;

		LetterActions.getLetter({ id });
	};

	handleOpen = (name) => () => {
		const { LetterActions, ModalActions } = this.props;

		if (name === 'letterAdd') {
			LetterActions.initialize('add');
		}

		ModalActions.open(name);
	};

	handleOpenDetail = (id) => async () => {
		const { ModalActions, LetterActions } = this.props;

		LetterActions.initialize('reasonError');
		await this.getLetter(id);
		ModalActions.open('letterDetail');
	};

	componentDidMount() {
		this.getLetters(1);
	}

	render() {
		const { writable, transmittals, page, lastPage, loading } = this.props;

		if (loading || loading === 'undefined') return null;

		return (
			<LetterTable
				writable={writable}
				page={page}
				lastPage={lastPage}
				data={transmittals}
				onOpen={this.handleOpen}
				onOpenDetail={this.handleOpenDetail}
				onPage={this.getLetters}
			/>
		);
	}
}

export default connect(
	(state) => ({
		transmittals: state.letter.get('letters'),
		lastPage: state.letter.get('lastPage'),
		isSearch: state.letter.getIn(['search', 'isSearch']),
		search: state.letter.get('search'),
		loading: state.pender.pending['letter/GET_LETTERS']
	}),
	(dispatch) => ({
		LetterActions: bindActionCreators(letterActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch)
	})
)(withRouter(LetterTableContainer));
