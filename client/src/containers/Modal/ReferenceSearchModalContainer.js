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

	handleSearch = (page) => {
		const { LetterActions, keyword } = this.props;

		LetterActions.referenceSearch(page, keyword);
		LetterActions.onChange({ name: 'referencesPage', value: page });
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
		if (prevProps.isAdd === true && this.props.isAdd !== prevProps.isAdd) {
			this.setState({
				selectedReferences: []
			})
		}

		if (prevProps.isEdit === false && this.props.isEdit !== prevProps.isEdit) {
			this.setState({
				selectedReferences: this.props.selectedReferences
			});
		}

		if (prevProps.isEdit === true && this.props.isEdit !== prevProps.isEdit) {
			this.setState({
				selectedReferences: []
			});
		}
	}

	render() {
		const { isOpen, keywordError, references, page, lastPage } = this.props;

		return (
			<ReferenceSearchModal
				keywordError={keywordError}
				references={references}
				page={page}
				lastPage={lastPage}
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
		isAdd: state.modal.get('letterAddModal'),
		isEdit: state.modal.get('letterEditModal'),
		keyword: state.letter.get('keyword'),
		keywordError: state.letter.get('keywordError'),
		references: state.letter.get('references'),
		page: state.letter.get('referencesPage'),
		lastPage: state.letter.get('referencesLastPage'),
		selectedReferences: state.letter.getIn(['edit', 'reference']),
		isOpen: state.modal.get('referenceSearchModal')
	}),
	(dispatch) => ({
		ModalActions: bindActionCreators(modalActions, dispatch),
		LetterActions: bindActionCreators(letterActions, dispatch)
	})
)(ReferenceSearchModalContainer);
