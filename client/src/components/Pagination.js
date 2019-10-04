import React from 'react';
import { Pagination as BSPagination, PaginationItem, PaginationLink } from 'reactstrap';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, lastPage, onPage, className, listClassName, ...rest }) => {
	const createPage = (currentPage, lastPage) => {
		let pageNumbers = [];

		for (let i = 1; i <= lastPage; i++) {
			pageNumbers.push(
				<PaginationItem key={i} active={i === currentPage}>
					<PaginationLink onClick={() => onPage(i)}>{i}</PaginationLink>
				</PaginationItem>
			);
		}

		return pageNumbers;
	};

	return (
		<BSPagination {...rest} className={className} listClassName={listClassName}>
			<PaginationItem disabled={currentPage === 1}>
				<PaginationLink first onClick={() => onPage(1)} />
			</PaginationItem>
			<PaginationItem disabled={currentPage === 1}>
				<PaginationLink previous onClick={() => onPage(currentPage - 1)} />
			</PaginationItem>

			{createPage(currentPage, lastPage)}

			<PaginationItem disabled={currentPage === lastPage}>
				<PaginationLink next onClick={() => onPage(currentPage + 1)} />
			</PaginationItem>
			<PaginationItem disabled={currentPage === lastPage}>
				<PaginationLink last onClick={() => onPage(lastPage)} />
			</PaginationItem>
		</BSPagination>
	);
};

Pagination.propTypes = {
	currentPage: PropTypes.number,
	lastPage: PropTypes.number,
	className: PropTypes.string,
	listClassName: PropTypes.string
};

Pagination.defaultProps = {
	currentPage: 1,
	lastPage: 1
};

export default Pagination;
