import React from 'react';
import ScrollToTop from 'components/ScrollToTop';
import Page from 'components/Page';
import DashboardTemplateContainer from 'containers/Template/DashboardTemplateContainer';

const DashboardPage = (props) => {
	return (
		<Page title="Dashboard" breadcrumbs={[{ name: 'Dashboard', active: true }]}>
			<ScrollToTop>
				<DashboardTemplateContainer />
			</ScrollToTop>
		</Page>
	);
};

export default DashboardPage;
