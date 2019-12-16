import React from 'react';
import LoadingModal from 'components/Modal/LoadingModal';
import { connect } from 'react-redux';
import { combineReducers } from 'redux';
import * as modalActions from 'store/modules/modal';

class LoadingModalContainer extends React.Component {
    render() {
        const { loading } = this.props;

        return (
            <LoadingModal isOpen={loading} />
        )
    }
}

export default connect(
    (state) => ({
        loading: state.pender.pending['info/EXPORT_EXCEL']
    }),
    (dispatch) => ({
        ModalActions: combineReducers(modalActions, dispatch)
    })
)(LoadingModalContainer)