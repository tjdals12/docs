import React from 'react';
import { Form, Input } from 'reactstrap';
import { MdSearch } from 'react-icons/md';
import bn from 'utils/bemnames';
import PropTypes from 'prop-types';

const bem = bn.create('search-form');

const SearchForm = ({ name, onChange, invalid, onSearch, className, ...rest }) => {
	const classes = bem.b(className);

	return (
		<Form
			inline
			className={classes}
			{...rest}
			onSubmit={(e) => {
				e.preventDefault();

				onSearch();
			}}
		>
			<MdSearch size={20} className={bem.e('icon-search')} />
			<Input
				type="search"
				placeholder="Search..."
				className={bem.e('input', 'w-100')}
				name={name}
				onChange={onChange}
				invalid={invalid}
			/>
		</Form>
	);
};

SearchForm.propTypes = {
	name: PropTypes.string,
	onChange: PropTypes.func,
	invalid: PropTypes.bool,
	onSearch: PropTypes.func,
	className: PropTypes.string
};

SearchForm.defaultProps = {
	name: 'keyword',
	onChange: () => console.warn('Warning: onChange is not defined'),
	onSearch: () => console.warn('Warning: onSearch is not defined'),
	invalid: false
};

export default SearchForm;
