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


    handleOpen = () => {
        this.setState(prevState => {
            let { isOpen } = prevState;

            return {
                isOpen: !isOpen
            }
        })
    }

    render() {
        const { isOpen } = this.state;

        return (
            <CollapseCard
                title="공통코드 관리"
                description="공통코드 관리"
                onOpen={this.handleOpen}
                collapse={
                    <CmcodeCollapse isOpen={isOpen} />
                } />
        )
    }
}

export default connect(
    (state) => ({

    }),
    (dispatch) => ({
        CmcodeActions: bindActionCreators(cmcodeActions, dispatch)
    })
)(CmcodeCollapseCardContainer);