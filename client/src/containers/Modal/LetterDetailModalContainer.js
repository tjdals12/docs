import React from 'react';
import LetterDetailModal from 'components/Modal/LetterDetailModal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modalActions from 'store/modules/modal';
import * as letterActions from 'store/modules/letter';
import * as documentActions from 'store/modules/document';
import * as vendorLetterActions from 'store/modules/vendorLetter';
import * as templateActions from 'store/modules/template';

class LetterDetailModalContainer extends React.Component {
	getTemplateList = () => {
		const { TemplateActions } = this.props;

		TemplateActions.getTemplatesForSelect();
	};

	handleClose = () => {
		const { ModalActions } = this.props;

		ModalActions.close('letterDetail');
	};

	handleOpen = (name) => () => {
		const { ModalActions, LetterActions } = this.props;

		if (name === 'letterEdit') {
			this.handleClose();
			LetterActions.initialize('errors');
		}

		ModalActions.open(name);
	};

	handleOpenReference = ({ name, id }) => async () => {
		const { ModalActions, DocumentActions, VendorLetterActions } = this.props;

		if (name === 'documentDetail') {
			await DocumentActions.getDocument({ id });
		} else if (name === 'vendorLetterDetail') {
			await VendorLetterActions.getVendorLetter({ id });
		}

		ModalActions.open(name);
	};

	handleChange = (e) => {
		const { LetterActions, TemplateActions } = this.props;
		const { name, value } = e.target;

		if (name === 'template') {
			TemplateActions.onChange({ name: 'selectedTemplate', value });
		}

		LetterActions.onChange({ name, value });
	};

	handleCancel = (yn) => () => {
		const { LetterActions, id, reason } = this.props;

		LetterActions.cancelLetter({ id, yn, reason });
	};

	handleDownload = (id) => () => {
		const { TemplateActions, selectedTemplate } = this.props;

		TemplateActions.downloadTemplate({ key: 'letter', target: id, template: selectedTemplate });
	};

	handleReply = (id) => () => {
		const { LetterActions, replyDate } = this.props;

		console.log(id, replyDate);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.isOpen === false && this.props.isOpen !== prevProps.isOpen) {
			this.getTemplateList();
		}
	}

	render() {
		const { templates, selectedTemplate, letter, reasonError, replyDate, isOpen, loading } = this.props;

		if (loading || loading === undefined) return null;

		return (
			<LetterDetailModal
				templates={templates}
				selectedTemplate={selectedTemplate}
				data={letter}
				reasonError={reasonError}
				replyDate={replyDate}
				isOpen={isOpen}
				onClose={this.handleClose}
				onOpen={this.handleOpen}
				onChange={this.handleChange}
				onCancel={this.handleCancel}
				onOpenReference={this.handleOpenReference}
				onDownload={this.handleDownload}
				onReply={this.handleReply}
			/>
		);
	}
}

export default connect(
	(state) => ({
		templates: state.template.get('templateList'),
		selectedTemplate: state.template.get('selectedTemplate'),
		id: state.letter.getIn(['letter', '_id']),
		letter: state.letter.get('letter'),
		reason: state.letter.get('reason'),
		reasonError: state.letter.get('reasonError'),
		replyDate: state.letter.get('replyDate'),
		isOpen: state.modal.get('letterDetailModal'),
		loading: state.pender.pending['letter/GET_LETTER']
	}),
	(dispatch) => ({
		ModalActions: bindActionCreators(modalActions, dispatch),
		LetterActions: bindActionCreators(letterActions, dispatch),
		DocumentActions: bindActionCreators(documentActions, dispatch),
		VendorLetterActions: bindActionCreators(vendorLetterActions, dispatch),
		TemplateActions: bindActionCreators(templateActions, dispatch)
	})
)(LetterDetailModalContainer);
