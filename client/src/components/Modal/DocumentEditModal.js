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
	InputGroup,
	InputGroupAddon,
	Input,
	Col
} from 'reactstrap';
import Slider from 'react-rangeslider';
import PropTypes from 'prop-types';

const horizontalLabels = {
	1: 'Low',
	3: 'Normal',
	5: 'High'
};

const DocumentEditModal = ({
	vendorList,
	parts,
	gbs,
	data,
	errors,
	isOpen,
	onClose,
	onChange,
	onEdit,
	className,
	...rest
}) => {
	const {
		vendor,
		part,
		documentGb,
		documentTitle,
		documentNumber,
		documentRev,
		level,
		officialNumber,
		memo
	} = data.toJS();

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
				Document 수정
			</ModalHeader>
			<ModalBody>
				<Form>
					<FormGroup row>
						<Col md={6}>
							<Label for="vendor">업체</Label>
							<Input
								type="select"
								name="vendor"
								value={vendor}
								onChange={onChange}
								invalid={errors.get('vendorError')}
							>
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
							<Input
								type="select"
								name="part"
								value={part}
								onChange={onChange}
								invalid={errors.get('partError')}
							>
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
							className="text-danger"
							onChange={onChange}
							defaultValue={documentTitle}
							invalid={errors.get('documentTitleError')}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="number">문서번호</Label>
						<Input
							name="documentNumber"
							placeholder="Document Number.."
							className="text-danger"
							onChange={onChange}
							defaultValue={documentNumber}
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
									className="text-danger"
									onChange={onChange}
									defaultValue={documentRev}
									invalid={errors.get('documentRevError')}
								/>
							</InputGroup>
						</Col>

						<Col md={6}>
							<Label for="gb">구분</Label>
							<Input
								type="select"
								name="documentGb"
								value={documentGb}
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
					<FormGroup className="mb-5">
						<Label for="level">중요도</Label>
						<Slider
							min={1}
							max={5}
							value={level.number}
							labels={horizontalLabels}
							onChange={(value) => {
								onChange({ target: { name: 'level', value: value } });
							}}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="transmittal">TRANSMITTAL NO.</Label>
						<Input
							name="officialNumber"
							placeholder="Transmittal Number.."
							className="text-danger"
							onChange={onChange}
							defaultValue={officialNumber}
							invalid={errors.get('officialNumberError')}
						/>
					</FormGroup>
					<FormGroup>
						<Label for="memo">메모</Label>
						<Input
							type="textarea"
							bsSize="lg"
							name="memo"
							className="text-danger"
							style={{ fontSize: '.9rem' }}
							onChange={onChange}
							defaultValue={memo}
							invalid={errors.get('memoError')}
						/>
					</FormGroup>
				</Form>
			</ModalBody>
			<ModalFooter className="bg-light">
				<Button color="primary" onClick={onEdit}>
					수정
				</Button>
				<Button onClick={onClose}>닫기</Button>
			</ModalFooter>
		</Modal>
	);
};

DocumentEditModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onChange: PropTypes.func,
	onEdit: PropTypes.func,
	className: PropTypes.string
};

DocumentEditModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onEdit: () => console.warn('Warning: onEdit is not defined')
};

export default DocumentEditModal;
