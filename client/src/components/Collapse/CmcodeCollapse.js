import React from 'react';
import classNames from 'classnames';
import { Collapse, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import PropTypes from 'prop-types';

const makeHeaderCell = ({ title, className }) => {
	const classes = classNames('k-link title-font', className);

	return <span className={classes}>{title}</span>;
};

const CmcodeCollapse = ({
	cdMajors,
	cdMajor,
	cdMinor,
	add,
	errors,
	majorCount,
	majorPage,
	minorCount,
	minorPage,
	isOpen,
	onPageMajor,
	onSelectCdMajor,
	onSelectCdMinor,
	onChange,
	onSave,
	onEdit,
	onDelete,
	onRecovery
}) => {
	const isAdd = cdMinor.size === 0;

	const majorRowRender = (Row, props) => {
		const isActive = props.dataItem._id === cdMajor.get('_id');

		return React.cloneElement(Row, {
			className: classNames(isActive && 'bg-gradient-theme-left text-white ', 'can-click', Row.props.className)
		});
	};

	const minorRowRender = (Row, props) => {
		const isActive = props.dataItem._id === cdMinor.get('_id');
		const isDelete = props.dataItem.effEndDt.substr(0, 10) !== '9999-12-31';

		return React.cloneElement(Row, {
			className: classNames(isDelete && 'text-line-through text-muted font-italic', isActive && 'bg-gradient-theme-left text-white ', 'can-click', Row.props.className)
		});
	};

	return (
		<Collapse isOpen={isOpen} className="mt-3 pt-4 border-top">
			<Row style={{ minHeight: '400px' }}>
				<Col xl={5} lg={12}>
					<Grid
						pageable
						data={cdMajors.toJS()}
						total={majorCount}
						take={8}
						skip={(majorPage - 1) * 8}
						onRowClick={(e) => onSelectCdMajor(e.dataItem._id, 1)}
						onPageChange={(e) => onPageMajor(e.page.skip / e.page.take + 1)}
						rowRender={majorRowRender}
						className="h-100 border rounded"
					>
						<Column
							field="index"
							width={60}
							className="text-right"
							headerCell={() => makeHeaderCell({ title: '#', className: 'text-right' })}
						/>
						<Column
							field="cdMajor"
							width={80}
							className="text-center"
							headerCell={() => makeHeaderCell({ title: '코드', className: 'text-center' })}
						/>
						<Column field="cdFName" headerCell={() => makeHeaderCell({ title: '코드명' })} />
						<Column
							field="effStaDt"
							width={120}
							className="text-center"
							headerCell={() => makeHeaderCell({ title: '이력시작일', className: 'text-center' })}
						/>
						<Column
							field="effEndDt"
							width={120}
							className="text-center"
							headerCell={() => makeHeaderCell({ title: '이력종료일', className: 'text-center' })}
						/>
					</Grid>
				</Col>

				<Col xl={4} lg={7}>
					<Grid
						pageable
						data={cdMajor.size === 0 ? [] : cdMajor.get('cdMinors').toJS()}
						total={minorCount}
						take={8}
						skip={(minorPage - 1) * 8}
						onRowClick={(e) => onSelectCdMinor(e.dataItem._id)}
						onPageChange={(e) => onSelectCdMajor(cdMajor.get('_id'), e.page.skip / e.page.take + 1)}
						rowRender={minorRowRender}
						className="h-100 border rounded"
					>
						<Column
							field="index"
							width={60}
							className="text-right"
							headerCell={() => makeHeaderCell({ title: '#', className: 'text-right' })}
						/>
						<Column
							field="cdMinor"
							width={80}
							className="text-center"
							headerCell={() => makeHeaderCell({ title: '코드', className: 'text-center' })}
						/>
						<Column field="cdSName" headerCell={() => makeHeaderCell({ title: '코드명' })} />
						<Column
							field="timestamp.regDt"
							width={120}
							className="text-center"
							headerCell={() => makeHeaderCell({ title: '등록일', className: 'text-center' })}
						/>
					</Grid>
				</Col>

				<Col xl={3} lg={5}>
					<Form
						className="p-4 border rounded bg-light h-100"
						onSubmit={(e) => {
							e.preventDefault();
						}}
					>
						<FormGroup row>
							<Label md={4} for="cdMinor" className="text-right title-font">
								코드
							</Label>
							<Col md={8}>
								<Input
									type="text"
									id="cdMinor"
									name="cdMinor"
									value={isAdd ? add.get('cdMinor') : cdMinor.get('cdMinor')}
									onChange={(e) => onChange(e)(isAdd ? 'add' : 'cdMinor')}
									invalid={errors.get('cdMinorError')}
								/>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label md={4} for="cdSName" className="text-right title-font">
								코드명
							</Label>
							<Col md={8}>
								<Input
									type="text"
									id="cdSName"
									name="cdSName"
									value={isAdd ? add.get('cdSName') : cdMinor.get('cdSName')}
									onChange={(e) => onChange(e)(isAdd ? 'add' : 'cdMinor')}
									invalid={errors.get('cdSNameError')}
								/>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Col className="d-flex align-items-center justify-content-end">
								{isAdd ? (
									<Button
										color="primary"
										onClick={() => onSave(cdMajor.get('_id'))}
										disabled={cdMajor.size === 0 ? true : false}
									>
										저장
									</Button>
								) : (
										<React.Fragment>
											<Button color="primary" className="mr-2" onClick={() => onEdit(cdMajor.get('_id'))}>
												수정
											</Button>

											{
												cdMinor.get('effEndDt').substr(0, 10) === '9999-12-31'
													? <Button color="danger" onClick={() => onDelete(cdMajor.get('_id'))}>삭제</Button>
													: <Button color="success" onClick={() => onRecovery(cdMajor.get('_id'))}>복구</Button>
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

CmcodeCollapse.propTypes = {
	isOpen: PropTypes.bool,
	onPageMajor: PropTypes.func,
	onSelectCdMajor: PropTypes.func,
	onSelectCdMinor: PropTypes.func,
	onChange: PropTypes.func,
	onSave: PropTypes.func,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	onRecovery: PropTypes.func
};

CmcodeCollapse.defaultProps = {
	isOpen: false,
	onPageMajor: () => console.warn('Warning: onPageMajor is not defined'),
	onSelectCdMajor: () => console.warn('Warning: onSelectCdMajor is not defined'),
	onSelectCdMinor: () => console.warn('Warning: onSelectCdMinor is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onSave: () => console.warn('Warning: onSave is not defined'),
	onEdit: () => console.warn('Warning: onEdit is not defined'),
	onDelete: () => console.warn('Warning: onDelete is not defined'),
	onRecovery: () => console.warn('Warning: onRecovery is not defined'),
};

export default CmcodeCollapse;
