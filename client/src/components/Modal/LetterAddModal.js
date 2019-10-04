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

const LetterAddModal = ({
	projectList,
	data,
	errors,
	isOpen,
	onClose,
	onChange,
	onAdd,
	onOpen,
	className,
	...rest
}) => {
	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose('letterAdd')}
			className={className}
			contentClassName="border rounded"
			{...rest}
			size="lg"
		>
			<ModalHeader toggle={onClose('letterAdd')} className="bg-light">
				Letter 추가
			</ModalHeader>
			<ModalBody>
				<Form>
					<FormGroup row>
						<Col md={12}>
							<Label for="project">프로젝트</Label>
							<Input
								type="select"
								id="project"
								name="project"
								onChange={onChange}
								invalid={errors.get('projectError')}
							>
								<option value="">-- 프로젝트 --</option>
								{projectList.map((project) => (
									<option key={project.get('_id')} value={project.get('_id')}>
										{project.get('projectName')} ({project.get('projectCode')})
									</option>
								))}
							</Input>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Col md={6}>
							<Label for="letterGb">구분</Label>
							<Input
								type="select"
								id="letterGb"
								name="letterGb"
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
								defaultValue={data.get('reference') && `참조: ${data.get('reference').length} 건`}
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
					<FormGroup row>
						<Col md={6}>
							<Label for="sendDate">발신일</Label>
							<Input
								type="date"
								id="sendDate"
								name="sendDate"
								value={data.get('sendDate')}
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
									onChange={onChange}
									invalid={errors.get('targetDateError')}
								/>
							</InputGroup>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label md={12} for="memo">
							메모
						</Label>
						<Col md={12}>
							<Input type="textarea" bsSize="md" id="memo" name="memo" onChange={onChange} />
						</Col>
					</FormGroup>
				</Form>
			</ModalBody>
			<ModalFooter className="bg-light">
				<Button color="primary" onClick={onAdd}>
					ADD
				</Button>
				<Button color="secondary" onClick={onClose('letterAdd')}>
					CANCEL
				</Button>
			</ModalFooter>
		</Modal>
	);
};

LetterAddModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onChange: PropTypes.func,
	className: PropTypes.string
};

LetterAddModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined')
};

export default LetterAddModal;
