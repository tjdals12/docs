import React from 'react';
import ScrollToTop from 'components/ScrollToTop';
import Page from 'components/Page';
import DocumentInfoSearchFormContainer from 'containers/Form/DocumentInfoSearchFormContainer';
import DocumentInfoTableContainer from 'containers/Table/DocumentInfoTableContainer';
import VendorDetailModalContainer from 'containers/Modal/VendorDetailModalContainer';
import DocumentInfoDetailModalContainer from 'containers/Modal/DocumentInfoDetailModalContainer';
import DocumentDetailModalContainer from 'containers/Modal/DocumentDetailModalContainer';
import queryString from 'query-string';

const IndexesInfosPage = (props) => {
	const { page } = queryString.parse(props.location.search);

	return (
		<ScrollToTop>
			<Page title="Infos" breadcrumbs={[ { name: 'Indexes', active: false }, { name: 'Infos', active: true } ]}>
				<DocumentInfoSearchFormContainer />
				<DocumentInfoTableContainer page={parseInt(page || 1, 10)} />
				<VendorDetailModalContainer />
				<DocumentInfoDetailModalContainer />
				<DocumentDetailModalContainer />
			</Page>
		</ScrollToTop>
	);
};

export default IndexesInfosPage;
