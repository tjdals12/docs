import React from 'react';
import ScrollToTop from 'components/ScrollToTop';
import Page from 'components/Page';
import VendorLetterSearchFormContainer from 'containers/Form/VendorLetterSearchFormContainer';
import VendorLetterToolbarContainer from 'containers/Toolbar/VendorLetterToolbarContainer';
import VendorLetterTableContainer from 'containers/Table/VendorLetterTableContainer';
import VendorDetailModalContainer from 'containers/Modal/VendorDetailModalContainer';
import VendorEditModalContainer from 'containers/Modal/VendorEditModalContainer';
import VendorLetterReceiveModalContainer from 'containers/Modal/VendorLetterReceiveModalContainer';
import VendorLetterDetailModalContainer from 'containers/Modal/VendorLetterDetailModalContainer';
import VendorLetterEditModalContainer from 'containers/Modal/VendorLetterEditModalContainer';
import VendorLetterAdditionalReceiveModalContainer from 'containers/Modal/VendorLetterAdditionalReceiveModalContainer';
import DocumentDetailModalContainer from 'containers/Modal/DocumentDetailModalContainer';
import queryString from 'query-string';

const VendorTransmittalsPage = (props) => {
	const { page } = queryString.parse(props.location.search);
	const { writable } = props;

	return (
		<Page
			title="Vendor Letters"
			breadcrumbs={[{ name: 'Letters', active: false }, { name: 'Vendor', active: true }]}
		>
			<ScrollToTop>
				<VendorLetterSearchFormContainer />
				<VendorLetterToolbarContainer writable={writable}/>
				<VendorLetterTableContainer page={parseInt(page || 1, 10)} />
				<VendorDetailModalContainer />
				<VendorEditModalContainer />
				<VendorLetterReceiveModalContainer />
				<VendorLetterDetailModalContainer writable={writable} />
				<VendorLetterEditModalContainer />
				<VendorLetterAdditionalReceiveModalContainer />
				<DocumentDetailModalContainer />
			</ScrollToTop>
		</Page>
	);
};

export default VendorTransmittalsPage;
