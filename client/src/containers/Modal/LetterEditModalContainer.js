import React from 'react';
import LetterEditModal from 'components/Modal/LetterEditModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modalActions from 'store/modules/modal';
import * as letterActions from 'store/modules/letter';

class LetterEditModalContainer extends React.Component {
	handleClose = () => {
		const { ModalActions } = this.props;

		ModalActions.close('letterEdit');
	};

	handleChange = (e) => {
		const { name, value } = e.target;
		const { LetterActions } = this.props;

		LetterActions.onChange({ target: 'edit', name, value });
	};

	handleEdit = async () => {
		const { ModalActions, LetterActions, id, letter } = this.props;

		await LetterActions.editLetter({ id, param: letter.toJS() });

		this.handleClose();
		ModalActions.open('letterDetail');
	};

	handleOpen = (name) => () => {
		const { ModalActions } = this.props;
		ModalActions.open(name);
	};

	render() {
		const { letter, errors, isOpen, loading } = this.props;

		if (loading || loading === undefined) return null;

		return (
			<LetterEditModal
				data={letter}
				errors={errors}
				isOpen={isOpen}
				onClose={this.handleClose}
				onChange={this.handleChange}
				onEdit={this.handleEdit}
				onOpen={this.handleOpen}
			/>
		);
	}
}

export default connect(
	(state) => ({
		id: state.letter.getIn([ 'letter', '_id' ]),
		letter: state.letter.get('edit'),
		errors: state.letter.get('errors'),
		isOpen: state.modal.get('letterEditModal'),
		loading: state.pender.pending['letter/GET_LETTER']
	}),
	(dispatch) => ({
		ModalActions: bindActionCreators(modalActions, dispatch),
		LetterActions: bindActionCreators(letterActions, dispatch)
	})
)(LetterEditModalContainer);
