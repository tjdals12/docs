import React from 'react';
import ScrollToTop from 'components/ScrollToTop';
import Page from 'components/Page';
import IndexCardContainer from 'containers/Card/IndexCardContainer';
import IndexesDetailTemplateContainer from 'containers/Template/IndexesDetailTemplateContainer';
import DocumentDetailModalContainer from 'containers/Modal/DocumentDetailModalContainer';
import DocumentEditModalContainer from 'containers/Modal/DocumentEditModalContainer';
import VendorDetailModalContainer from 'containers/Modal/VendorDetailModalContainer';
import DocumentInfoDetailModalContainer from 'containers/Modal/DocumentInfoDetailModalContainer';
import LatestDocumentsModalContainer from 'containers/Modal/LatestDocumentsModalContainer';
import queryString from 'query-string';

const IndexesDetailPage = (props) => {
	const { id, page } = queryString.parse(props.location.search);

	return (
		<Page
			title="Index Detail"
			breadcrumbs={[{ name: 'Indexes', active: false }, { name: 'Detail', active: true }]}
		>
			<ScrollToTop>
				<IndexCardContainer id={id} />
				<IndexesDetailTemplateContainer id={id} page={parseInt(page || 1, 10)} />
				<DocumentDetailModalContainer />
				<DocumentEditModalContainer />
				<VendorDetailModalContainer />
				<DocumentInfoDetailModalContainer />
				<LatestDocumentsModalContainer />
			</ScrollToTop>
		</Page>
	);
};

export default IndexesDetailPage;
