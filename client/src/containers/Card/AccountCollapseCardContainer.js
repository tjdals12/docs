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

    getUsers = (page) => {
        const { AccountActions } = this.props;

        AccountActions.onChange({ name: 'page', value: page })
        AccountActions.getUsers(page);
    }

    getUser = (id) => {
        const { AccountActions } = this.props;

        AccountActions.getUser({ id });
    }

    handleToggle = () => {
        this.setState(prevState => {
            const { isOpen } = prevState;

            return {
                isOpen: !isOpen
            }
        })
    }

    handleAddForm = () => {
        const { AccountActions } = this.props;

        AccountActions.initialize('user');
    }

    handleChange = (target) => (e) => {
        const { AccountActions } = this.props;
        const { name, value } = e.target;

        AccountActions.onChange({ target, name, value });
    }

    handleChangeRoles = (target) => (e) => {
        const { AccountActions } = this.props;
        const { name, value, checked } = e.target;

        AccountActions.setCheckedList({ target, name, value, checked });
    }

    handleSave = async () => {
        const { AccountActions, add, page } = this.props;

        await AccountActions.addUser(add.toJS());
        AccountActions.initialize('add');
        AccountActions.initialize('errors');
        this.getUsers(page);
    }

    handleEdit = async (id) => {
        const { AccountActions, edit, page } = this.props;

        await AccountActions.editUser({ id, param: { ...edit.toJS() } });
        AccountActions.initialize('errors');
        this.getUsers(page);
        this.getUser(id);
    }

    handleDelete = async (id, yn) => {
        const { AccountActions, page } = this.props;

        await AccountActions.deleteUser({ id, param: { yn } });
        this.getUsers(page);
        this.getUser(id);
    }

    componentDidMount() {
        this.getUsers(1);
    }

    render() {
        const { isOpen } = this.state;
        const { roles, users, user, add, edit, errors, count, page } = this.props;

        return (
            <CollapseCard
                title="계정 관리"
                description="계정 관리"
                onToggle={this.handleToggle}
                onAddForm={this.handleAddForm}
                collapse={
                    <AccountCollapse
                        isOpen={isOpen}
                        roles={roles}
                        users={users}
                        user={user}
                        add={add}
                        edit={edit}
                        errors={errors}
                        count={count}
                        page={page}
                        onPage={this.getUsers}
                        onSelect={this.getUser}
                        onChange={this.handleChange}
                        onChangeRoles={this.handleChangeRoles}
                        onSave={this.handleSave}
                        onEdit={this.handleEdit}
                        onDelete={this.handleDelete}
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
        user: state.account.get('user'),
        edit: state.account.get('edit'),
        add: state.account.get('add'),
        errors: state.account.get('errors'),
        count: state.account.get('count'),
        page: state.account.get('page')
    }),
    (dispstch) => ({
        RoleActions: bindActionCreators(roleActions, dispstch),
        AccountActions: bindActionCreators(accountActions, dispstch)
    })
)(AccountsCopllapseCardContainer);