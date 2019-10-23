import React from 'react';
import ScrollToTop from 'components/ScrollToTop';
import Page from 'components/Page';
import VendorSearchFormContainer from 'containers/Form/VendorSearchFormContainer';
import VendorListContainer from 'containers/List/VendorListContainer';
import VendorAddModalContainer from 'containers/Modal/VendorAddModalContainer';
import VendorDetailModalContainer from 'containers/Modal/VendorDetailModalContainer';
import VendorEditModalContainer from 'containers/Modal/VendorEditModalContainer';
import VendorPersonAddModalContainer from 'containers/Modal/VendorPersonAddModalContainer';
import queryString from 'query-string';

const VendorsPage = (props) => {
	const { page } = queryString.parse(props.location.search);
	const { writable } = props;

	return (
		<ScrollToTop>
			<Page title="Vendors" breadcrumbs={[{ name: 'Vendors', active: true }]}>
				<VendorSearchFormContainer />
				<VendorListContainer writable={writable} page={parseInt(page || 1, 10)} />
				<VendorAddModalContainer />
				<VendorDetailModalContainer />
				<VendorEditModalContainer />
				<VendorPersonAddModalContainer />
			</Page>
		</ScrollToTop>
	);
};

export default VendorsPage;
