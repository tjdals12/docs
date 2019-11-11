import React from 'react';
import Toolbar from 'components/Toolbar';
import { connect } from 'react-redux';

class IndexesInfosToolbarContainer extends React.Component {
    handleExport = () => {
        console.warn('Warning: handleExport is not ready yet');
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

export default connect(null, null)(IndexesInfosToolbarContainer);