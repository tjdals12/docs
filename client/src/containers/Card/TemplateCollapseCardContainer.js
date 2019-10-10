import React from 'react';
import CollapseCard from 'components/Card/CollapseCard';
import TemplateCollapse from 'components/Collapse/TemplateCollapse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import * as cmcodeActions from 'store/modules/cmcode';
import * as templateActions from 'store/modules/template';
import * as modalActions from 'store/modules/modal';

class TemplateCollapseCardContainer extends React.Component {
	state = {
		isOpen: false
	};

	getCmcodes = (major) => {
		const { CmcodeActions } = this.props;

		CmcodeActions.getCmcodeByMajor({ major: major });
	};

	getTemplates = (page) => {
		const { TemplateActions } = this.props;

		TemplateActions.onChange({ name: 'page', value: page });
		TemplateActions.getTemplates({ page });
	};

	handleToggle = () => {
		this.setState((prevState) => {
			const { isOpen } = prevState;

			return {
				isOpen: !isOpen
			};
		});
	};

	handleOpenModal = (name) => {
		const { ModalActions } = this.props;

		ModalActions.open(name);
	}

	handleCloseModal = (name) => () => {
		const { ModalActions } = this.props;

		ModalActions.close(name);
	}

	handleSelect = (e) => {
		const { TemplateActions } = this.props;

		TemplateActions.initialize('errors');
		TemplateActions.selectTemplate(e.dataItem._id);
	};

	handleAddForm = () => {
		const { TemplateActions } = this.props;

		TemplateActions.initialize('errors');
		TemplateActions.initialize('template');
		TemplateActions.initialize('add');
	};

	handleChange = (e) => (target) => {
		const { TemplateActions } = this.props;
		const { name, value } = e.target;

		TemplateActions.onChange({ target, name, value });
	};

	handleUpload = async (file, target) => {
		const { TemplateActions } = this.props;

		let formData = new FormData();
		formData.append('uploadFile', file);

		await axios({
			method: 'POST',
			// url: 'http://192.168.7.9/api/upload',
			url: '/api/upload',
			data: formData,
			config: { headers: { 'Content-Type': 'multipart/form-data' } }
		}).then((response) => {
			TemplateActions.onChange({
				target,
				name: 'templatePath',
				value: response.data
			});

			TemplateActions.onChange({
				target,
				name: 'templateType',
				value: response.data.split('.').pop()
			});
		});
	};

	handleSave = async () => {
		const { TemplateActions, add } = this.props;

		await TemplateActions.addTemplate(add.toJS());
		TemplateActions.initialize('errors');
		this.getTemplates(1);
	};

	handleEdit = async () => {
		const { TemplateActions, template } = this.props;

		const { _id, templateGb, templateName, templateType, templatePath, templateDescription } = template.toJS();

		await TemplateActions.editTemplate({
			id: _id,
			param: {
				templateGb,
				templateName,
				templateType,
				templatePath,
				templateDescription
			}
		});

		this.getTemplates(1);
	};

	handleDelete = (id) => {
		const { TemplateActions } = this.props;

		TemplateActions.deleteTemplate({ id });
		TemplateActions.initialize('template');
		this.getTemplates(1);
		this.handleCloseModal('question')();
	}

	componentDidMount() {
		this.getCmcodes('0004');
		this.getTemplates(1);
	}

	render() {
		const { gbs, templates, template, add, errors, total, lastPage, isOpenQuestion, loading } = this.props;

		if (!gbs || (loading || loading === undefined)) return null;

		return (
			<CollapseCard
				title="양식 관리"
				description="사용하는 양식 관리"
				onToggle={this.handleToggle}
				onAddForm={this.handleAddForm}
				collapse={
					<TemplateCollapse
						gbs={gbs}
						data={templates}
						detail={template}
						add={add}
						errors={errors}
						total={total}
						lastPage={lastPage}
						isOpen={this.state.isOpen}
						isOpenQuestion={isOpenQuestion}
						onOpenModal={this.handleOpenModal}
						onCloseModal={this.handleCloseModal}
						onSelect={this.handleSelect}
						onChange={this.handleChange}
						onUpload={this.handleUpload}
						onSave={this.handleSave}
						onEdit={this.handleEdit}
						onDelete={this.handleDelete}
					/>
				}
			/>
		);
	}
}

export default connect(
	(state) => ({
		gbs: state.cmcode.get('0004'),
		templates: state.template.get('templates'),
		template: state.template.get('template'),
		add: state.template.get('add'),
		errors: state.template.get('errors'),
		total: state.template.get('total'),
		lastPage: state.template.get('lastPage'),
		isOpenQuestion: state.modal.get('questionModal'),
		loading: state.pender.pending['template/GET_TEMPLATES']
	}),
	(dispatch) => ({
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch),
		TemplateActions: bindActionCreators(templateActions, dispatch),
		ModalActions: bindActionCreators(modalActions, dispatch)
	})
)(TemplateCollapseCardContainer);
