import React from 'react';
import Toolbar from 'components/Toolbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modalActions from 'store/modules/modal';
import * as vendorActions from 'store/modules/vendor';

class VendorToolbarContainer extends React.Component {
    handleOpenAdd = () => {
        const { ModalActions, VendorActions } = this.props;

        VendorActions.initialize('errors');
        ModalActions.open('vendorAdd');
    }

    handleOpenPersonAdd = () => {
        const { ModalActions, VendorActions } = this.props;

        VendorActions.setTarget('');
        VendorActions.initialize('targetError');
        VendorActions.initialize('personsError');
        ModalActions.open('vendorPersonAdd');
    }

    render() {
        const { writable } = this.props;

        if(!writable) return null;

        return (
            <Toolbar buttons={[
                { color: 'primary', name: '생성', event: this.handleOpenAdd },
                { color: 'secondary', name: '구성원 추가', event: this.handleOpenPersonAdd }
            ]}/>
        )
    }
}

export default connect(
    null,
    (dispatch) => ({
        ModalActions: bindActionCreators(modalActions, dispatch),
        VendorActions: bindActionCreators(vendorActions, dispatch)
    })
)(VendorToolbarContainer);