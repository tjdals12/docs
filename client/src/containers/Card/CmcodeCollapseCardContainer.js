import React from 'react';
import CollapseCard from 'components/Card/CollapseCard';
import CmcodeCollapse from 'components/Collapse/CmcodeCollapse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cmcodeActions from 'store/modules/cmcode';

class CmcodeCollapseCardContainer extends React.Component {
	state = {
		isOpen: false
	};

	getCdMajors = async (page) => {
		const { CmcodeActions } = this.props;

		await CmcodeActions.getCdMajors(page);
		CmcodeActions.onChange({ name: 'majorPage', value: page });
	};

	getCdMinors = async (id, page) => {
		const { CmcodeActions } = this.props;

		await CmcodeActions.getCdMinors(id, page);
		CmcodeActions.onChange({ name: 'minorPage', value: page });
	};

	getCdMinor = async (id) => {
		const { CmcodeActions } = this.props;

		await CmcodeActions.getCdMinor(id);
		CmcodeActions.initialize('errors');
	};

	handleToggle = () => {
		this.setState((prevState) => {
			let { isOpen } = prevState;

			return {
				isOpen: !isOpen
			};
		});
	};

	handleAddForm = () => {
		const { CmcodeActions } = this.props;

		CmcodeActions.initialize('cdMinor');
		CmcodeActions.initialize('add');
		CmcodeActions.initialize('errors');
	};

	handleChange = (e) => (target) => {
		const { CmcodeActions } = this.props;
		const { name, value } = e.target;

		CmcodeActions.onChange({ target, name, value });
	};

	handleSave = async (id) => {
		const { CmcodeActions, add, minorPage } = this.props;

		await CmcodeActions.addCdMinor(id, { ...add.toJS() });
		this.getCdMinors(id, minorPage);
	};

	handleEdit = async (major) => {
		const { CmcodeActions, cdMinor: edit, minorPage } = this.props;
		const { _id: minor, cdMinor, cdSName } = edit.toJS();

		await CmcodeActions.editCdMinor(major, minor, { cdMinor, cdSName });
		this.getCdMinors(major, minorPage);
	}

	handleDelete = async (major) => {
		const { CmcodeActions, cdMinor, minorPage } = this.props;

		await CmcodeActions.deleteCdMinor(major, cdMinor.get('_id'));
		this.getCdMinors(major, minorPage)
	}

	handleRecovery = async (major) => {
		const { CmcodeActions, cdMinor, minorPage } = this.props;

		await CmcodeActions.recoveryCdMinor(major, cdMinor.get('_id'));
		this.getCdMinors(major, minorPage);
	}

	componentDidMount() {
		this.getCdMajors(1);
	}

	render() {
		const { isOpen } = this.state;
		const {
			cdMajors,
			cdMajor,
			cdMinor,
			add,
			errors,
			majorCount,
			majorPage,
			majorLastPage,
			minorCount,
			minorPage,
			minorLastPage,
			loading
		} = this.props;

		if (loading || loading === undefined) return null;

		return (
			<CollapseCard
				title="공통코드 관리"
				description="공통코드 관리"
				onToggle={this.handleToggle}
				onAddForm={this.handleAddForm}
				collapse={
					<CmcodeCollapse
						cdMajors={cdMajors}
						cdMajor={cdMajor}
						cdMinor={cdMinor}
						add={add}
						errors={errors}
						majorCount={majorCount}
						majorPage={majorPage}
						majorLastPage={majorLastPage}
						minorCount={minorCount}
						minorPage={minorPage}
						minorLastPage={minorLastPage}
						isOpen={isOpen}
						onPageMajor={this.getCdMajors}
						onSelectCdMajor={this.getCdMinors}
						onSelectCdMinor={this.getCdMinor}
						onChange={this.handleChange}
						onSave={this.handleSave}
						onEdit={this.handleEdit}
						onDelete={this.handleDelete}
						onRecovery={this.handleRecovery}
					/>
				}
			/>
		);
	}
}

export default connect(
	(state) => ({
		cdMajors: state.cmcode.get('cdMajors'),
		cdMajor: state.cmcode.get('cdMajor'),
		cdMinor: state.cmcode.get('cdMinor'),
		add: state.cmcode.get('add'),
		errors: state.cmcode.get('errors'),
		majorCount: state.cmcode.get('majorCount'),
		majorPage: state.cmcode.get('majorPage'),
		majorLastPage: state.cmcode.get('majorLastPage'),
		minorCount: state.cmcode.get('minorCount'),
		minorPage: state.cmcode.get('minorPage'),
		minorLastPage: state.cmcode.get('minorLastPage'),
		loading: state.pender.pending['cmcode/GET_CDMAJORS']
	}),
	(dispatch) => ({
		CmcodeActions: bindActionCreators(cmcodeActions, dispatch)
	})
)(CmcodeCollapseCardContainer);
