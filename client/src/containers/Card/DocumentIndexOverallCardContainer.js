import React from 'react';
import OverallCard from 'components/Card/OverallCard';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as indexesActions from 'store/modules/indexes';
import Loader from 'components/Loader';

class DocumentIndexOverallCardContainer extends React.Component {
	getIndexOverall = () => {
		const { IndexesActions, id } = this.props;

		IndexesActions.getIndexOverall({ id });
	};

	componentDidMount() {
		this.getIndexOverall();
	}

	render() {
		const { overall } = this.props;

		if (!overall) return <Loader className="h-100" size={20} margin={10} />

		return <OverallCard data={overall.toJS()} description="Document 기준" />;
	}
}

export default connect(
	(state) => ({
		overall: state.indexes.getIn(['indexDetail', 'overall'])
	}),
	(dispatch) => ({
		IndexesActions: bindActionCreators(indexesActions, dispatch)
	})
)(DocumentIndexOverallCardContainer);
