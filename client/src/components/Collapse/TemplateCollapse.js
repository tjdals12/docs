import React from 'react';
import classNames from 'classnames';
import { Collapse, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import QuestionModal from 'components/Modal/QuestionModal';
import PropTypes from 'prop-types';

const makeHeaderCell = ({ title, className }) => {
	const classes = classNames('k-link title-font', className);

	return <span className={classes}>{title}</span>;
};

const TemplateCollapse = ({
	gbs,
	data,
	detail,
	add,
	errors,
	total,
	lastPage,
	isOpen,
	isOpenQuestion,
	onCloseModal,
	onOpenModal,
	onSelect,
	onChange,
	onUpload,
	onSave,
	onEdit,
	onDelete
}) => {
	const isAdd = detail.size === 0;

	const rowRender = (Row, props) => {
		const isActive = props.dataItem._id === detail.get('_id');

		return React.cloneElement(Row, {
			className: classNames(isActive && 'bg-gradient-theme-left text-white ', 'can-click', Row.props.className)
		});
	};

	return (
		<Collapse isOpen={isOpen} className="mt-3 pt-4 border-top">
			<QuestionModal
				isOpen={isOpenQuestion}
				onClose={onCloseModal}
				size="md"
				header="양식 삭제"
				body={
					<div>
						<p className="m-0">선택 양식을 삭제하시겠습니까?</p>
						<p className="m-0 text-danger">(* 삭제된 데이터 복구되지 않습니다.)</p>
					</div>
				}
				footer={
					<Button color="primary" onClick={() => onDelete(detail.get('_id'))}>
						삭제
					</Button>
				}
			/>

			<Row style={{ minHeight: '520px' }}>
				<Col xl={6} lg={12}>
					<Grid
						pageable
						data={data.toJS()}
						total={total}
						take={10}
						skip={(lastPage - 1) * 10}
						className="h-100 border rounded"
						onRowClick={(e) => onSelect(e)}
						rowRender={rowRender}
					>
						<Column
							field="index"
							width={40}
							className="text-right"
							headerCell={() => makeHeaderCell({ title: '#', className: 'text-right' })}
						/>
						<Column
							field="templateGb.cdSName"
							width={80}
							className="text-center"
							headerCell={() => makeHeaderCell({ title: '구분', className: 'text-center' })}
						/>
						<Column
							field="templateName"
							className="text-nowrap"
							headerCell={() => makeHeaderCell({ title: '양식명' })}
						/>
						<Column
							field="templateType"
							width={100}
							className="text-center"
							headerCell={() => makeHeaderCell({ title: '형식', className: 'text-center' })}
						/>
					</Grid>
				</Col>

				<Col xl={6} lg={12}>
					<Form
						className={`p-4 border rounded bg-light h-100 ${isAdd && 'border-danger'}`}
						onSubmit={(e) => {
							e.stopPropagation();
						}}
					>
						<FormGroup row>
							<Col md={6}>
								<Label for="templateGb" className="title-font">구분</Label>
								<Input
									type="select"
									id="templateGb"
									name="templateGb"
									value={detail.get('templateGb') || add.get('templateGb')}
									onChange={(e) => onChange(e)(isAdd ? 'add' : 'template')}
									invalid={errors.get('templateGbError')}
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
								<Label for="templateType" className="title-font">형식</Label>
								<Input
									type="text"
									id="templateType"
									name="templateType"
									value={detail.get('templateType') || add.get('templateType')}
									invalid={errors.get('templateTypeError')}
									readOnly
								/>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Col md={12}>
								<Label for="templateName" className="title-font">양식명</Label>
								<Input
									type="text"
									id="templateName"
									name="templateName"
									value={detail.get('templateName') || add.get('templateName')}
									onChange={(e) => onChange(e)(isAdd ? 'add' : 'template')}
									invalid={errors.get('templateNameError')}
								/>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Col md={12}>
								<Label for="templateDescription" className="title-font">설명</Label>
								<Input
									type="textarea"
									id="templateDescription"
									name="templateDescription"
									style={{ resize: 'none' }}
									value={detail.get('templateDescription') || add.get('templateDescription')}
									onChange={(e) => onChange(e)(isAdd ? 'add' : 'template')}
									invalid={errors.get('templateDescriptionError')}
								/>
							</Col>
						</FormGroup>
						<FormGroup row>
							<Label for="list" md={4} className="title-font">
								양식 파일
							</Label>
							<Col md={8} className="d-flex justify-content-end">
								<Button className="custom-file-uploader can-click">
									<Input
										type="file"
										name="indexes"
										onChange={(e) => {
											onUpload(e.target.files[0], isAdd ? 'add' : 'template');
										}}
									/>
									Select a file
								</Button>
							</Col>
						</FormGroup>

						<FormGroup row>
							<Col md={12}>
								<Input
									type="text"
									name="templatePath"
									value={
										detail.get('templatePath') ? (
											detail.get('templatePath').split('/').pop()
										) : (
												add.get('templatePath').split('/').pop()
											)
									}
									readOnly
									invalid={errors.get('templatePathError')}
								/>
							</Col>
						</FormGroup>

						<FormGroup row className="mt-5 mb-0">
							{isAdd ? (
								<Col md={{ offset: 8, size: 4 }} className="d-flex justify-content-end">
									<Button color="primary" size="lg" onClick={onSave}>
										저장
									</Button>
								</Col>
							) : (
									<React.Fragment>
										<Col md={4}>
											<Button color="success" size="lg" tag="a" href={detail.get('templatePath')}>
												다운로드
											</Button>
										</Col>
										<Col md={{ offset: 4, size: 4 }} className="d-flex justify-content-end">
											<Button color="primary" size="lg" className="mr-2" onClick={onEdit}>
												수정
											</Button>
											<Button color="danger" size="lg" onClick={() => onOpenModal('question')}>
												삭제
											</Button>
										</Col>
									</React.Fragment>
								)}
						</FormGroup>
					</Form>
				</Col>
			</Row>
		</Collapse >
	);
};

TemplateCollapse.propTypes = {
	isOpen: PropTypes.bool,
	isOpenQuestion: PropTypes.bool,
	onCloseModal: PropTypes.func,
	onOpenModal: PropTypes.func,
	onSelect: PropTypes.func,
	onChange: PropTypes.func,
	onUpload: PropTypes.func,
	onSave: PropTypes.func,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	className: PropTypes.string
};

TemplateCollapse.defaultProps = {
	isOpen: false,
	isOpenQuestion: false,
	onCloseModal: () => console.warn('Warning: onCloseModal is not defined'),
	onOpenModal: () => console.warn('Warning: onOpenModal is not defined'),
	onSelect: () => console.warn('Warning: onSelect is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onUpload: () => console.warn('Warning: onUpload is not defined'),
	onSave: () => console.warn('Warning onSave is not defined'),
	onEdit: () => console.warn('Warning: onEdit is not defined'),
	onDelete: () => console.warn('Warning: onDelete: is not defined')
};

export default TemplateCollapse;
