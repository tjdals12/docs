import React from 'react';
import Toolbar from 'components/Toolbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modalActions from 'store/modules/modal';
import * as indexesActions from 'store/modules/indexes';

class IndexesOverallToolbarContainer extends React.Component {
    handleOpenAdd = () => {
        const { ModalActions, IndexesActions } = this.props;

        IndexesActions.initialize('error');
        IndexesActions.initialize('add');
        IndexesActions.initialize('fileError');
        ModalActions.open('documentIndexAdd');
    }

    handleOpenInfoAdd = () => {
        const{ ModalActions, IndexesActions } = this.props;

        IndexesActions.setTarget('');
        IndexesActions.initialize('error');
        ModalActions.open('documentInfoAdd');
    }

    render() {
        const { writable } = this.props;

        if(!writable) return null;

        return (
            <Toolbar buttons={[
                { color: 'primary', name: '생성', event: this.handleOpenAdd },
                { color: 'secondary', name: '문서 추가', event: this.handleOpenInfoAdd}
            ]}/>
        )
    }
}

export default connect(
    null,
    (dispatch) => ({
        ModalActions: bindActionCreators(modalActions, dispatch),
        IndexesActions: bindActionCreators(indexesActions, dispatch)
    })
)(IndexesOverallToolbarContainer);