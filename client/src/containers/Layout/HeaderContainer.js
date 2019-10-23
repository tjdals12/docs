import React from 'react';
import Header from 'components/Layout/Header';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as accountActions from 'store/modules/account';

class HeaderContainer extends React.Component {

    handleLogout = async () => {
        const { AccountActions } = this.props;

        await AccountActions.logout();
        window.location.href = '/login';
    }

    render() {
        const { userInfo } = this.props;

        return <Header userInfo={userInfo} onLogout={this.handleLogout} />
    }
}

export default connect(
    (state) => ({
        userInfo: state.account.get('userInfo')
    }),
    (dispatch) => ({
        AccountActions: bindActionCreators(accountActions, dispatch)
    })
)(HeaderContainer);