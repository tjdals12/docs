import React from 'react';
import ScrollToTop from 'components/ScrollToTop';
import Page from 'components/Page';
import IndexesSearchFormContainer from 'containers/Form/IndexesSearchFormContainer';
import IndexesOverallToolbarContainer from 'containers/Toolbar/IndexesOverallToolbarContainer';
import IndexListContainer from 'containers/List/IndexListContainer';
import DocumentIndexAddModalContainer from 'containers/Modal/DocumentIndexAddModalContainer';
import DocumentIndexEditModalContainer from 'containers/Modal/DocumentIndexEditModalContainer';
import DocumentInfoAddModalContainer from 'containers/Modal/DocumentInfoAddModalContainer';
import queryString from 'query-string';

const IndexesOverallPage = (props) => {
	const { page } = queryString.parse(props.location.search);
	const { writable } = props;

	return (
		<Page
			title="Indexes"
			breadcrumbs={[{ name: 'Indexes', active: false }, { name: 'Overall', active: true }]}
		>
			<ScrollToTop>
				<IndexesSearchFormContainer />
				<IndexesOverallToolbarContainer writable={writable}/>
				<IndexListContainer writable={writable} page={parseInt(page || 1, 10)} />
				<DocumentIndexAddModalContainer />
				<DocumentIndexEditModalContainer />
				<DocumentInfoAddModalContainer />
			</ScrollToTop>
		</Page>
	);
};

export default IndexesOverallPage;
