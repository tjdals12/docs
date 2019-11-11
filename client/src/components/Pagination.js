import React from 'react';
import { Pagination as BSPagination, PaginationItem, PaginationLink } from 'reactstrap';
import PropTypes from 'prop-types';

const createPage = (currentPage, lastPage, onPage) => {
	let pageNumbers = [];
	const minPageNumber = (currentPage - 2) <= 1 ? 1 : (currentPage - (currentPage === lastPage ? 4 : currentPage === lastPage - 1 ? 3 : 2));
	const maxPageNumber = (currentPage + 2) >= lastPage ? lastPage : (currentPage + (currentPage === 1 ? 4 : currentPage === 2 ? 3 : 2));

	for (let i = currentPage - 1; i >= minPageNumber; i--) {
		pageNumbers.unshift(
			<PaginationItem key={i} active={i === currentPage}>
				<PaginationLink onClick={() => onPage(i)}>{i}</PaginationLink>
			</PaginationItem>
		);
	}

	for (let i = currentPage; i <= maxPageNumber; i++) {
		pageNumbers.push(
			<PaginationItem key={i} active={i === currentPage}>
				<PaginationLink onClick={() => onPage(i)}>{i}</PaginationLink>
			</PaginationItem>
		);
	}

	return pageNumbers;
};

const Pagination = ({ currentPage, lastPage, onPage, className, listClassName, ...rest }) => {

	return (
		<BSPagination {...rest} className={className} listClassName={listClassName}>
			<PaginationItem disabled={currentPage === 1}>
				<PaginationLink first onClick={() => onPage(1)} />
			</PaginationItem>
			<PaginationItem disabled={currentPage === 1}>
				<PaginationLink previous onClick={() => onPage(currentPage - 1)} />
			</PaginationItem>

			{createPage(currentPage, lastPage, onPage)}

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
	onPage: PropTypes.func,
	className: PropTypes.string,
	listClassName: PropTypes.string
};

Pagination.defaultProps = {
	currentPage: 1,
	lastPage: 1,
	onPage: () => console.warn('Warning: onPage is not defined')
};

export default Pagination;
