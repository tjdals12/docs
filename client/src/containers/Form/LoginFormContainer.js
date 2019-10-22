import React from 'react';
import { withRouter } from 'react-router-dom';
import LoginForm from 'components/Form/LoginForm';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as accountActions from 'store/modules/account';

class LoginFormContainer extends React.Component {

    state = {
        userId: '',
        pwd: ''
    };

    handleChange = (e) => {
        const { name, value } = e.target;

        this.setState({
            ...this.state,
            [name]: value
        });
    }

    handleSubmit = () => {
        const { AccountActions, history } = this.props;
        const { userId, pwd } = this.state;

        AccountActions.login({ userId, pwd }).then(() => {
            history.push('/');
        });
    }

    render() {
        return (
            <LoginForm onChange={this.handleChange} onSubmit={this.handleSubmit} />
        )
    }
}

export default connect(
    (state) => ({}),
    (dispatch) => ({
        AccountActions: bindActionCreators(accountActions, dispatch)
    })
)(withRouter(LoginFormContainer));