import React from 'react';
import ScrollToTop from 'components/ScrollToTop';
import Page from 'components/Page';
import LetterSearchFormContainer from 'containers/Form/LetterSearchFormContainer';
import LetterTableContainer from 'containers/Table/LetterTableContainer';
import LetterAddModalContainer from 'containers/Modal/LetterAddModalContainer';
import LetterDetailModalContainer from 'containers/Modal/LetterDetailModalContainer';
import LetterEditModalContainer from 'containers/Modal/LetterEditModalContainer';
import ReferenceSearchModalContainer from 'containers/Modal/ReferenceSearchModalContainer';
import DocumentDetailModalContainer from 'containers/Modal/DocumentDetailModalContainer';
import VendorLetterDetailModalContainer from 'containers/Modal/VendorLetterDetailModalContainer';
import queryString from 'query-string';

const InternalTransmittalPage = (props) => {
	const { page } = queryString.parse(props.location.search);
	const { writable } = props;

	return (
		<ScrollToTop>
			<Page
				title="Internal Letters"
				breadcrumbs={[{ name: 'Letters', active: false }, { name: 'Internal', active: true }]}
			>
				<LetterSearchFormContainer />
				<LetterTableContainer writable={writable} page={parseInt(page || 1, 10)} />
				<LetterAddModalContainer />
				<LetterDetailModalContainer />
				<LetterEditModalContainer />
				<ReferenceSearchModalContainer />
				<DocumentDetailModalContainer />
				<VendorLetterDetailModalContainer />
			</Page>
		</ScrollToTop>
	);
};

export default InternalTransmittalPage;
