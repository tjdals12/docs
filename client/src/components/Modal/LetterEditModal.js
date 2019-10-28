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
	InputGroupAddon
} from 'reactstrap';
import PropTypes from 'prop-types';

const LetterEditModal = ({ data, errors, isOpen, onClose, onChange, onEdit, onOpen, className, ...rest }) => {
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
				내부 공문 수정
			</ModalHeader>
			<ModalBody>
				<Form>
					<FormGroup row>
						<Col md={6}>
							<Label for="letterGb">구분</Label>
							<Input
								type="select"
								id="letterGb"
								name="letterGb"
								value={data.get('letterGb')}
								onChange={onChange}
								invalid={errors.get('letterGbError')}
							>
								<option value="">-- 구분 --</option>
								<option value="01">E-mail</option>
								<option value="02">Transmittal</option>
							</Input>
						</Col>
						<Col md={6}>
							<Label for="reference">참조</Label>
							<Input
								type="text"
								id="reference"
								name="reference"
								className="can-click"
								onClick={onOpen('referenceSearch')}
								value={data.get('reference') && `참조: ${data.get('reference').size} 건`}
								readOnly
							/>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Col md={12}>
							<Label fo="letterTitle">제목</Label>
							<Input
								type="text"
								id="letterTitle"
								name="letterTitle"
								value={data.get('letterTitle')}
								onChange={onChange}
								invalid={errors.get('letterTitleError')}
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
					<FormGroup row>
						<Col md={6}>
							<Label for="sendDate">발신일</Label>
							<Input
								type="date"
								id="sendDate"
								name="sendDate"
								value={data.get('sendDate').substr(0, 10)}
								onChange={onChange}
								invalid={errors.get('sendDateError')}
							/>
						</Col>
						<Col md={6}>
							<Label for="reply">회신 필요 여부 / 회신요청일</Label>
							<InputGroup id="reply">
								<InputGroupAddon addonType="prepend">
									<Input
										type="select"
										name="replyRequired"
										value={data.get('replyRequired')}
										onChange={onChange}
										invalid={errors.get('replyRequiredError')}
									>
										<option value="">-- Y/ N --</option>
										<option value="YES">YES</option>
										<option value="NO">NO</option>
									</Input>
								</InputGroupAddon>
								<Input
									type="date"
									name="targetDate"
									value={
										data.get('replyRequired') === 'YES' ? data.get('targetDate').substr(0, 10) : ''
									}
									onChange={onChange}
								/>
							</InputGroup>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label md={12} for="memo">
							메모
						</Label>
						<Col md={12}>
							<Input
								type="textarea"
								bsSize="md"
								id="memo"
								name="memo"
								value={data.get('memo')}
								onChange={onChange}
							/>
						</Col>
					</FormGroup>
				</Form>
			</ModalBody>
			<ModalFooter className="bg-light">
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

LetterEditModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onChange: PropTypes.func,
	onEdit: PropTypes.func,
	className: PropTypes.string
};

LetterEditModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onEdit: () => console.warn('Warning: onEdit is not defined')
};

export default LetterEditModal;
