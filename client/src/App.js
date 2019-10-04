import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { LayoutRoute, MainLayout } from 'components/Layout';
import {
	DashboardPage,
	DocumentsPage,
	VendorsPage,
	IndexesOverallPage,
	IndexesDetailPage,
	IndexesInfosPage,
	VendorLettersPage,
	LettersPage,
	SettingsPage
} from 'pages';

class App extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<LayoutRoute exact path="/" layout={MainLayout} component={DashboardPage} />
					<LayoutRoute exact path="/documents" layout={MainLayout} component={DocumentsPage} />
					<LayoutRoute exact path="/vendors" layout={MainLayout} component={VendorsPage} />
					<LayoutRoute exact path="/indexes/overall" layout={MainLayout} component={IndexesOverallPage} />
					<LayoutRoute exact path="/indexes/detail" layout={MainLayout} component={IndexesDetailPage} />
					<LayoutRoute exact path="/indexes/infos" layout={MainLayout} component={IndexesInfosPage} />
					<LayoutRoute exact path="/letters/vendor" layout={MainLayout} component={VendorLettersPage} />
					<LayoutRoute exact path="/letters/internal" layout={MainLayout} component={LettersPage} />
					<LayoutRoute exact path="/settings" layout={MainLayout} component={SettingsPage} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App;
