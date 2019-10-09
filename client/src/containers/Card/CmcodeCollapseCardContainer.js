import React from 'react';
import CollapseCard from 'components/Card/CollapseCard';
import CmcodeCollapse from 'components/Collapse/CmcodeCollapse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cmcodeActions from 'store/modules/cmcode';

class CmcodeCollapseCardContainer extends React.Component {
    state = {
        isOpen: false
    }

    getCdMajors = () => {
        const { CmcodeActions } = this.props;

        CmcodeActions.getCdMajors();
    }

    getCdMinors = (id) => {
        const { CmcodeActions } = this.props;

        CmcodeActions.getCdMinors(id);
    }

    getCdMinor = (id) => {
        const { CmcodeActions } = this.props;

        CmcodeActions.getCdMinor(id);
    }

    handleOpen = () => {
        this.setState(prevState => {
            let { isOpen } = prevState;

            return {
                isOpen: !isOpen
            }
        })
    }

    handleAddForm = () => {
        const { CmcodeActions } = this.props;

        CmcodeActions.initialize('cdMinor');
        CmcodeActions.initialize('add');
    }

    handleChange = (e) => (target) => {
        const { CmcodeActions } = this.props;
        const { name, value } = e.target;

        CmcodeActions.onChange({ target, name, value });
    }

    handleSave = (id) => {
        const { CmcodeActions, add } = this.props;

        CmcodeActions.addCdMinor(id, { ...add.toJS() });
        CmcodeActions.initialize('add');
    }

    componentDidMount() {
        this.getCdMajors();
    }

    render() {
        const { isOpen } = this.state;
        const { cdMajors, cdMajor, cdMinor, add, loading } = this.props;

        if (loading || loading === undefined) return null;

        return (
            <CollapseCard
                title="공통코드 관리"
                description="공통코드 관리"
                onOpen={this.handleOpen}
                onAddForm={this.handleAddForm}
                collapse={
                    <CmcodeCollapse
                        cdMajors={cdMajors}
                        cdMajor={cdMajor}
                        cdMinor={cdMinor}
                        add={add}
                        isOpen={isOpen}
                        onSelectCdMajor={this.getCdMinors}
                        onSelectCdMinor={this.getCdMinor}
                        onChange={this.handleChange}
                        onSave={this.handleSave}
                    />
                } />
        )
    }
}

export default connect(
    (state) => ({
        cdMajors: state.cmcode.get('cdMajors'),
        cdMajor: state.cmcode.get('cdMajor'),
        cdMinor: state.cmcode.get('cdMinor'),
        add: state.cmcode.get('add'),
        loading: state.pender.pending['cmcode/GET_CDMAJORS'],
    }),
    (dispatch) => ({
        CmcodeActions: bindActionCreators(cmcodeActions, dispatch)
    })
)(CmcodeCollapseCardContainer);