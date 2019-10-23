import React from 'react';
import Sidebar from 'components/Layout/Sidebar';
import { connect } from 'react-redux';

class SidebarContainer extends React.Component {
    render() {
        const { roles, myRoles } = this.props;

        return (
            <Sidebar roles={roles.toJS()} myRoles={myRoles ? myRoles.toJS() : []} />
        )
    }
}

export default connect(
    (state) => ({
        roles: state.role.get('roles'),
        myRoles: state.account.getIn(['userInfo', 'roles'])
    }),
    null
)(SidebarContainer);