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
	InputGroup,
	InputGroupAddon,
	Table
} from 'reactstrap';
import { MdClose } from 'react-icons/md';
import PropTypes from 'prop-types';

const VendorLetterEditModal = ({
	vendorList,
	isOpen,
	data,
	errors,
	onClose,
	onChange,
	onSetDeleteDocument,
	onEdit,
	className,
	...rest
}) => {
	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose}
			className={className}
			contentClassName="border rounded"
			{...rest}
			size="lg"
		>
			<ModalHeader toggle={onClose}>업체 공문 수정</ModalHeader>
			<ModalBody>
				<Form>
					<FormGroup row>
						<Col md={6}>
							<Label for="vendor">업체</Label>
							<Input
								type="select"
								id="vendor"
								name="vendor"
								value={data.get('vendor')}
								onChange={onChange}
								invalid={errors.get('vendorError')}
							>
								<option value="">-- 업체 --</option>
								{vendorList.map((vendor) => (
									<option key={vendor.get('_id')} value={vendor.get('_id')}>
										{vendor.get('vendorName')} ({vendor.getIn(['part', 'cdSName'])},{' '}
										{vendor.get('partNumber')})
									</option>
								))}
							</Input>
						</Col>
						<Col md={6}>
							<Label for="officialNumber">접수번호</Label>
							<Input
								type="text"
								id="officialNumber"
								name="officialNumber"
								placeholder="ex) ABC-DEF-T-R-001-001"
								value={data.get('officialNumber')}
								onChange={onChange}
								invalid={errors.get('officialNumberError')}
							/>
						</Col>
					</FormGroup>

					<FormGroup row>
						<Col md={6}>
							<Label for="sender">발신</Label>
							<InputGroup id="sender">
								<InputGroupAddon addonType="prepend">
									<Input
										type="select"
										name="senderGb"
										value={
											data.get('senderGb') === 'CLIENT' ? (
												'01'
											) : data.get('senderGb') === 'CONTRACTOR' ? (
												'02'
											) : data.get('senderGb') === 'VENDOR' ? (
												'03'
											) : (
															data.get('senderGb')
														)
										}
										onChange={onChange}
										invalid={errors.get('senderGbError')}
									>
										<option value="">-- 구분 --</option>
										<option value="01">CLIENT</option>
										<option value="02">CONTRACTOR</option>
										<option value="03">VENDOR</option>
									</Input>
								</InputGroupAddon>
								<Input
									type="text"
									name="sender"
									className="ml-1"
									placeholder="ex) 홍길동 대리"
									value={data.get('sender')}
									onChange={onChange}
									invalid={errors.get('senderError')}
								/>
							</InputGroup>
						</Col>
						<Col md={6}>
							<Label for="receiver">수신</Label>
							<InputGroup id="receiver">
								<InputGroupAddon addonType="append">
									<Input
										type="select"
										name="receiverGb"
										value={
											data.get('receiverGb') === 'CLIENT' ? (
												'01'
											) : data.get('receiverGb') === 'CONTRACTOR' ? (
												'02'
											) : data.get('receiverGb') === 'VENDOR' ? (
												'03'
											) : (
															data.get('receiverGb')
														)
										}
										onChange={onChange}
										invalid={errors.get('receiverGbError')}
									>
										<option value="">-- 구분 --</option>
										<option value="01">CLIENT</option>
										<option value="02">CONTRACTOR</option>
										<option value="03">VENDOR</option>
									</Input>
								</InputGroupAddon>
								<Input
									type="text"
									name="receiver"
									className="ml-1"
									placeholder="ex) 이성민 사원"
									value={data.get('receiver')}
									onChange={onChange}
									invalid={errors.get('receiverError')}
								/>
							</InputGroup>
						</Col>
					</FormGroup>

					<FormGroup row className="mt-4">
						<Col md={12}>
							<Label for="receiveDocuments">접수목록</Label>
							<Table bordered striped>
								<colgroup>
									<col width="5%" />
									<col width="35%" />
									<col width="50%" />
									<col width="5%" />
									<col width="5%" />
								</colgroup>
								<thead>
									<tr style={{ background: '#e7f5ff' }}>
										<th className="text-right">#</th>
										<th>No.</th>
										<th>Title</th>
										<th className="text-center">Rev.</th>
										<th />
									</tr>
								</thead>
								<tbody>
									{data.get('documents').size === 0 ? (
										<tr>
											<td colSpan="5" className="text-center text-muted font-italic">
												접수목록이 없습니다.
											</td>
										</tr>
									) : (
											data.get('documents').map((document, index) => {
												const deleted = document.get('deleted');

												return (
													<tr key={index} className={deleted && 'bg-danger'}>
														<td className="text-right">{index + 1}</td>
														<td className={deleted && 'text-line-through'}>
															{document.get('documentNumber')}
														</td>
														<td className={deleted && 'text-line-through'}>
															{document.get('documentTitle')}
														</td>
														<td
															className={[
																'text-center',
																deleted && 'text-line-through'
															].join(' ')}
														>
															{document.get('documentRev')}
														</td>
														<td className="text-center">
															{!deleted && (
																<MdClose
																	className="can-click text-danger"
																	onClick={onSetDeleteDocument(document.get('_id'))}
																/>
															)}
														</td>
													</tr>
												);
											})
										)}
								</tbody>
							</Table>
						</Col>
					</FormGroup>

					<FormGroup row className="mt-5">
						<Col md={6}>
							<Label for="receiveDate">접수일</Label>
							<Input
								type="date"
								id="receiveDate"
								name="receiveDate"
								value={data.get('receiveDate').substr(0, 10)}
								onChange={onChange}
								invalid={errors.get('receiveDateError')}
							/>
						</Col>
						<Col md={6}>
							<Label for="targetDate">회신요청일</Label>
							<Input
								type="date"
								id="targetDate"
								name="targetDate"
								value={data.get('targetDate').substr(0, 10)}
								onChange={onChange}
								invalid={errors.get('targetDateError')}
							/>
						</Col>
					</FormGroup>
				</Form>
			</ModalBody>
			<ModalFooter>
				<Button color="primary" onClick={onEdit}>
					수정
				</Button>
				<Button color="secondary" onClick={onClose}>
					취소
				</Button>
			</ModalFooter>
		</Modal>
	);
};

VendorLetterEditModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onChange: PropTypes.func,
	onSetDeleteDocument: PropTypes.func,
	onEdit: PropTypes.func,
	className: PropTypes.string
};

VendorLetterEditModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defiend'),
	onChange: () => console.warn('Warning: onChange is not defiend'),
	onSetDeleteDocument: () => console.warn('Warning: onSetDeleteDocument is not defiend'),
	onEdit: () => console.warn('Warning: onEdit is not defiend')
};

export default VendorLetterEditModal;
