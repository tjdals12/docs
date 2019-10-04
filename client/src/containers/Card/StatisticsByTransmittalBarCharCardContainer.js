import React from 'react';
import BarChartCard from 'components/Card/BarChartCard';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as vendorLetterActions from 'store/modules/vendorLetter';

class StatisticsByTransmittalBarChartCardContainer extends React.Component {
	getStatisticsByTransmittal = () => {
		const { VendorLetterActions, vendor } = this.props;

		VendorLetterActions.statisticsByTransmittal({ vendor });
	};

	componentDidMount() {
		this.getStatisticsByTransmittal();
	}

	render() {
		const { statisticsByTransmittal } = this.props;

		if (!statisticsByTransmittal) return null;

		return <BarChartCard data={statisticsByTransmittal} title="Transmittal Receive / Reply" />;
	}
}

export default connect(
	(state) => ({
		statisticsByTransmittal: state.vendorLetter.get('statisticsByTransmittal')
	}),
	(dispatch) => ({
		VendorLetterActions: bindActionCreators(vendorLetterActions, dispatch)
	})
)(StatisticsByTransmittalBarChartCardContainer);
