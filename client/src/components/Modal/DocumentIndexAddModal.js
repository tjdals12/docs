import React from 'react';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Form,
	FormGroup,
	Col,
	Label,
	Input,
	Table
} from 'reactstrap';
import PropTypes from 'prop-types';

const DocumentIndexAddModal = ({
	gbs,
	vendorList,
	data,
	error,
	infosError,
	isOpen,
	onClose,
	onChange,
	onChangeGb,
	onExcelUpload,
	onInsert,
	className,
	...rest
}) => {
	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose}
			className={className}
			contentClassName="border-light rounded"
			{...rest}
			size="xl"
		>
			<ModalHeader toggle={onClose} className="bg-light">
				Document Index 추가
			</ModalHeader>
			<ModalBody>
				<Form onSubmit={(e) => e.preventDefault()}>
					<FormGroup row>
						<Col md={12}>
							<Label for="vendor">업체</Label>
							<Input type="select" name="vendor" onChange={onChange} invalid={error}>
								<option>--- 업체를 선택해주세요. ---</option>
								{vendorList.map((vendor) => (
									<option key={vendor.get('_id')} value={vendor.get('_id')}>
										{vendor.get('vendorName')} ({vendor.getIn(['part', 'cdSName'])},{' '}
										{vendor.get('partNumber')})
									</option>
								))}
							</Input>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label for="list" md={2}>
							문서목록
						</Label>
						<Col md={4}>
							<Button className="custom-file-uploader can-click">
								<Input
									type="file"
									name="indexes"
									onChange={(e) => {
										onExcelUpload(e.target.files[0]);
									}}
								/>
								Select a file
							</Button>
						</Col>
					</FormGroup>
					<Table bordered striped>
						<colgroup>
							<col with="5%" />
							<col width="25%" />
							<col width="40%" />
							<col width="15%" />
							<col width="15%" />
						</colgroup>
						<thead>
							<tr style={{ background: '#e7f5ff' }}>
								<th className="text-right">#</th>
								<th>Number</th>
								<th>Title</th>
								<th>Gb</th>
								<th className="text-center">Plan</th>
							</tr>
						</thead>
						<tbody>
							{data.get('list').length === 0 ? (
								<tr>
									<td colSpan={5} className="text-center text-muted font-italic">
										양식에 맞게 작성된 엑셀 파일을 선택해주세요.
									</td>
								</tr>
							) : (
									data.get('list').map((document, index) => {
										const { documentNumber, documentTitle, plan } = document.toJS();
										const isError = infosError.indexOf(index) > -1;

										return (
											<tr key={index} className={isError ? 'bg-secondary' : ''}>
												<td className="text-right">{index + 1}</td>
												<td>{documentNumber}</td>
												<td>{documentTitle}</td>
												<td>
													<Input type="select" name="documentGb" onChange={onChangeGb(index)}>
														<option value="">-- 구분 --</option>
														{gbs.get('cdMinors').map((gb) => (
															<option key={gb.get('_id')} value={gb.get('_id')}>
																{gb.get('cdSName')}
															</option>
														))}
													</Input>
												</td>
												<td className="text-center">{plan.substr(0, 10)}</td>
											</tr>
										);
									})
								)}
						</tbody>
					</Table>
				</Form>
			</ModalBody>
			<ModalFooter className="bg-light">
				<Button color="primary" onClick={onInsert}>
					ADD
				</Button>
				<Button color="secondary" onClick={onClose}>
					CANCEL
				</Button>
			</ModalFooter>
		</Modal>
	);
};

DocumentIndexAddModal.propTyps = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onChange: PropTypes.func,
	onExcelUpload: PropTypes.func,
	onInsert: PropTypes.func,
	className: PropTypes.string
};

DocumentIndexAddModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onExcelUpload: () => console.warn('Warning: onExcelUpload is not defined'),
	onInsert: () => console.warn('Warning: onInsert is not defined')
};

export default DocumentIndexAddModal;
