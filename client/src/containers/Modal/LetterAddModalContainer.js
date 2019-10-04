import React from 'react';
import LetterAddModal from 'components/Modal/LetterAddModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modalActions from 'store/modules/modal';
import * as letterActions from 'store/modules/letter';
import * as projectActions from 'store/modules/project';

class LetterAddModalContainer extends React.Component {
	getProjectList = () => {
		const { ProjectActions } = this.props;

		ProjectActions.getProjectsForSelect();
	};

	handleClose = (name) => () => {
		const { ModalActions } = this.props;

		ModalActions.close(name);
	};

	handleChange = (e) => {
		const { LetterActions } = this.props;
		const { name, value } = e.target;

		LetterActions.onChange({ target: 'add', name, value });
	};

	handleAdd = async () => {
		const { LetterActions, add } = this.props;

		await LetterActions.addLetter(add.toJS());
		this.handleClose('letterAdd')();
	};

	handleOpen = (name) => () => {
		const { ModalActions } = this.props;

		ModalActions.open(name);
	};

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getProjectList();
		}
	}

	render() {
		const { projectList, add, errors, isOpen, loading } = this.props;

		if (loading || loading === undefined) return null;

		return (
			<LetterAddModal
				projectList={projectList}
				data={add}
				errors={errors}
				isOpen={isOpen}
				onClose={this.handleClose}
				onChange={this.handleChange}
				onAdd={this.handleAdd}
				onOpen={this.handleOpen}
			/>
		);
	}
}

export default connect(
	(state) => ({
		projectList: state.project.get('projectList'),
		add: state.letter.get('add'),
		errors: state.letter.get('errors'),
		isOpen: state.modal.get('letterAddModal'),
		loading: state.pender.pending['project/GET_PROJECTS_FOR_SELECT']
	}),
	(dispatch) => ({
		ModalActions: bindActionCreators(modalActions, dispatch),
		LetterActions: bindActionCreators(letterActions, dispatch),
		ProjectActions: bindActionCreators(projectActions, dispatch)
	})
)(LetterAddModalContainer);
