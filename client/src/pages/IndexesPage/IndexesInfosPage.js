import React from 'react';
import ScrollToTop from 'components/ScrollToTop';
import Page from 'components/Page';
import DocumentInfoSearchFormContainer from 'containers/Form/DocumentInfoSearchFormContainer';
import IndexesInfosToolbarContainer from 'containers/Toolbar/IndexesInfosToolbarContainer';
import DocumentInfoTableContainer from 'containers/Table/DocumentInfoTableContainer';
import VendorDetailModalContainer from 'containers/Modal/VendorDetailModalContainer';
import DocumentInfoDetailModalContainer from 'containers/Modal/DocumentInfoDetailModalContainer';
import DocumentDetailModalContainer from 'containers/Modal/DocumentDetailModalContainer';
import LoadingModalContainer from 'containers/Modal/LoadingModalContainer';
import queryString from 'query-string';

const IndexesInfosPage = (props) => {
	const { page } = queryString.parse(props.location.search);
	const { writable } = props;

	return (
		<Page title="Infos" breadcrumbs={[{ name: 'Indexes', active: false }, { name: 'Infos', active: true }]}>
			<ScrollToTop>
				<DocumentInfoSearchFormContainer />
				<IndexesInfosToolbarContainer writable={writable}/>
				<DocumentInfoTableContainer page={parseInt(page || 1, 10)} />

				<VendorDetailModalContainer />
				<DocumentInfoDetailModalContainer />
				<DocumentDetailModalContainer />
				<LoadingModalContainer />
			</ScrollToTop>
		</Page>
	);
};

export default IndexesInfosPage;
