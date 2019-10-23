import React from 'react';
import Sidebar from 'components/Layout/Sidebar';
import { connect } from 'react-redux';

class SidebarContainer extends React.Component {
    render() {
        const { roles } = this.props;

        return (
            <Sidebar roles={roles.toJS()} />
        )
    }
}

export default connect(
    (state) => ({
        roles: state.role.get('roles')
    }),
    null
)(SidebarContainer);