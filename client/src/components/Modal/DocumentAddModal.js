import React from 'react';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Form,
	FormGroup,
	InputGroup,
	InputGroupAddon,
	Label,
	Input,
	Button,
	Col
} from 'reactstrap';
import PropTypes from 'prop-types';

const DocumentAddModal = ({
	vendorList,
	parts,
	gbs,
	errors,
	isOpen,
	onClose,
	onChange,
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
			size="lg"
		>
			<ModalHeader toggle={onClose} className="bg-light">
				문서 추가
			</ModalHeader>
			<ModalBody>
				<Form>
					<FormGroup row>
						<Col md={6}>
							<Label for="vendor">업체</Label>
							<Input type="select" name="vendor" onChange={onChange} invalid={errors.get('vendorError')}>
								<option value="">------ 업체를 선택해주세요. ------</option>
								{vendorList.map((vendor) => (
									<option key={vendor.get('_id')} value={vendor.get('_id')}>
										{vendor.get('vendorName')} ({vendor.getIn(['part', 'cdSName'])},{' '}
										{vendor.get('partNumber')})
									</option>
								))}
							</Input>
						</Col>

						<Col md={6}>
							<Label for="part">공종</Label>
							<Input type="select" name="part" onChange={onChange} invalid={errors.get('partError')}>
								<option value="">------ 공종을 선택해주세요. ------</option>
								{parts.get('cdMinors').map((part) => (
									<option key={part.get('_id')} value={part.get('_id')}>
										{part.get('cdSName')}
									</option>
								))}
							</Input>
						</Col>
					</FormGroup>

					<FormGroup>
						<Label for="title">문서명</Label>
						<Input
							name="documentTitle"
							placeholder="Document Title.."
							onChange={onChange}
							invalid={errors.get('documentTitleError')}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="number">문서번호</Label>
						<Input
							name="documentNumber"
							placeholder="Document Number.."
							onChange={onChange}
							invalid={errors.get('documentNumberError')}
						/>
					</FormGroup>
					<FormGroup row>
						<Col md={6}>
							<Label for="rev">Revision</Label>
							<InputGroup>
								<InputGroupAddon addonType="prepend">Rev.</InputGroupAddon>
								<Input
									name="documentRev"
									placeholder="A"
									onChange={onChange}
									invalid={errors.get('documentRevError')}
								/>
							</InputGroup>
						</Col>

						<Col md={6}>
							<Label for="gb">구분</Label>
							<Input
								type="select"
								name="documentGb"
								onChange={onChange}
								invalid={errors.get('documentGbError')}
							>
								<option value="">------ 구분을 선택해주세요. ------</option>
								{gbs.get('cdMinors').map((gb) => (
									<option key={gb.get('_id')} value={gb.get('_id')}>
										{gb.get('cdSName')}
									</option>
								))}
							</Input>
						</Col>
					</FormGroup>
					<FormGroup>
						<Label for="transmittal">TRANSMITTAL NO.</Label>
						<Input
							name="officialNumber"
							placeholder="Transmittal Number.."
							onChange={onChange}
							invalid={errors.get('officialNumberError')}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="memo">메모</Label>
						<Input
							type="textarea"
							bsSize="lg"
							name="memo"
							onChange={onChange}
							invalid={errors.get('memoError')}
						/>
					</FormGroup>
				</Form>
			</ModalBody>
			<ModalFooter className="bg-light">
				<Button color="primary" onClick={onInsert}>
					추가
				</Button>
				<Button color="secondary" onClick={onClose}>
					닫기
				</Button>
			</ModalFooter>
		</Modal>
	);
};

DocumentAddModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onChange: PropTypes.func,
	onInsert: PropTypes.func,
	className: PropTypes.string
};

DocumentAddModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onInsert: () => console.warn('Warning: onInsert is not defined')
};

export default DocumentAddModal;
