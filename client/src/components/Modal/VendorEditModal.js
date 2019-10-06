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
	InputGroup
} from 'reactstrap';
import PropTypes from 'prop-types';

const VendorEditModal = ({ parts, data, errors, isOpen, onClose, onChange, onEdit, className, ...rest }) => {
	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose('vendorEdit')}
			className={className}
			contentClassName="border-light rounded"
			{...rest}
			size="lg"
		>
			<ModalHeader toggle={onClose('vendorEdit')} className="bg-light">
				업체 수정
			</ModalHeader>
			<ModalBody>
				<Form>
					<FormGroup row>
						<Col md={6}>
							<Label for="vendorGb">구분</Label>
							<Input
								type="select"
								id="vendorGb"
								name="vendorGb"
								onChange={onChange}
								value={data.get('vendorGb')}
								invalid={errors.get('vendorGbError')}
							>
								<option value="">------ 구분 ------</option>
								<option value="01">계약</option>
								<option value="02">관리</option>
							</Input>
						</Col>
						<Col md={6}>
							<Label for="countryCd">국가</Label>
							<Input
								type="select"
								id="countryCd"
								name="countryCd"
								onChange={onChange}
								value={data.get('countryCd')}
								invalid={errors.get('countryCdError')}
							>
								<option value="">------ 국내 / 해외 ------</option>
								<option value="01">국내</option>
								<option value="02">해외</option>
							</Input>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Col md={4}>
							<Label for="vendorName">업체명</Label>
							<Input
								type="text"
								id="vendorName"
								name="vendorName"
								className="text-danger"
								onChange={onChange}
								defaultValue={data.get('vendorName')}
								invalid={errors.get('vendorNameError')}
							/>
						</Col>
						<Col md={8}>
							<Label for="itemName">Item명</Label>
							<Input
								type="text"
								id="itemName"
								name="itemName"
								className="text-danger"
								onChange={onChange}
								defaultValue={data.get('itemName')}
								invalid={errors.get('itemNameError')}
							/>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Col md={4}>
							<Label for="part">공종</Label>
							<Input
								type="select"
								id="part"
								name="part"
								onChange={onChange}
								value={data.get('part')}
								invalid={errors.get('partError')}
							>
								<option value="">------ 공종 ------</option>
								{parts.get('cdMinors').map((code) => (
									<option key={code.get('_id')} value={code.get('_id')}>
										{code.get('cdSName')}
									</option>
								))}
							</Input>
						</Col>
						<Col md={4}>
							<Label for="partNumber">공종번호</Label>
							<Input
								type="text"
								id="partNumber"
								placeholder="ex) R-001"
								name="partNumber"
								className="text-danger"
								onChange={onChange}
								defaultValue={data.get('partNumber')}
								invalid={errors.get('partNumberError')}
							/>
						</Col>
						<Col md={4}>
							<Label for="officialName">관리번호</Label>
							<Input
								type="text"
								id="officialName"
								placeholder="ex) MCU"
								name="officialName"
								className="text-danger"
								onChange={onChange}
								defaultValue={data.get('officialName')}
								invalid={errors.get('officialNameError')}
							/>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Col md={8}>
							<Label for="effDt">계약기간</Label>
							<InputGroup id="effDt">
								<Input
									type="date"
									name="effStaDt"
									className="w-45 text-danger"
									onChange={onChange}
									value={data.get('effStaDt').substr(0, 10)}
									invalid={errors.get('effStaDtError')}
								/>
								<Input defaultValue="~" className="bg-light w-10 text-center" />
								<Input
									type="date"
									name="effEndDt"
									className="w-45 text-danger"
									onChange={onChange}
									value={data.get('effEndDt').substr(0, 10)}
									invalid={errors.get('effEndDtError')}
								/>
							</InputGroup>
						</Col>
					</FormGroup>
				</Form>
			</ModalBody>
			<ModalFooter className="bg-light">
				<Button color="primary" onClick={onEdit}>
					수정
				</Button>
				<Button color="secondary" onClick={onClose('vendorEdit')}>
					취소
				</Button>
			</ModalFooter>
		</Modal>
	);
};

VendorEditModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onChange: PropTypes.func,
	onEdit: PropTypes.func
};

VendorEditModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onEdit: () => console.warn('Warning: onEdit is not defined')
};

export default VendorEditModal;
