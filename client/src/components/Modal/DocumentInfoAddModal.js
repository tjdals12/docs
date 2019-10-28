import React from 'react';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Form,
	FormGroup,
	Label,
	Input,
	Table,
	Col,
	Button,
	ButtonGroup
} from 'reactstrap';
import { MdClose } from 'react-icons/md';
import { TiPlus, TiMinus } from 'react-icons/ti';
import PropTypes from 'prop-types';

const DocumentInfoAddModal = ({
	vendorList,
	gbs,
	infos,
	error,
	infosError,
	isOpen,
	onClose,
	onTarget,
	onChange,
	onExcelUpload,
	onAddInfoForm,
	onDeleteInfoForm,
	onAddInfo,
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
				문서 목록 > 문서 추가
			</ModalHeader>
			<ModalBody>
				<Form onSubmit={(e) => e.preventDefault()}>
					<FormGroup row>
						<Col md={12}>
							<Label for="vendor">업체</Label>
							<Input type="select" id="vendor" name="vendor" onChange={onTarget} invalid={error}>
								<option>--- 업체를 선택해주세요. ---</option>
								{vendorList.map((vendor) => (
									<option key={vendor.get('_id')} value={vendor.get('_id')}>
										{vendor.getIn(['vendor', 'vendorName'])} ({vendor.getIn(['vendor', 'part', 'cdSName'])},{' '}
										{vendor.getIn(['vendor', 'partNumber'])})
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
							<Button className="custom-file-uploader">
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
							<col width="25%" />
							<col width="35%" />
							<col width="15%" />
							<col width="15%" />
							<col with="5%" />
						</colgroup>
						<thead>
							<tr style={{ background: '#e7f5ff' }}>
								<th>문서번호</th>
								<th>문서명</th>
								<th>구분</th>
								<th>Plan</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{infos.map((info) => {
								const { index, documentNumber, documentTitle, documentGb, plan } = info.toJS();
								const isError = infosError.indexOf(index) > -1;

								return (
									<tr key={index + 1} className={isError ? 'bg-secondary' : ''}>
										<td className="text-right">
											<Input
												type="text"
												name="documentNumber"
												value={documentNumber}
												onChange={onChange(index)}
											/>
										</td>
										<td>
											<Input
												type="text"
												name="documentTitle"
												value={documentTitle}
												onChange={onChange(index)}
											/>
										</td>
										<td>
											<Input
												type="select"
												name="documentGb"
												value={documentGb}
												onChange={onChange(index)}
											>
												<option value="">-- 구분 --</option>
												{gbs.get('cdMinors').map((gb) => (
													<option key={gb.get('_id')} value={gb.get('_id')}>
														{gb.get('cdSName')}
													</option>
												))}
											</Input>
										</td>

										<td>
											<Input type="date" name="plan" value={plan} onChange={onChange(index)} />
										</td>
										<td className="text-center">
											<MdClose
												className={`can-click ${isError ? 'text-warning' : 'text-danger'}`}
												onClick={onDeleteInfoForm(index)}
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
					<ButtonGroup className="d-block text-center">
						<Button color="primary" onClick={onAddInfoForm}>
							<TiPlus />
						</Button>
						<Button color="secondary" onClick={onDeleteInfoForm(-1)}>
							<TiMinus />
						</Button>
					</ButtonGroup>
				</Form>
			</ModalBody>
			<ModalFooter className="bg-light">
				<Button color="primary" onClick={onAddInfo}>
					추가
				</Button>
				<Button color="secondary" onClick={onClose}>
					취소
				</Button>
			</ModalFooter>
		</Modal>
	);
};

DocumentInfoAddModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onTarget: PropTypes.func,
	onChange: PropTypes.func,
	onExcelUpload: PropTypes.func,
	onAddInfoForm: PropTypes.func,
	onDeleteInfoForm: PropTypes.func,
	onAddInfo: PropTypes.func,
	className: PropTypes.string
};

DocumentInfoAddModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onTarget: () => console.warn('Warning: onClose is not defined'),
	onChange: () => console.warn('Warning: onClose is not defined'),
	onExcelUpload: () => console.warn('Warning: onClose is not defined'),
	onAddInfoForm: () => console.warn('Warning: onClose is not defined'),
	onDeleteInfoForm: () => console.warn('Warning: onClose is not defined'),
	onAddInfo: () => console.warn('Warning: onClose is not defined')
};

export default DocumentInfoAddModal;
