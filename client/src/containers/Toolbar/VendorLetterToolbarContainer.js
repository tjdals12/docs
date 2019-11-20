import React from 'react';
import Toolbar from 'components/Toolbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modalActions from 'store/modules/modal';
import * as vendorLetterActions from 'store/modules/vendorLetter';

class VendorLetterToolbarContainer extends React.Component {

    handleOpenAdd = () => {
        const { ModalActions, VendorLetterActions } = this.props;

        VendorLetterActions.initialize('receive');
        VendorLetterActions.initialize('errors');
        ModalActions.open('vendorLetterReceive');
    }

    handleOpenAdditionalAdd = () => {
        const { ModalActions, VendorLetterActions } = this.props;

        VendorLetterActions.initialize('additionalReceive');
        ModalActions.open('vendorLetterAdditionalReceive');
    }

    render() {
        const { writable } = this.props;

        if (!writable) return null;

        return (
            <Toolbar buttons={[
                { color: 'primary', name: '접수', event: this.handleOpenAdd },
                { color: 'secondary', name: '추가 접수', event: this.handleOpenAdditionalAdd }
            ]}/>
        )
    }
}

export default connect(
    null,
    (dispatch) => ({
        ModalActions: bindActionCreators(modalActions, dispatch),
        VendorLetterActions: bindActionCreators(vendorLetterActions, dispatch)
    })
)(VendorLetterToolbarContainer);