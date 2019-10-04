import React from 'react';
import { withRouter } from 'react-router-dom';
import IndexCard from 'components/Card/IndexCard';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as indexesActions from 'store/modules/indexes';

class IndexCardContainer extends React.Component {
	getIndex = async () => {
		const { IndexesActions, id } = this.props;

		await IndexesActions.getIndex({ id });
	};

	componentDidMount() {
		this.getIndex();
	}

	render() {
		const { index, loading } = this.props;

		if (loading || loading === undefined) return null;

		return <IndexCard data={index} type="detail" />;
	}
}

export default connect(
	(state) => ({
		index: state.indexes.get('index'),
		loading: state.pender.pending['indexes/GET_INDEX']
	}),
	(dispatch) => ({
		IndexesActions: bindActionCreators(indexesActions, dispatch)
	})
)(withRouter(IndexCardContainer));
