import React from 'react';
import Page from 'components/Page';

const DashboardPage = (props) => {
	return (
		<Page title="Dashboard" breadcrumbs={[ { name: 'Dashboard', active: true } ]}>
			<h1>Dashboard Page</h1>
			<p>This is page</p>
		</Page>
	);
};

export default DashboardPage;
