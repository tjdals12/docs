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
	Input,
	Col,
	Table
} from 'reactstrap';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import Typography from 'components/Typography';

const VendorLetterAdditionalReceiveModal = ({
	vendorList,
	transmittalsByVendor,
	data,
	errors,
	isOpen,
	onClose,
	onChange,
	onReadDirectory,
	onDeleteReceiveDocument,
	onAdditionalReceive,
	className,
	...rest
}) => {
	const { receiveDocumentsErrorList } = errors.toJS();

	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose}
			className={className}
			contentClassName="border-light rounded"
			{...rest}
			size="lg"
		>
			<ModalHeader toggle={onClose}>Transmittal 추가 접수</ModalHeader>
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
								type="select"
								id="officialNumber"
								name="id"
								placeholder="ex) ABC-DEF-T-R-001-002"
								onChange={onChange}
								invalid={errors.get('officialNumberError')}
							>
								<option value="">--- 접수번호 ---</option>
								{transmittalsByVendor.map((transmittal) => (
									<option key={transmittal.get('_id')} value={transmittal.get('_id')}>
										{transmittal.get('officialNumber')}
									</option>
								))}
							</Input>
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
								<th>문서번호</th>
								<th>문서명</th>
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
				</Form>
			</ModalBody>
			<ModalFooter>
				<Button color="primary" onClick={onAdditionalReceive}>
					추가
				</Button>
				<Button color="secondary" onClick={onClose}>
					취소
				</Button>
			</ModalFooter>
		</Modal>
	);
};

VendorLetterAdditionalReceiveModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onChange: PropTypes.func,
	onReadDirectory: PropTypes.func,
	onDeleteReceiveDocument: PropTypes.func,
	onAdditionalReceive: PropTypes.func,
	className: PropTypes.string
};

VendorLetterAdditionalReceiveModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onReadDirectory: () => console.warn('Warrning: onReadDirectory is not defined'),
	onDeleteReceiveDocument: () => console.warn('Warning: onDeleteReceiveDocument is not defined'),
	onAdditionalReceive: () => console.warn('Warning: onAdditionalReceive is not defined')
};

export default VendorLetterAdditionalReceiveModal;
