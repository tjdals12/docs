import React from 'react';
import VendorPersonAddModal from 'components/Modal/VendorPersonAddModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modalActions from 'store/modules/modal';
import * as vendorActions from 'store/modules/vendor';

class VendorPersonAddModalContainer extends React.Component {
	getVendorList = () => {
		const { VendorActions } = this.props;

		VendorActions.getVendorsForSelect();
	};

	handleAddPersonForm = () => {
		const { VendorActions } = this.props;

		VendorActions.addPersonForm();
	};

	handleDeletePersonForm = (index) => () => {
		const { VendorActions } = this.props;

		VendorActions.deletePersonForm(index);
	};

	handleChange = (index) => (e) => {
		const { VendorActions } = this.props;
		const { name, value } = e.target;

		VendorActions.onChangePerson({ index, name, value });
	};

	handleClose = () => {
		const { ModalActions } = this.props;

		ModalActions.close('vendorPersonAdd');
	};

	handleTarget = (e) => {
		const { value } = e.target;
		const { VendorActions } = this.props;

		VendorActions.setTarget(value);
	};

	handleInsert = async () => {
		const { ModalActions, VendorActions, target, persons } = this.props;

		await VendorActions.addPerson({ id: target, persons: persons.toJS() });
		ModalActions.close('vendorPersonAdd');
		ModalActions.open('vendorDetail');
	};

	componentDidUpdate(prevProps) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getVendorList();
		}
	}

	render() {
		const { vendorList, targetError, persons, personsError, isOpen } = this.props;

		if (!vendorList) return null;

		return (
			<VendorPersonAddModal
				vendorList={vendorList}
				targetError={targetError}
				persons={persons}
				personsError={personsError}
				isOpen={isOpen}
				onClose={this.handleClose}
				onChange={this.handleChange}
				onInsert={this.handleInsert}
				onAddPersonForm={this.handleAddPersonForm}
				onDeletePersonForm={this.handleDeletePersonForm}
				onTarget={this.handleTarget}
			/>
		);
	}
}

export default connect(
	(state) => ({
		vendorList: state.vendor.get('vendorList'),
		target: state.vendor.get('target'),
		targetError: state.vendor.get('targetError'),
		persons: state.vendor.get('persons'),
		personsError: state.vendor.get('personsError'),
		isOpen: state.modal.get('vendorPersonAddModal')
	}),
	(dispatch) => ({
		ModalActions: bindActionCreators(modalActions, dispatch),
		VendorActions: bindActionCreators(vendorActions, dispatch)
	})
)(VendorPersonAddModalContainer);
