import React from 'react';
import BarChartCard from 'components/Card/BarChartCard';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as vendorLetterActions from 'store/modules/vendorLetter';
import Loader from 'components/Loader';

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

		if (!statisticsByTransmittal) return <Loader size={20} margin={10} className="h-100" />

		return <BarChartCard data={statisticsByTransmittal.toJS()} title="Transmittal Receive / Reply" />;
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
