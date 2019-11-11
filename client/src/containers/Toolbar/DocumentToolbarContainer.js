import React from 'react';
import Toolbar from 'components/Toolbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modalActions from 'store/modules/modal';
import * as documenActions from 'store/modules/document';

class DocumentToolbarContainer extends React.Component{
    handleOpenAdd = () => {
        const { ModalActions } = this.props;

        ModalActions.open('documentAdd');
    }

    handleDelete = () => {
        const { DocumentActions, checkedList, page } = this.props;

        DocumentActions.deleteDocuments(checkedList.toJS(), page);
        DocumentActions.initialize('checkedList');
    }

    render(){
        const { writable } = this.props;

        if(!writable) return null;

        return(
            <Toolbar 
                buttons={[ 
                    { color: 'primary', name: '추가', event: this.handleOpenAdd },
                    { color: 'secondary', name: '삭제', event: this.handleDelete } 
                ]}
            />
        )
    }
}

export default connect(
    (state) => ({
        checkedList: state.document.get('checkedList')
    }),
    (dispatch) => ({
        ModalActions: bindActionCreators(modalActions, dispatch),
        DocumentActions: bindActionCreators(documenActions, dispatch)
    })
)(DocumentToolbarContainer);