import React from 'react';
import { withRouter } from 'react-router-dom';
import LetterSearchForm from 'components/Form/LetterSearchForm';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as letterActions from 'store/modules/letter';

class LetterSearchFormContainer extends React.Component {
	handleChange = (e) => {
		const { LetterActions } = this.props;
		const { name, value } = e.target;

		LetterActions.onChange({ target: 'search', name, value });
	};

	handleSearch = async () => {
		const { LetterActions, search, history } = this.props;

		await LetterActions.searchLetters(1, search.toJS());
		history.push('/letters/internal?page=1');
	};

	render() {
		const { search } = this.props;

		return <LetterSearchForm data={search} onChange={this.handleChange} onSearch={this.handleSearch} />;
	}
}

export default connect(
	(state) => ({
		search: state.letter.get('search')
	}),
	(dispatch) => ({
		LetterActions: bindActionCreators(letterActions, dispatch)
	})
)(withRouter(LetterSearchFormContainer));
