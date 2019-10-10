import React from 'react';
import IndexesSearchForm from 'components/Form/IndexesSearchForm';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cmcodeActions from 'store/modules/cmcode';
import * as indexesActions from 'store/modules/indexes';

class IndexesSearchFormContainer extends React.Component {
	getCmcodes = async (major) => {
		const { CmcodeActions } = this.props;

		await CmcodeActions.getCmcodeByMajorExcludeRemoved({ major: major });
	};

	handleChange = (e) => {
		const { IndexesActions } = this.props;
		const { name, value } = e.target;

		IndexesActions.onChange({
			target: 'search',
			name,
			value
		});
	};

	handleSearch = async () => {
		const { IndexesActions, search, history } = this.props;

		await IndexesActions.searchIndexes(1, search.toJS());
		history.push('/indexes/overall?page=1');
	};

	componentDidMount() {
		this.getCmcodes('0001');
	}

	render() {
		const { parts, search } = this.props;

		if (!parts) return null;

		return (
			<IndexesSearchForm
				parts={parts}
				search={search}
				onChange={this.handleChange}
				onSearch={this.handleSearch}
			/>
		);
	}
}

export default connect(
	(state) => ({
		parts: state.cmcode.get('0001'),
		search: state.indexes.get('search')
	}),
	(dispatch) => ({
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		IndexesActions: bindActionCreators(indexesActions, dispatch)
	})
)(withRouter(IndexesSearchFormContainer));
