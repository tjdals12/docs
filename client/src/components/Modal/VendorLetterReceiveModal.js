import React from 'react';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Form,
	FormGroup,
	Label,
	Col,
	Input,
	InputGroup,
	InputGroupAddon,
	Table
} from 'reactstrap';
import { MdClose } from 'react-icons/md';
import Typography from 'components/Typography';
import PropTypes from 'prop-types';

const VendorLetterReceiveModal = ({
	vendorList,
	isOpen,
	data,
	errors,
	onClose,
	onChange,
	onReadDirectory,
	onDeleteReceiveDocument,
	onReceive,
	className,
	...rest
}) => {
	const { receiveDocumentsErrorList } = errors.toJS();

	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose}
			className={className}
			contentClassName="border rounded"
			{...rest}
			size="lg"
		>
			<ModalHeader toggle={onClose} className="bg-light">
				업체 공문 접수
			</ModalHeader>
			<ModalBody>
				<Form>
					<FormGroup row>
						<Col md={6}>
							<Label for="vendor">업체</Label>
							<Input
								type="select"
								id="vendor"
								name="vendor"
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
									onChange={onChange}
									invalid={errors.get('receiverError')}
								/>
							</InputGroup>
						</Col>
					</FormGroup>

					<FormGroup row className="mt-4">
						<Label for="receiveDocuments" md={2}>
							접수목록
						</Label>
						<Col md={4}>
							<Button className="custom-file-uploader can-click">
								<Input
									type="file"
									name="receiveDocuments"
									webkitdirectory=""
									directory=""
									onChange={onReadDirectory}
									value=""
								/>
								Select
							</Button>
						</Col>
					</FormGroup>
					<Table bordered striped className={errors.get('receiveDocumentsError') ? 'bg-secondary' : ''}>
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
							{data.get('receiveDocuments').size === 0 ? (
								<tr>
									<td colSpan="5" className="text-center text-muted font-italic">
										폴더를 선택해주세요. 선택한 폴더 내의 파일을 기준으로 접수목록을 작성합니다.
									</td>
								</tr>
							) : (
									data.get('receiveDocuments').map((document, index) => {
										const { id, documentNumber, documentTitle, documentRev } = document.toJS();
										const isError = receiveDocumentsErrorList.indexOf(documentNumber) > -1;

										return (
											<tr key={index} className={isError ? 'bg-secondary' : ''}>
												<td className="text-right">{index + 1}</td>
												<td>{documentNumber}</td>
												<td>{documentTitle}</td>
												<td className="text-center">{documentRev}</td>
												<td className="text-center">
													<MdClose
														className={
															isError ? 'can-click text-warning' : 'can-click text-danger'
														}
														onClick={onDeleteReceiveDocument(id)}
													/>
												</td>
											</tr>
										);
									})
								)}
						</tbody>
					</Table>

					{receiveDocumentsErrorList.length > 0 && (
						<Typography type="leaf" className="text-danger">
							* 작성된 Index에 존재하지 않는 문서가 있습니다. 해당 문서는 접수할 수 없습니다.
						</Typography>
					)}

					<FormGroup row className="mt-5">
						<Col md={6}>
							<Label for="receiveDate">접수일</Label>
							<Input
								type="date"
								id="receiveDate"
								name="receiveDate"
								value={data.get('receiveDate')}
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
								value={data.get('targetDate')}
								onChange={onChange}
								invalid={errors.get('targetDateError')}
							/>
						</Col>
					</FormGroup>
				</Form>
			</ModalBody>
			<ModalFooter className="bg-light">
				<Button color="primary" onClick={onReceive}>
					접수
				</Button>
				<Button color="secondary" onClick={onClose}>
					취소
				</Button>
			</ModalFooter>
		</Modal>
	);
};

VendorLetterReceiveModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onChange: PropTypes.func,
	onReadDirectory: PropTypes.func,
	onDeleteReceiveDocument: PropTypes.func,
	onReceive: PropTypes.func,
	className: PropTypes.string
};

VendorLetterReceiveModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onReadDirectory: () => console.warn('Warning: onReadDirectory is not defined'),
	onDeleteReceiveDocument: () => console.warn('Warning: onDeleteReceiveDocument is not defined'),
	onReceive: () => console.warn('Warning: onReceive is not defined')
};

export default VendorLetterReceiveModal;
