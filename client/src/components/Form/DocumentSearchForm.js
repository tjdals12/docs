import React from 'react';
import classNames from 'classnames';
import { Col, Form, FormGroup, InputGroup, InputGroupAddon, Input, Label, Button } from 'reactstrap';
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
				<Label md={1} for="documentGb" className="text-right">
					Gb
				</Label>
				<Col md={2}>
					<Input type="select" name="documentGb" id="documentGb" onChange={onChange}>
						<option value="">-- Gb --</option>
						{gb.get('cdMinors').map((code, index) => (
							<option key={index} value={code.get('_id')}>
								{code.get('cdSName')}
							</option>
						))}
					</Input>
				</Col>
				<Label md={1} for="documentNumber" className="text-right">
					문서번호
				</Label>
				<Col md={2}>
					<Input
						type="text"
						name="documentNumber"
						id="documentNumber"
						onChange={onChange}
						value={search.get('documentNumber')}
					/>
				</Col>
				<Label md={1} for="documentTitle" className="text-right">
					문서명
				</Label>
				<Col md={2}>
					<Input
						type="text"
						name="documentTitle"
						id="documentTitle"
						value={search.get('documentTitle')}
						onChange={onChange}
					/>
				</Col>
				<Label md={1} for="documentRev" className="text-right">
					Revision
				</Label>
				<Col md={2}>
					<InputGroup>
						<InputGroupAddon addonType="prepend">Rev.</InputGroupAddon>
						<Input
							type="text"
							name="documentRev"
							id="documentRev"
							onChange={onChange}
							value={search.get('documentRev')}
						/>
					</InputGroup>
				</Col>
			</FormGroup>

			<FormGroup row>
				<Label md={1} for="documentStatus" className="text-right">
					현재 상태
				</Label>
				<Col md={2}>
					<Input
						type="select"
						name="documentStatus"
						id="documentStatus"
						defaultValue={search.get('documentStatus')}
						onChange={onChange}
					>
						<option value="">-- Status --</option>
						{status.get('cdMinors').map((code, index) => {
							let name = code.get('cdSName');
							let value = code.getIn(['cdRef1', 'status']);

							return (
								<option key={index} value={value}>
									{name}
								</option>
							);
						})}
					</Input>
				</Col>
				<Label md={1} for="holdYn" className="text-right">
					보류 여부
				</Label>
				<Col md={2}>
					<Input
						type="select"
						name="holdYn"
						id="holdYn"
						defaultValue={search.get('holdYn')}
						onChange={onChange}
					>
						<option value="">-- Y/N --</option>
						<option value="YES">YES</option>
						<option value="NO">NO</option>
					</Input>
				</Col>
				<Label md={1} for="regDt" className="text-right">
					접수일
				</Label>
				<Col md={4}>
					<InputGroup id="regDt">
						<InputGroupAddon addonType="prepend">
							<Input type="date" name="regDtSta" value={search.get('regDtSta')} onChange={onChange} />
						</InputGroupAddon>
						<Input defaultValue="~" className="bg-light text-center" />
						<InputGroupAddon addonType="append">
							<Input type="date" name="regDtEnd" value={search.get('regDtEnd')} onChange={onChange} />
						</InputGroupAddon>
					</InputGroup>
				</Col>
				<Col md={1}>
					<Button color="dark" className="w-100" onClick={onFullPeriod}>
						전체기간
					</Button>
				</Col>
			</FormGroup>
			<FormGroup row className="mb-0">
				<Label md={1} for="deleteYn" className="text-right">
					삭제 여부
				</Label>
				<Col md={2}>
					<Input
						type="select"
						name="deleteYn"
						id="deleteYn"
						defaultValue={search.get('deleteYn')}
						onChange={onChange}
					>
						<option value="">-- Y/N --</option>
						<option value="YES">YES</option>
						<option value="NO">NO</option>
					</Input>
				</Col>
				<Label md={1} for="delayGb" className="text-right">
					지연 여부
				</Label>
				<Col md={2}>
					<Input
						type="select"
						name="delayGb"
						id="delayGb"
						defaultValue={search.get('delayGb')}
						onChange={onChange}
					>
						<option value="">-- Delay --</option>
						<option value="01">여유</option>
						<option value="02">임박</option>
						<option value="03">당일</option>
						<option value="04">지연</option>
					</Input>
				</Col>
				<Label md={1} for="level" className="text-right">
					중요도
				</Label>
				<Col md={2}>
					<Input type="select" name="level" id="level" value={search.get('level')} onChange={onChange}>
						<option value="">-- Level --</option>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
					</Input>
				</Col>

				<Col md={3}>
					<Button className="w-100" color="primary">
						SEARCH
					</Button>
				</Col>
			</FormGroup>
		</Form>
	);
};

DocumentSearchForm.propTypes = {
	onChange: PropTypes.func,
	onSearch: PropTypes.func,
	onFullPeriod: PropTypes.func
};

DocumentSearchForm.defaultProps = {
	onChange: () => console.warn('Warning: onChange is not defined'),
	onSearch: () => console.warn('Warning: onSearch is not defined'),
	onFullPeriod: () => console.warn('Waring: onFullPeriod is not defined')
};

export default DocumentSearchForm;
