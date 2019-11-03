import React from 'react';
import CollapseCard from 'components/Card/CollapseCard';
import AccountCollapse from 'components/Collapse/AccountCollapse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as roleActions from 'store/modules/role';
import * as accountActions from 'store/modules/account';

class AccountsCopllapseCardContainer extends React.Component {
    state = {
        isOpen: false
    }

    getRoles = () => {
        const { RoleActions } = this.props;

        RoleActions.getRoles();
    }

    getUsers = () => {
        const { AccountActions } = this.props;

        AccountActions.getUsers();
    }

    handleToggle = () => {
        this.setState(prevState => {
            const { isOpen } = prevState;

            return {
                isOpen: !isOpen
            }
        })
    }

    componentDidMount() {
        this.getUsers();
    }

    render() {
        const { isOpen } = this.state;
        const { roles, users, count, page } = this.props;

        return (
            <CollapseCard
                title="계정 관리"
                description="계정 관리"
                onToggle={this.handleToggle}
                collapse={
                    <AccountCollapse
                        isOpen={isOpen}
                        roles={roles}
                        users={users}
                        count={count}
                        page={page}
                    />
                }
            />
        )
    }
}

export default connect(
    (state) => ({
        roles: state.role.get('roles'),
        users: state.account.get('users'),
        count: state.account.get('count'),
        page: state.account.get('page')
    }),
    (dispstch) => ({
        RoleActions: bindActionCreators(roleActions, dispstch),
        AccountActions: bindActionCreators(accountActions, dispstch)
    })
)(AccountsCopllapseCardContainer);