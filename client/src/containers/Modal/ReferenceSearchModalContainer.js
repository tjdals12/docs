import React from 'react';
import ReferenceSearchModal from 'components/Modal/ReferenceSearchModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modalActions from 'store/modules/modal';
import * as letterActions from 'store/modules/letter';

class ReferenceSearchModalContainer extends React.Component {
	state = {
		selectedReferences: []
	};

	handleClose = () => {
		const { ModalActions, LetterActions } = this.props;

		ModalActions.close('referenceSearch');
		LetterActions.initialize('references');
	};

	handleChange = (e) => {
		const { LetterActions } = this.props;
		const { name, value } = e.target;

		LetterActions.onChange({ name, value });
	};

	handleSearch = () => {
		const { LetterActions, keyword } = this.props;

		LetterActions.referenceSearch({ keyword });
	};

	handleChecked = (e) => {
		const { checked, value } = e.target;
		let { selectedReferences } = this.state;

		selectedReferences = checked
			? selectedReferences.concat(value)
			: selectedReferences.filter((item) => item !== value);

		this.setState({
			selectedReferences
		});
	};

	handleDeselect = (id) => {
		let { selectedReferences } = this.state;

		selectedReferences = selectedReferences.filter((item) => item !== id);

		this.setState({
			selectedReferences
		});
	};

	handleSelect = () => {
		const { LetterActions, isEdit } = this.props;
		const { selectedReferences } = this.state;

		LetterActions.onChange({ target: isEdit ? 'edit' : 'add', name: 'reference', value: selectedReferences });
		this.handleClose();
	};

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.isEdit === false && this.props.isEdit !== prevProps.isEdit) {
			this.setState({
				selectedReferences: this.props.selectedReferences
			});
		} else if (prevProps.isEdit === true && this.props.isEdit !== prevProps.isEdit) {
			this.setState({
				selectedReferences: []
			});
		}
	}

	render() {
		const { isOpen, keywordError, references } = this.props;

		return (
			<ReferenceSearchModal
				keywordError={keywordError}
				references={references}
				selectedReferences={this.state.selectedReferences}
				isOpen={isOpen}
				onClose={this.handleClose}
				onChange={this.handleChange}
				onSearch={this.handleSearch}
				onChecked={this.handleChecked}
				onSelect={this.handleSelect}
				onDeselect={this.handleDeselect}
			/>
		);
	}
}

export default connect(
	(state) => ({
		isEdit: state.modal.get('letterEditModal'),
		keyword: state.letter.get('keyword'),
		keywordError: state.letter.get('keywordError'),
		references: state.letter.get('references'),
		selectedReferences: state.letter.getIn([ 'edit', 'reference' ]),
		isOpen: state.modal.get('referenceSearchModal')
	}),
	(dispatch) => ({
		ModalActions: bindActionCreators(modalActions, dispatch),
		LetterActions: bindActionCreators(letterActions, dispatch)
	})
)(ReferenceSearchModalContainer);
