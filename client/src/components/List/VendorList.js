import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import VendorCard from 'components/Card/VendorCard';
import Pagination from 'components/Pagination';

const VendorList = ({ writable, page, lastPage, data, onPage, onOpenAdd, onOpenPersonAdd, onOpenDetail }) => {
	return (
		<React.Fragment>
			{
				writable && <Row className="hidden-md hidden-sm hidden-xs">
					<Col md={4}>
						<Button color="primary" className="mr-2" onClick={onOpenAdd}>
							생성
					</Button>
						<Button color="secondary" onClick={onOpenPersonAdd}>
							구성원 추가
					</Button>
					</Col>
				</Row>
			}
			<Row className="mt-2">
				{data.map((vendor, index) => (
					<Col xs={12} md={6} lg={3} className="mb-4" key={index}>
						<VendorCard vendor={vendor} onOpen={onOpenDetail(vendor.get('_id'))} />
					</Col>
				))}
			</Row>
			<Pagination
				currentPage={page}
				lastPage={lastPage}
				onPage={onPage}
				size="md"
				aria-label="Page navigation"
				listClassName="flex-row justify-content-end ml-auto"
			/>
		</React.Fragment>
	);
};

VendorList.propTypes = {
	page: PropTypes.number,
	lastPage: PropTypes.number,
	onPage: PropTypes.func,
	onOpenAdd: PropTypes.func,
	onOpenPersonAdd: PropTypes.func,
	onOpenDetail: PropTypes.func
};

VendorList.defaultProps = {
	page: 1,
	lastPage: 1,
	onPage: () => console.warn('Warning: onPage is not defined'),
	onOpenAdd: () => console.warn('Warning: onOpenAdd is not defined'),
	onOpenPersonAdd: () => console.warn('Warning: onOpenPersonAdd is not defined'),
	onOpenDetail: () => console.warn('Warning: onOpenDetail is not defined')
};

export default VendorList;
