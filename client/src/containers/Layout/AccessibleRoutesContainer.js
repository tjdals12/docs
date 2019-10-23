import React from 'react';
import AccessibleRoutes from 'components/Layout/AccessibleRoutes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as roleActions from 'store/modules/role';

class AccessibleRoutesContainer extends React.Component {
    getRoles = () => {
        const { RoleActions } = this.props;

        RoleActions.getRoles();
    }

    componentDidMount() {
        this.getRoles();
    }

    render() {
        const { roles, myRoles } = this.props;

        return (
            <AccessibleRoutes roles={roles.toJS()} myRoles={myRoles ? myRoles.toJS() : []} />
        )
    }
}

export default connect(
    (state) => ({
        roles: state.role.get('roles'),
        myRoles: state.account.getIn(['userInfo', 'roles'])
    }),
    (dispatch) => ({
        RoleActions: bindActionCreators(roleActions, dispatch)
    })
)(AccessibleRoutesContainer);