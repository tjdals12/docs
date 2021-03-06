import React from 'react';
import ScrollToTop from 'components/ScrollToTop';
import Page from 'components/Page';
import LetterSearchFormContainer from 'containers/Form/LetterSearchFormContainer';
import LetterToolbarContainer from 'containers/Toolbar/LetterToolbarContainer';
import LetterTableContainer from 'containers/Table/LetterTableContainer';
import LetterAddModalContainer from 'containers/Modal/LetterAddModalContainer';
import LetterDetailModalContainer from 'containers/Modal/LetterDetailModalContainer';
import LetterEditModalContainer from 'containers/Modal/LetterEditModalContainer';
import ReferenceSearchModalContainer from 'containers/Modal/ReferenceSearchModalContainer';
import DocumentDetailModalContainer from 'containers/Modal/DocumentDetailModalContainer';
import VendorLetterDetailModalContainer from 'containers/Modal/VendorLetterDetailModalContainer';
import VendorDetailModalContainer from 'containers/Modal/VendorDetailModalContainer';
import queryString from 'query-string';

const InternalTransmittalPage = (props) => {
	const { page } = queryString.parse(props.location.search);
	const { writable } = props;

	return (
		<Page
			title="Internal Letters"
			breadcrumbs={[{ name: 'Letters', active: false }, { name: 'Internal', active: true }]}
		>
			<ScrollToTop>
				<LetterSearchFormContainer />
				<LetterToolbarContainer writable={writable}/>
				<LetterTableContainer page={parseInt(page || 1, 10)} />

				<LetterAddModalContainer />
				<LetterDetailModalContainer writable={writable} />
				<LetterEditModalContainer />
				<ReferenceSearchModalContainer />
				<DocumentDetailModalContainer />
				<VendorLetterDetailModalContainer />
				<VendorDetailModalContainer />
			</ScrollToTop>
		</Page>
	);
};

export default InternalTransmittalPage;
