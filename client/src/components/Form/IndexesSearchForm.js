import React from 'react';
import classNames from 'classnames';
import { Form, FormGroup, Col, Input, Button } from 'reactstrap';
import LabelInput from './LabelInput';
import PropTypes from 'prop-types';

const IndexesSearchForm = ({ parts, search, onChange, onSearch, className, ...rest }) => {
	const classes = classNames('bg-white mb-3 px-2 py-2 border rounded hidden-md hidden-sm hidden-xs', className);

	return (
		<Form
			className={classes}
			{...rest}
			onSubmit={(e) => {
				e.preventDefault();

				onSearch();
			}}
		>
			<FormGroup row>
				<LabelInput name="part" label="공종명">
					<Input type="select" name="part" value={search.get('part')} onChange={onChange}>
						<option value="">-- 공종 --</option>
						{parts.get('cdMinors').map((code) => (
							<option key={code.get('_id')} value={code.get('_id')}>
								{code.get('cdSName')}
							</option>
						))}
					</Input>
				</LabelInput>
				
				<LabelInput name="partNumber" label="공종번호">
					<Input
						type="text"
						name="partNumber"
						placeholder="ex) R-001"
						value={search.get('partNumber')}
						onChange={onChange}
					/>
				</LabelInput>

				<LabelInput name="vendorName" label="업체명">
					<Input
						type="text"
						name="vendorName"
						placeholder="ex) 한화건설"
						value={search.get('vendorName')}
						onChange={onChange}
					/>
				</LabelInput>

				<LabelInput name="officialName" label="관리번호">
					<Input
						type="text"
						name="officialName"
						placeholder="ex) MCU"
						value={search.get('officialName')}
						onChange={onChange}
					/>
				</LabelInput>
			</FormGroup>
			<FormGroup row className="mb-0">
				<Col md={{ size: 3, offset: 9 }}>
					<Button type="submit" color="primary" className="w-100">
						SEARCH
					</Button>
				</Col>
			</FormGroup>
		</Form>
	);
};

IndexesSearchForm.propTypes = {
	onChange: PropTypes.func,
	onSearch: PropTypes.func,
	className: PropTypes.string
};

IndexesSearchForm.defaultProps = {
	onChange: () => console.warn('Warning: onChange is not defined'),
	onSearch: () => console.warn('Warning: onSearch is not defined')
};

export default IndexesSearchForm;
