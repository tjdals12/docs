import React from 'react';
import Toolbar from 'components/Toolbar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as infoActions from 'store/modules/info';

class IndexesInfosToolbarContainer extends React.Component {
    handleExport = () => {
        const { InfoActions, search } = this.props;

        InfoActions.exportExcel(search.toJS());
    }

    render() {
        const { writable } = this.props;

        if(!writable) return null;

        return (
            <Toolbar buttons={[
                { color: 'primary', name: 'EXPORT', event: this.handleExport }
            ]} />
        )
    }
}

export default connect(
    (state) => ({
        search: state.info.get('search'),
    }),
    (dispatch) => ({
        InfoActions: bindActionCreators(infoActions, dispatch)
    })
)(IndexesInfosToolbarContainer);