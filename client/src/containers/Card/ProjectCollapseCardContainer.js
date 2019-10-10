import React from 'react';
import CollapseCard from 'components/Card/CollapseCard';
import ProjectCollapse from 'components/Collapse/ProjectCollapse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as projectActions from 'store/modules/project';
import * as cmcodeActions from 'store/modules/cmcode';

class ProjectCollapseCardContainer extends React.Component {
	state = {
		isOpen: false
	};

	getCmcodes = (major) => {
		const { CmcodeActions } = this.props;

		CmcodeActions.getCmcodeByMajor({ major: major });
	};

	getProjects = async (page) => {
		const { ProjectActions } = this.props;

		ProjectActions.onChange({ name: 'page', value: page });
		await ProjectActions.getProjects({ page });
	};

	handleToggle = () => {
		this.setState((prevState) => {
			const { isOpen } = prevState;

			return {
				isOpen: !isOpen
			};
		});
	};

	handleSelect = (e) => {
		const { ProjectActions } = this.props;

		ProjectActions.initialize('errors');
		ProjectActions.selectProject(e.dataItem._id);
	};

	handleAddForm = () => {
		const { ProjectActions } = this.props;

		ProjectActions.initialize('errors');
		ProjectActions.initialize('project');
		ProjectActions.initialize('add');
	};

	handleChange = (e) => (target) => {
		const { ProjectActions } = this.props;
		const { name, value } = e.target;

		ProjectActions.onChange({ target, name, value });
	};

	handleSave = async () => {
		const { ProjectActions, add, page } = this.props;

		await ProjectActions.addProject(add.toJS());
		ProjectActions.initialize('errors');
		this.getProjects(page);
	};

	handleEdit = async () => {
		const { ProjectActions, project, page } = this.props;

		const {
			_id,
			projectGb,
			projectName,
			projectCode,
			effStaDt,
			effEndDt,
			client,
			clientCode,
			contractor,
			contractorCode,
			memo
		} = project.toJS();

		await ProjectActions.editProject({
			id: _id,
			param: {
				projectGb,
				projectName,
				projectCode,
				effStaDt,
				effEndDt,
				client,
				clientCode,
				contractor,
				contractorCode,
				memo
			}
		});

		this.getProjects(page);
	};

	handleDelete = (id, yn) => {
		const { ProjectActions, page } = this.props;

		ProjectActions.deleteProject({ id, yn });
		this.getProjects(page);
	}

	componentDidMount() {
		this.getCmcodes('0000');
		this.getProjects(1);
	}

	render() {
		const { isOpen } = this.state;
		const { gbs, projects, project, add, errors, total, lastPage, loading } = this.props;

		if (!gbs || (loading || loading === undefined)) return null;

		return (
			<CollapseCard
				title="프로젝트 관리"
				description="관리하는 프로젝트 목록"
				onToggle={this.handleToggle}
				onAddForm={this.handleAddForm}
				collapse={
					<ProjectCollapse
						gbs={gbs}
						data={projects}
						detail={project}
						add={add}
						errors={errors}
						total={total}
						lastPage={lastPage}
						isOpen={isOpen}
						onPage={this.getProjects}
						onSelect={this.handleSelect}
						onChange={this.handleChange}
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
		gbs: state.cmcode.get('0000'),
		projects: state.project.get('projects'),
		project: state.project.get('project'),
		add: state.project.get('add'),
		errors: state.project.get('errors'),
		total: state.project.get('total'),
		page: state.project.get('page'),
		lastPage: state.project.get('lastPage'),
		loading: state.pender.pending['project/GET_PROJECTS']
	}),
	(dispatch) => ({
		ProjectActions: bindActionCreators(projectActions, dispatch),
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch)
	})
)(ProjectCollapseCardContainer);
