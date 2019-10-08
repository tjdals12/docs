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

    handleOpen = () => {
        this.setState(prevState => {
            let { isOpen } = prevState;

            return {
                isOpen: !isOpen
            }
        })
    }

    componentDidMount() {
        this.getCdMajors();
    }

    render() {
        const { isOpen } = this.state;
        const { cdMajors, loading } = this.props;

        if (loading || loading === undefined) return null;

        return (
            <CollapseCard
                title="공통코드 관리"
                description="공통코드 관리"
                onOpen={this.handleOpen}
                collapse={
                    <CmcodeCollapse cdMajors={cdMajors} isOpen={isOpen} />
                } />
        )
    }
}

export default connect(
    (state) => ({
        cdMajors: state.cmcode.get('cdMajors'),
        loading: state.pender.pending['cmcode/GET_CDMAJORS']
    }),
    (dispatch) => ({
        CmcodeActions: bindActionCreators(cmcodeActions, dispatch)
    })
)(CmcodeCollapseCardContainer);