import React from 'react';
import ScrollToTop from 'components/ScrollToTop';
import Page from 'components/Page';
import DocumentSearchFormContainer from 'containers/Form/DocumentSearchFormContainer';
import DocumentTableContainer from 'containers/Table/DocumentTableContainer';
import DocumentToolbarContainer from 'containers/Toolbar/DocumentToolbarContainer';
import DocumentAddModalContainer from 'containers/Modal/DocumentAddModalContainer';
import DocumentDetailModalContainer from 'containers/Modal/DocumentDetailModalContainer';
import DocumentEditModalContainer from 'containers/Modal/DocumentEditModalContainer';
import VendorDetailModalContainer from 'containers/Modal/VendorDetailModalContainer';
import queryString from 'query-string';

const DocumentsPage = (props) => {
	const { page } = queryString.parse(props.location.search);
	const { writable } = props;

	return (
		<Page title="Documents" breadcrumbs={[{ name: 'Documents', active: true }]}>
			<ScrollToTop>
				<DocumentSearchFormContainer />
				<DocumentToolbarContainer writable={writable} page={parseInt(page || 1, 10)}/>
				<DocumentTableContainer page={parseInt(page || 1, 10)} />
				
				<DocumentAddModalContainer />
				<DocumentDetailModalContainer writable={writable} />
				<DocumentEditModalContainer />
				<VendorDetailModalContainer />
			</ScrollToTop>
		</Page >

	);
};

export default DocumentsPage;
