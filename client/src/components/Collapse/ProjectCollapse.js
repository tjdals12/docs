import React from 'react';
import classNames from 'classnames';
import { Collapse, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import PropTypes from 'prop-types';
import { TiPinOutline } from 'react-icons/ti';

const makeHeaderCell = ({ title, className }) => {
	const classes = classNames('k-link title-font', className);

	return <span className={classes}>{title}</span>;
};

const ProjectCollapse = ({
	gbs,
	data,
	detail,
	add,
	errors,
	total,
	lastPage,
	isOpen,
	onPage,
	onSelect,
	onChange,
	onSave,
	onEdit,
	onDelete,
	onMainProject
}) => {
	const isAdd = detail.size === 0;

	const rowRender = (Row, props) => {
		const isActive = props.dataItem._id === detail.get('_id');
		const isDelete = props.dataItem.deleteYn === 'YES';

		return React.cloneElement(Row, {
			className: classNames(
				isDelete && 'text-line-through text-muted font-italic',
				isActive && 'bg-gradient-theme-left text-white ',
				'can-click',
				Row.props.className
			)
		});
	};

	return (
		<Collapse isOpen={isOpen} className="mt-3 pt-4 border-top">
			<Row style={{ minHeight: '600px' }}>
				<Col xl={6} lg={12}>
					<Grid
						pageable
						data={data.toJS()}
						total={total}
						take={10}
						skip={(lastPage - 1) * 10}
						onPageChange={(e) => onPage(e.page.skip / e.page.take + 1)}
						onRowClick={(e) => onSelect(e)}
						className="h-100 border rounded"
						rowRender={rowRender}
					>
						<Column
							field="index"
							width={40}
							className="text-right"
							headerCell={() => makeHeaderCell({ title: '#', className: 'text-right' })}
						/>
						<Column
							field="projectGb.cdSName"
							width={60}
							className="text-center"
							headerCell={() => makeHeaderCell({ title: '구분', className: 'text-center' })}
						/>
						<Column
							field="projectName"
							title="프로젝트명"
							headerCell={() => makeHeaderCell({ title: '프로젝트명' })}
							cell={({ dataItem, field }) => (
								<td>{dataItem[field]} {dataItem['isMain'] && '📌'}</td>
							)}
						/>
						<Column
							field="client"
							title="발주처"
							width={100}
							className="text-nowrap"
							headerCell={() => makeHeaderCell({ title: '발주처' })}
						/>
						<Column
							field="period"
							title="계약기간"
							width={180}
							headerCell={() => makeHeaderCell({ title: '계약기간' })}
						/>
					</Grid>
				</Col>
				<Col xl={6} lg={12}>
					<Form
						className={`p-4 border rounded bg-light h-100 ${isAdd && 'border-danger'}`}
						onSubmit={(e) => {
							e.preventDefault();
						}}
					>
						<FormGroup row>
							<Col md={3}>
								<Label for="projectGb" className="title-font">
									구분
								</Label>
								<Input
									type="select"
									id="projectGb"
									name="projectGb"
									value={detail.get('projectGb') || add.get('projectGb')}
									onChange={(e) => onChange(e)(isAdd ? 'add' : 'project')}
									invalid={errors.get('projectGbError')}
								>
									<option value="">-- 구분 --</option>
									{gbs.get('cdMinors').map((gb) => (
										<option key={gb.get('_id')} value={gb.get('_id')}>
											{gb.get('cdSName')}
										</option>
									))}
								</Input>
							</Col>
							<Col md={6}>
								<Label for="projectName" className="title-font">
									프로젝트명
								</Label>
								<Input
									type="text"
									id="projectName"
									name="projectName"
									value={detail.get('projectName') || add.get('projectName')}
									onChange={(e) => onChange(e)(isAdd ? 'add' : 'project')}
									invalid={errors.get('projectNameError')}
								/>
							</Col>
							<Col md={3}>
								<Label for="projectCode" className="title-font">
									프로젝트 코드
								</Label>
								<Input
									type="text"
									id="projectCode"
									name="projectCode"
									value={detail.get('projectCode') || add.get('projectCode')}
									onChange={(e) => onChange(e)(isAdd ? 'add' : 'project')}
									invalid={errors.get('projectCodeError')}
								/>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Col md={6}>
								<Label className="title-font">
									시작일
								</Label>
								<Input
									type="date"
									name="effStaDt"
									value={
										detail.get('effStaDt') ? (
											detail.get('effStaDt').substr(0, 10)
										) : (
												add.get('effStaDt')
											)
									}
									onChange={(e) => onChange(e)(isAdd ? 'add' : 'project')}
									invalid={errors.get('effStaDtError')}
								/>
							</Col>
							<Col md={6}>
								<Label className="title-font">
									종료일
								</Label>
								<Input
									type="date"
									name="effEndDt"
									value={
										detail.get('effEndDt') ? (
											detail.get('effEndDt').substr(0, 10)
										) : (
												add.get('effEndDt')
											)
									}
									onChange={(e) => onChange(e)(isAdd ? 'add' : 'project')}
									invalid={errors.get('effEndDtError')}
								/>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Col md={6}>
								<Label for="client" className="title-font">
									발주처
								</Label>
								<Row id="client">
									<Col md={8}>
										<Input
											type="text"
											name="client"
											value={detail.get('client') || add.get('client')}
											onChange={(e) => onChange(e)(isAdd ? 'add' : 'project')}
											invalid={errors.get('clientError')}
										/>
									</Col>
									<Col md={4}>
										<Input
											type="text"
											name="clientCode"
											value={detail.get('clientCode') || add.get('clientCode')}
											onChange={(e) => onChange(e)(isAdd ? 'add' : 'project')}
											invalid={errors.get('clientCodeError')}
										/>
									</Col>
								</Row>
							</Col>

							<Col md={6}>
								<Label for="contractor" className="title-font">
									시공사
								</Label>
								<Row id="contractor">
									<Col md={8}>
										<Input
											type="text"
											name="contractor"
											value={detail.get('contractor') || add.get('contractor')}
											onChange={(e) => onChange(e)(isAdd ? 'add' : 'project')}
											invalid={errors.get('contractorError')}
										/>
									</Col>
									<Col md={4}>
										<Input
											type="text"
											name="contractorCode"
											value={detail.get('contractorCode') || add.get('contractorCode')}
											onChange={(e) => onChange(e)(isAdd ? 'add' : 'project')}
											invalid={errors.get('contractorCodeError')}
										/>
									</Col>
								</Row>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Col md={12}>
								<Label for="memo" className="title-font">
									설명
								</Label>
								<Input
									type="textarea"
									name="memo"
									style={{ height: '150px', resize: 'none' }}
									value={detail.get('memo') || add.get('memo')}
									onChange={(e) => onChange(e)(isAdd ? 'add' : 'project')}
								/>
							</Col>
						</FormGroup>
						<FormGroup row className="mt-5 mb-0">
							<Col md={12} className="d-flex justify-content-end">
								{isAdd ? (
									<Button size="lg" color="primary" onClick={onSave}>
										저장
									</Button>
								) : (
										<React.Fragment>
											{detail.get('isMain') || (
												<Button color="danger" className="mr-auto" onClick={() => onMainProject(detail.get('_id'))}>
													<TiPinOutline size={25}/>
												</Button>
											)}
											<Button size="lg" color="primary" className="mr-2" onClick={onEdit}>
												수정
											</Button>
											{
												detail.get('deleteYn') === 'YES'
													? <Button size="lg" color="success" onClick={() => onDelete(detail.get('_id'), 'NO')}>복구</Button>
													: <Button size="lg" color="danger" onClick={() => onDelete(detail.get('_id'), 'YES')}>삭제</Button>
											}
										</React.Fragment>
									)}
							</Col>
						</FormGroup>
					</Form>
				</Col>
			</Row>
		</Collapse>
	);
};

ProjectCollapse.propTypes = {
	isOpen: PropTypes.bool,
	onPage: PropTypes.func,
	onSelect: PropTypes.func,
	onChange: PropTypes.func,
	onSave: PropTypes.func,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	onMainProject: PropTypes.func
};

ProjectCollapse.defaultProps = {
	isOpen: false,
	onPage: () => console.warn('Warning: onPage is not defined'),
	onSelect: () => console.warn('Warning: onSelect is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onSave: () => console.warn('Warning: onSave is not defined'),
	onEdit: () => console.warn('Warning: onEdit is not defined'),
	onDelete: () => console.warn('Warning: onDelete is not defined'),
	onMainProject: () => console.warn('Warning: onMainProject is not defined')
}

export default ProjectCollapse;
