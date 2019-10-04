import React from 'react';
import TransmittalCard from 'components/Card/TransmittalCard';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as vendorLetterActions from 'store/modules/vendorLetter';
import * as modalActions from 'store/modules/modal';
import * as indexesActions from 'store/modules/indexes';

class TransmittalCardContainer extends React.Component {
	getVendorLetter = (id) => {
		const { VendorLetterActions } = this.props;

		VendorLetterActions.getVendorLetter({ id });
	};

	getVendorLetters = () => {
		const { VendorLetterActions, vendor } = this.props;

		VendorLetterActions.getVendorLettersByVendor({ vendor });
	};

	handleOpenTransmittalDetail = async (id) => {
		const { ModalActions } = this.props;

		await this.getVendorLetter(id);
		ModalActions.open('vendorLetterDetail');
	};

	componentDidMount() {
		this.getVendorLetters();
	}

	render() {
		const { vendorLetters } = this.props;

		if (!vendorLetters) return null;

		return <TransmittalCard data={vendorLetters} onOpenDetail={this.handleOpenTransmittalDetail} height="md" />;
	}
}

export default connect(
	(state) => ({
		vendorLetters: state.vendorLetter.get('vendorLettersByVendor')
	}),
	(dispatch) => ({
		VendorLetterActions: bindActionCreators(vendorLetterActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch),
		IndexesActions: bindActionCreators(indexesActions, dispatch)
	})
)(TransmittalCardContainer);
