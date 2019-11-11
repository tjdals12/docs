import React from 'react';
import Toolbar from 'components/Toolbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modalActions from 'store/modules/modal';
import * as letterActions from 'store/modules/letter';

class LetterToolbarContainer extends React.Component{
    handleOpenAdd = () => {
        const { ModalActions, LetterActions } = this.props;

        LetterActions.initialize('add');
        ModalActions.open('letterAdd');
    }

    render() {
        const { writable } = this.props;

        if (!writable) return null;

        return(
            <Toolbar buttons={[
                { color: 'primary', name: '추가', event: this.handleOpenAdd }
            ]}/>
        )
    }
}

export default connect(
    null,
    (dispatch) => ({
        ModalActions: bindActionCreators(modalActions, dispatch),
        LetterActions: bindActionCreators(letterActions, dispatch)
    })
)(LetterToolbarContainer);