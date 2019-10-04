import React from 'react';
import ScrollToTop from 'components/ScrollToTop';
import Page from 'components/Page';
import IndexesSearchFormContainer from 'containers/Form/IndexesSearchFormContainer';
import IndexListContainer from 'containers/List/IndexListContainer';
import DocumentIndexAddModalContainer from 'containers/Modal/DocumentIndexAddModalContainer';
import DocumentIndexEditModalContainer from 'containers/Modal/DocumentIndexEditModalContainer';
import DocumentInfoAddModalContainer from 'containers/Modal/DocumentInfoAddModalContainer';
import queryString from 'query-string';

const IndexesOverallPage = (props) => {
	const { page } = queryString.parse(props.location.search);

	return (
		<ScrollToTop>
			<Page
				title="Indexes"
				breadcrumbs={[ { name: 'Indexes', active: false }, { name: 'Overall', active: true } ]}
			>
				<IndexesSearchFormContainer />
				<IndexListContainer page={parseInt(page || 1, 10)} />
				<DocumentIndexAddModalContainer />
				<DocumentIndexEditModalContainer />
				<DocumentInfoAddModalContainer />
			</Page>
		</ScrollToTop>
	);
};

export default IndexesOverallPage;
