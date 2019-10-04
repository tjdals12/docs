import React from 'react';
import classNames from 'classnames';
import { Card, CardHeader, CardBody, Button } from 'reactstrap';
import DocumentInfoDetailTableContainer from 'containers/Table/DocumentInfoDetailTableContainer';
import Pagination from 'components/Pagination';
import Typography from 'components/Typography';
import PropTypes from 'prop-types';

const heightMap = {
	sm: {
		minHeight: '200px',
		maxHeight: '400px'
	},
	md: {
		minHeight: '200px',
		maxHeight: '600px'
	},
	lg: {
		minHeight: '200px',
		maxHeight: '800px'
	}
};

const DocumentInfoCard = ({ data, currentPage, lastPage, height, onPage, onOpenLatest, className, ...rest }) => {
	const classes = classNames('w-100 h-100', className);

	return (
		<Card className={classes} {...rest}>
			<CardHeader className="d-flex align-items-center">
				<Typography tag="span" className="title-font">
					Document Info
				</Typography>
				<Button color="primary" className="ml-auto" onClick={onOpenLatest}>
					Latest
				</Button>
			</CardHeader>
			<CardBody className="p-2" style={{ ...heightMap[height], overflow: 'scroll' }}>
				{data.size === 0 ? (
					<Typography type="h5" className="text-center font-italic mt-2">
						데이터가 없습니다.
					</Typography>
				) : (
					<DocumentInfoDetailTableContainer data={data} />
				)}
				<Pagination
					currentPage={currentPage}
					lastPage={lastPage}
					onPage={onPage}
					size="md"
					aria-label="Page navigation"
					listClassName="flex-row justify-content-end ml-auto"
				/>
			</CardBody>
		</Card>
	);
};

DocumentInfoCard.propTypes = {
	currentPage: PropTypes.number,
	lastPage: PropTypes.number,
	height: PropTypes.string,
	className: PropTypes.string
};

DocumentInfoCard.defaultProps = {
	currentPage: 1,
	lastPage: 1,
	height: 'lg',
	onPage: () => console.warn('Warning: onPage is not defined')
};

export default DocumentInfoCard;
