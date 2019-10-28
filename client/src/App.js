import React from 'react';
import AccessibleRoutesContainer from 'containers/Layout/AccessibleRoutesContainer';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as accountActions from 'store/modules/account';
import storage from 'lib/storage';

class App extends React.Component {
	initializeUserInfo = async () => {
		const { history } = this.props;

		const userInfo = storage.get('userInfo');
		if (!userInfo) {
			history.push('/login');
			return;
		}

		const { AccountActions } = this.props;
		AccountActions.setUserInfo(userInfo);
		try {
			await AccountActions.check();
		} catch (e) {
			storage.remove('userInfo');
			history.push('/login');
		}
	}

	componentDidMount() {
		this.initializeUserInfo();
	}

	render() {
		return <AccessibleRoutesContainer />
	}
}

export default connect(
	null,
	(dispatch) => ({
		AccountActions: bindActionCreators(accountActions, dispatch)
	})
)(App);
