import React from 'react';
import ScrollToTop from 'components/ScrollToTop';
import Page from 'components/Page';
import ProjectCollapseCardContainer from 'containers/Card/ProjectCollapseCardContainer';
import TemplateCollapseCardContainer from 'containers/Card/TemplateCollapseCardContainer';
import CmcodeCollapseCardContainer from 'containers/Card/CmcodeCollapseCardContainer';
import ManagerCollapseCardContainer from 'containers/Card/ManagerCollapseCardContainer';
import AccountCollapseCardContainer from 'containers/Card/AccountCollapseCardContainer';


const SettingsPage = () => {
	return (
		<Page title="Settings" breadcrumbs={[{ name: 'Settings', active: true }]}>
			<ScrollToTop>
				<ProjectCollapseCardContainer />
				<TemplateCollapseCardContainer />
				<CmcodeCollapseCardContainer />
				<ManagerCollapseCardContainer />
				<AccountCollapseCardContainer />
			</ScrollToTop>
		</Page>
	);
};

export default SettingsPage;
