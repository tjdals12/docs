import React from 'react';
import BarChartCard from 'components/Card/BarChartCard';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as indexesActions from 'store/modules/indexes';

class StatisticsByStatusBarChartContainer extends React.Component {
	getStatisticsByStatus = () => {
		const { IndexesActions, id } = this.props;

		IndexesActions.getStatisticsByStatus({ id });
	};

	componentDidMount() {
		this.getStatisticsByStatus();
	}

	render() {
		const { statisticsByStatus } = this.props;

		if (!statisticsByStatus) return null;

		return <BarChartCard data={statisticsByStatus.toJS()} title="Status" color1="#6a82fb" color2="#00c9ff" />;
	}
}

export default connect(
	(state) => ({
		statisticsByStatus: state.indexes.getIn(['indexDetail', 'statisticsByStatus'])
	}),
	(dispatch) => ({
		IndexesActions: bindActionCreators(indexesActions, dispatch)
	})
)(StatisticsByStatusBarChartContainer);
