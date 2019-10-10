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

	getCdMajors = (page) => {
		const { CmcodeActions } = this.props;

		CmcodeActions.onChange({ name: 'majorPage', value: page });
		CmcodeActions.getCdMajors(page);
	};

	getCdMinors = (id, page) => {
		const { CmcodeActions } = this.props;

		CmcodeActions.onChange({ name: 'minorPage', value: page });
		CmcodeActions.getCdMinors(id, page);
	};

	getCdMinor = (id) => {
		const { CmcodeActions } = this.props;

		CmcodeActions.getCdMinor(id);
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
	};

	handleChange = (e) => (target) => {
		const { CmcodeActions } = this.props;
		const { name, value } = e.target;

		CmcodeActions.onChange({ target, name, value });
	};

	handleSave = (id) => {
		const { CmcodeActions, add, minorPage } = this.props;

		CmcodeActions.addCdMinor(id, { ...add.toJS() });
		CmcodeActions.initialize('add');
		this.getCdMinors(id, minorPage);
	};

	handleEdit = (major) => {
		const { CmcodeActions, cdMinor: edit, minorPage } = this.props;
		const { _id: minor, cdMinor, cdSName } = edit.toJS();

		CmcodeActions.editCdMinor(major, minor, { cdMinor, cdSName });
		this.getCdMinors(major, minorPage);
	}

	handleDelete = (major) => {
		const { CmcodeActions, cdMinor, minorPage } = this.props;

		CmcodeActions.deleteCdMinor(major, cdMinor.get('_id'));
		this.getCdMinors(major, minorPage)
	}

	handleRecovery = (major) => {
		const { CmcodeActions, cdMinor, minorPage } = this.props;

		CmcodeActions.recoveryCdMinor(major, cdMinor.get('_id'));
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
