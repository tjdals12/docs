import React from 'react';
import classNames from 'classnames';
import { Col, Form, FormGroup, InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
import LabelInput from './LabelInput';
import PropTypes from 'prop-types';

const DocumentSearchForm = ({ gb, status, search, onChange, onSearch, onFullPeriod, className, ...rest }) => {
	const classes = classNames(
		'bg-white mb-3 px-2 py-2 border rounded hidden-lg hidden-md hidden-sm hidden-xs',
		className
	);

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
				<LabelInput name="documentGb" label="Gb">
					<Input type="select" name="documentGb" id="documentGb" onChange={onChange}>
						<option value="">-- Gb --</option>
						{gb.map((code) => (<option key={code._id} value={code._id}>{code.cdSName}</option>))}
					</Input>
				</LabelInput>

				<LabelInput name="documentNumber" label="문서번호">
					<Input
						type="text"
						name="documentNumber"
						id="documentNumber"
						onChange={onChange}
						value={search.documentNumber}
					/>
				</LabelInput>

				<LabelInput name="documentTitle" label="문서명">
					<Input
						type="text"
						name="documentTitle"
						id="documentTitle"
						value={search.documentTitle}
						onChange={onChange}
					/>
				</LabelInput>
			
				<LabelInput name="documentRev" label="Revision">
					<InputGroup>
						<InputGroupAddon addonType="prepend">Rev.</InputGroupAddon>
						<Input
							type="text"
							name="documentRev"
							id="documentRev"
							onChange={onChange}
							value={search.documentRev}
						/>
					</InputGroup>
				</LabelInput>
			</FormGroup>

			<FormGroup row>
				<LabelInput name="documentStatus" label="현재 상태">
					<Input
						type="select"
						name="documentStatus"
						id="documentStatus"
						defaultValue={search.documentStatus}
						onChange={onChange}
					>
						<option value="">-- Status --</option>
						{status.map((code) => (<option key={code._id} value={code.cdRef1.status}>{code.cdSName}</option>))}
					</Input>
				</LabelInput>

				<LabelInput name="holdYn" label="보류 여부">
					<Input
						type="select"
						name="holdYn"
						id="holdYn"
						defaultValue={search.holdYn}
						onChange={onChange}
					>
						<option value="">-- Y/N --</option>
						{["YES", "NO"].map((value) => <option key={value} value={value}>{value}</option>)}
					</Input>
				</LabelInput>

				<LabelInput name="regDt" label="접수일" size={4}>
					<InputGroup id="regDt">
						<InputGroupAddon addonType="prepend">
							<Input type="date" name="regDtSta" value={search.regDtSta} onChange={onChange} />
						</InputGroupAddon>
						<Input defaultValue="~" className="bg-light text-center" />
						<InputGroupAddon addonType="append">
							<Input type="date" name="regDtEnd" value={search.regDtEnd} onChange={onChange} />
						</InputGroupAddon>
					</InputGroup>
				</LabelInput>
				<Col md={1}>
					<Button color="dark" className="w-100" onClick={onFullPeriod}>
						전체기간
					</Button>
				</Col>
			</FormGroup>
			
			<FormGroup row className="mb-0">
				<LabelInput name="deleteYn" label="삭제 여부">
					<Input
						type="select"
						name="deleteYn"
						id="deleteYn"
						defaultValue={search.deleteYn}
						onChange={onChange}
					>
						<option value="">-- Y/N --</option>
						{["YES", "NO"].map((value) => <option key={value} value={value}>{value}</option>)}
					</Input>
				</LabelInput>

				<LabelInput name="level" label="중요도">
					<Input type="select" name="level" id="level" value={search.level} onChange={onChange}>
						<option value="">-- Level --</option>
						{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
					</Input>
				</LabelInput>

				<Col md={{ offset: 3, size: 3 }}>
					<Button className="w-100" color="primary">
						SEARCH
					</Button>
				</Col>
			</FormGroup>
		</Form>
	);
};

DocumentSearchForm.propTypes = {
	gb: PropTypes.array.isRequired,
	status: PropTypes.array.isRequired,
	search: PropTypes.object.isRequired,
	className: PropTypes.string,
	onChange: PropTypes.func,
	onSearch: PropTypes.func,
	onFullPeriod: PropTypes.func
};

DocumentSearchForm.defaultProps = {
	className: '',
	onChange: () => console.warn('Warning: onChange is not defined'),
	onSearch: () => console.warn('Warning: onSearch is not defined'),
	onFullPeriod: () => console.warn('Waring: onFullPeriod is not defined')
};

export default DocumentSearchForm;
