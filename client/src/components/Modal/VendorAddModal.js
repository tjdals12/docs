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
	InputGroup,
	Col
} from 'reactstrap';
import PropTypes from 'prop-types';

const VendorAddModal = ({ parts, errors, isOpen, onClose, onChange, onInsert, className, ...rest }) => {
	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose('vendorAdd')}
			className={className}
			contentClassName="border-light rounded"
			{...rest}
			size="lg"
		>
			<ModalHeader toggle={onClose('vendorAdd')} className="bg-light">
				업체 생성
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
								invalid={errors.get('vendorGbError')}
							>
								<option>------ 구분 ------</option>
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
								invalid={errors.get('countryCdError')}
							>
								<option>------ 국내 / 해외 ------</option>
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
								onChange={onChange}
								invalid={errors.get('vendorNameError')}
							/>
						</Col>
						<Col md={8}>
							<Label for="itemName">Item명</Label>
							<Input
								type="text"
								id="itemName"
								name="itemName"
								onChange={onChange}
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
								invalid={errors.get('partError')}
							>
								<option>------ 공종 ------</option>
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
								name="partNumber"
								placeholder="ex) R-001"
								onChange={onChange}
								invalid={errors.get('partNumberError')}
							/>
						</Col>
						<Col md={4}>
							<Label for="officialName">관리번호</Label>
							<Input
								type="text"
								id="officialName"
								name="officialName"
								placeholder="ex) MCU"
								onChange={onChange}
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
									className="w-45"
									onChange={onChange}
									invalid={errors.get('effStaDtError')}
								/>
								<Input defaultValue="~" className="bg-light w-10 text-center" />
								<Input
									type="date"
									name="effEndDt"
									className="w-45"
									onChange={onChange}
									invalid={errors.get('effEndDtError')}
								/>
							</InputGroup>
						</Col>
					</FormGroup>
				</Form>
			</ModalBody>
			<ModalFooter className="bg-light">
				<Button color="primary" onClick={onInsert}>
					생성
				</Button>
				<Button color="secondary" onClick={onClose('vendorAdd')}>
					취소
				</Button>
			</ModalFooter>
		</Modal>
	);
};

VendorAddModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onChange: PropTypes.func,
	onInsert: PropTypes.func,
	className: PropTypes.string
};

VendorAddModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not definec'),
	onChange: () => console.warn('Warning: onChange is not definec'),
	onInsert: () => console.warn('Warning: onInsert is not definec')
};

export default VendorAddModal;
