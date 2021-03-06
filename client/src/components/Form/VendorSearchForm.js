import React from 'react';
import classNames from 'classnames';
import { Form, FormGroup, Col, Input, InputGroup, InputGroupAddon, Button } from 'reactstrap';
import LabelInput from './LabelInput';
import PropTypes from 'prop-types';

const VendorSearchForm = ({ projectList, managerList, parts, search, onChange, onSearch, onFullPeriod, className, ...rest }) => {
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
				<LabelInput name="project" label="프로젝트">
					<Input type='select' name='project' value={search.get('project')} onChange={onChange}>
						<option value=''>-- 프로젝트 --</option>
						{projectList.map((project) => (
							<option key={project.get('_id')} value={project.get('_id')}>[{project.get('projectCode')}] {project.get('projectName')}</option>
						))}
					</Input>
				</LabelInput>

				<LabelInput name="manager" label="담당자">
					<Input type='select' name='manager' value={search.get('manager')} onChange={onChange}>
						<option value=''>-- 담당자 --</option>
						{managerList.map(team => {
							const { teamName, managers } = team.toJS();

							return (managers.map((manager) => (
								<option key={manager._id} value={manager._id}>[{teamName}] {manager.name} {manager.position}</option>
							)))
						})}
					</Input>
				</LabelInput>

				<LabelInput name="vendorGb" label="Gb">
					<Input type="select" name="vendorGb" value={search.get('vendorGb')} onChange={onChange}>
						<option value="">-- Gb --</option>
						<option value="01">계약 업체</option>
						<option value="02">관리 업체</option>
					</Input>
				</LabelInput>

				<LabelInput name="countryCd" label="국가">
					<Input type="select" name="countryCd" value={search.get('countryCd')} onChange={onChange}>
						<option value="">-- 국가 --</option>
						<option value="01">국내</option>
						<option value="02">해외</option>
					</Input>
				</LabelInput> 
			</FormGroup>

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
						value={search.get('partNumber')}
						placeholder="ex) R-001"
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
				<LabelInput name="regDt" label="계약기간" size={4}>
				<InputGroup id="regDt">
						<InputGroupAddon addonType="prepend">
							<Input type="date" name="effStaDt" value={search.get('effStaDt')} onChange={onChange} />
						</InputGroupAddon>
						<Input defaultValue="~" className="bg-light text-center" />
						<InputGroupAddon addonType="append">
							<Input type="date" name="effEndDt" value={search.get('effEndDt')} onChange={onChange} />
						</InputGroupAddon>
					</InputGroup>
				</LabelInput>

				<Col md={1}>
					<Button color="dark" className="w-100" onClick={onFullPeriod}>
						전체기간
					</Button>
				</Col>
				<Col md={{ size: 3, offset: 3 }}>
					<Button type="submit" color="primary" className="w-100" onClick={onSearch}>
						SEARCH
					</Button>
				</Col>
			</FormGroup>
		</Form>
	);
};

VendorSearchForm.propTypes = {
	onChange: PropTypes.func,
	onSearch: PropTypes.func
};

VendorSearchForm.defaultProps = {
	onChange: () => console.warn('Warning: onChange is not defined'),
	onSearch: () => console.warn('Warning: onSearch is not defined')
};

export default VendorSearchForm;
