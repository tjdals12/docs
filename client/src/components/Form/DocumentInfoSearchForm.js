import React from 'react';
import classNames from 'classnames';
import { Form, FormGroup, Col, Input, Button } from 'reactstrap';
import LabelInput from './LabelInput';
import PropTypes from 'prop-types';

const DocumentInfoSearchForm = ({ vendors, gbs, search, onChange, onSearch, className, ...rest }) => {
	const classes = classNames('bg-white mb-3 px-2 py-2 border rounded hidden-md hidden-sm hidden-xs', className);

	return (
		<Form
			className={classes}
			onSubmit={(e) => {
				e.preventDefault();

				onSearch();
			}}
			{...rest}
		>
			<FormGroup row>
				<LabelInput name="vendor" label="업체">
					<Input
						type="select"
						id="vendor"
						name="vendor"
						placeholder="ex) 한화건설"
						value={search.get('vendor')}
						onChange={onChange}
					>
						<option value="">-- 업체 --</option>
						{vendors.map((vendor) => (
							<option key={vendor.get('_id')} value={vendor.get('_id')}>
								{vendor.get('vendorName')} ({vendor.getIn([ 'part', 'cdSName' ])},{' '}
								{vendor.get('partNumber')})
							</option>
						))}
					</Input>
				</LabelInput>

				<LabelInput name="documentNumber" label="문서번호">
					<Input
						type="text"
						id="documentNumber"
						name="documentNumber"
						value={search.get('documentNumber')}
						onChange={onChange}
					/>
				</LabelInput>

				<LabelInput name="documentTitle" label="문서명">
					<Input
						type="text"
						id="documentTitle"
						name="documentTitle"
						value={search.get('documentTitle')}
						onChange={onChange}
					/>
				</LabelInput>

				<LabelInput name="documentGb" label="문서 구분">
					<Input
						type="select"
						id="documentGb"
						name="documentGb"
						value={search.get('documentGb')}
						onChange={onChange}
					>
						<option value="">-- 구분 --</option>
						{gbs.get('cdMinors').map((gb) => (
							<option key={gb.get('_id')} value={gb.get('_id')}>
								{gb.get('cdSName')}
							</option>
						))}
					</Input>
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

DocumentInfoSearchForm.propTypes = {
	onChange: PropTypes.func,
	onSearch: PropTypes.func,
	className: PropTypes.string
};

DocumentInfoSearchForm.defaultProps = {
	onChange: () => console.warn('Warning: onChange is not defined'),
	onSearch: () => console.warn('Warning: onSearch is not defined')
};

export default DocumentInfoSearchForm;
