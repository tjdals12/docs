import React from 'react';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ButtonGroup,
	Button,
	Input,
	InputGroup,
	InputGroupAddon,
	Table,
	Progress,
	Col
} from 'reactstrap';
import { MdClose } from 'react-icons/md';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import QuestionModal from 'components/Modal/QuestionModal';
import Typography from 'components/Typography';

const DocumentDetailModal = ({
	codes,
	date,
	isOpen,
	isOpenQuestion,
	data,
	reason,
	reasonError,
	onClose,
	onHold,
	onDelete,
	onOpen,
	onChange,
	onDate,
	onStatus,
	onDeleteStatus,
	onTarget,
	onTargetVendor,
	className,
	...rest
}) => {
	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose('documentDetail')}
			className={className}
			contentClassName="border-light rounded"
			{...rest}
			size="xl"
		>
			<QuestionModal
				isOpen={isOpen && isOpenQuestion}
				onClose={onClose}
				size="md"
				header="In/Out 및 상태 삭제"
				body={
					<div>
						<p className="m-0">선택 값을 삭제하시겠습니까?</p>
						<p className="m-0 text-danger">(* 삭제된 데이터 복구되지 않습니다.)</p>
					</div>
				}
				footer={
					<Button color="primary" onClick={onDeleteStatus}>
						DELETE
					</Button>
				}
			/>
			<ModalHeader toggle={onClose('documentDetail')} className="bg-light">
				Document 상세{' '}
				<span className="text-primary">
					({data.get('documentNumber')}_{data.get('documentTitle')}_Rev.{data.get('documentRev')})
				</span>
			</ModalHeader>
			<ModalBody className="p-0">
				<Table borderless className="rounded m-0">
					<colgroup>
						<col width="20%" />
						<col width="30%" />
						<col width="20%" />
						<col width="30%" />
					</colgroup>
					<tbody>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								업체 (공종)
							</th>
							<td>
								<span
									className="have-link"
									onClick={() => {
										onTargetVendor({ id: data.getIn([ 'vendor', '_id' ]) });
										onOpen('vendorDetail')();
									}}
								>
									{data.getIn([ 'vendor', 'vendorName' ])}
									({data.getIn([ 'vendor', 'partNumber' ])} /{' '}
									{data.getIn([ 'vendor', 'part', 'cdSName' ])})
								</span>
							</td>
							<th scope="row" className="text-right bg-light">
								문서 구분
							</th>
							<td>{data.getIn([ 'documentGb', 'cdSName' ])}</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								문서번호
							</th>
							<td colSpan={3}>{data.get('documentNumber')}</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								문서명
							</th>
							<td colSpan={3}>{data.get('documentTitle')}</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right align-middle bg-light">
								Revision
							</th>
							<td>{data.get('documentRev')}</td>
							<th scope="row" className="text-right align-middle bg-light">
								중요도
							</th>
							<td>
								<div className="pb-1">{data.getIn([ 'level', 'description' ])} (Max: 5)</div>
								<Progress max={5} value={data.getIn([ 'level', 'number' ])} />
							</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right align-middle bg-light">
								삭제여부
							</th>
							<td>
								{data.getIn([ 'deleteYn', 'yn' ])}{' '}
								{data.getIn([ 'deleteYn', 'yn' ]) === 'YES' && (
									<React.Fragment>
										<Typography tag="span" className="text-danger">
											({data.getIn([ 'deleteYn', 'deleteDt' ])})
										</Typography>
										<Typography type="p" className="m-0 pt-2">
											사유: {data.getIn([ 'deleteYn', 'reason' ])}
										</Typography>
									</React.Fragment>
								)}
							</td>
							<th scope="row" className="text-right align-middle bg-light">
								보류여부
							</th>
							<td>
								{data.getIn([ 'holdYn', -1, 'yn' ])}{' '}
								{data.getIn([ 'holdYn', -1, 'yn' ]) === 'YES' && (
									<React.Fragment>
										<Typography tag="span" className="text-danger">
											({data.getIn([ 'holdYn', -1, 'effStaDt' ]).substr(0, 10)} ~{' '}
											{data.getIn([ 'holdYn', -1, 'effEndDt' ]).substr(0, 10) === '9999-12-31' ? (
												'진행중'
											) : (
												data.getIn([ 'holdYn', -1, 'effEndDt' ]).substr(0, 10)
											)})
										</Typography>
										<Typography type="p" className="pt-2">
											사유: {data.getIn([ 'holdYn', -1, 'reason' ])}
										</Typography>
									</React.Fragment>
								)}
							</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								In / Out 기록
							</th>
							<td>
								{data.get('documentInOut').map((item, index) => {
									return (
										<div key={index} className="mb-2">
											<span key={index}>{item.get('inOutGb')} </span>
											<MdClose
												size={15}
												className="text-danger can-click"
												onClick={() => {
													onTarget({ id: item.get('_id') });
													onOpen('question')();
												}}
											/>
											<br />

											<span className="text-danger">
												({item.getIn([ 'timestamp', 'regDt' ]).substr(0, 10)})
											</span>
										</div>
									);
								})}
							</td>
							<th scope="row" className="text-right bg-light">
								Status
							</th>
							<td>
								{data.get('documentStatus').map((item, index) => {
									return (
										<div key={index} className="mb-2">
											<span key={index}>
												{item.get('statusName')}
												{!!item.get('resultCode') && ` (${item.get('resultCode')})`}
												{!!item.get('replyCode') && ` - ${item.get('replyCode')}`}
												{'  '}
												<MdClose
													size={15}
													className="text-danger can-click"
													onClick={() => {
														onTarget({ id: item.get('_id') });
														onOpen('question')();
													}}
												/>
											</span>
											<br />

											<span className="text-danger">
												({item.getIn([ 'timestamp', 'regDt' ]).substr(0, 10)})
											</span>
										</div>
									);
								})}
							</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								메모
							</th>
							<td colSpan="3">{data.get('memo')}</td>
						</tr>
						<tr>
							<th scope="row" className="text-right bg-light">
								등록정보
							</th>
							<td colSpan="3">
								<span className="text-secondary">
									등록: {data.getIn([ 'timestamp', 'regId' ])} ({data.getIn([ 'timestamp', 'regDt' ])})
								</span>
								<br />
								<span className="text-secondary">
									수정: {data.getIn([ 'timestamp', 'updId' ])} ({data.getIn([ 'timestamp', 'updDt' ])})
								</span>
							</td>
						</tr>
					</tbody>
				</Table>
			</ModalBody>
			<ModalFooter className="bg-light">
				<Col className="pr-5">
					<InputGroup>
						<Input type="select" name="status" onChange={onChange} className="text-center">
							<option value="">-- 변경할 상태 선택 --</option>
							{codes.get('cdMinors').map((code) => (
								<option key={code.get('_id')} value={JSON.stringify(code.get('cdRef1'))}>
									{code.get('cdSName')}
								</option>
							))}
						</Input>
						<InputGroupAddon addonType="prepend">
							<DatePicker
								dateFormat="yyyy-MM-dd"
								className="text-center"
								name="date"
								selected={date}
								onChange={onDate}
							/>
						</InputGroupAddon>
						<InputGroupAddon addonType="append">
							<Button onClick={onStatus({ id: data.get('id') })}>변경</Button>
						</InputGroupAddon>
					</InputGroup>
				</Col>
				<Input
					type="text"
					name="reason"
					placeholder="Hold 또는 Delete 사유 (필수)"
					className="w-25"
					onChange={onChange}
					value={reason}
					invalid={reasonError}
				/>
				<ButtonGroup>
					{data.getIn([ 'deleteYn', 'yn' ]) === 'NO' ? (
						<Button color="danger" onClick={onDelete({ id: data.get('id'), yn: 'YES' })}>
							DELETE
						</Button>
					) : (
						<Button color="danger" onClick={onDelete({ id: data.get('id'), yn: 'NO' })}>
							DELETE 취소
						</Button>
					)}
					{data.getIn([ 'holdYn', -1, 'yn' ]) === 'NO' ? (
						<Button color="info" onClick={onHold({ id: data.get('id'), yn: 'YES' })}>
							HOLD
						</Button>
					) : (
						<Button color="info" onClick={onHold({ id: data.get('id'), yn: 'NO' })}>
							HOLD 취소
						</Button>
					)}
				</ButtonGroup>
				<Button color="primary" onClick={onOpen('documentEdit')}>
					EDIT
				</Button>
				<Button color="secondary" onClick={onClose('documentDetail')}>
					CANCEL
				</Button>
			</ModalFooter>
		</Modal>
	);
};

DocumentDetailModal.propTypes = {
	isOpen: PropTypes.bool,
	isOpenQuestion: PropTypes.bool,
	reason: PropTypes.string,
	onClose: PropTypes.func,
	onHold: PropTypes.func,
	onDelete: PropTypes.func,
	onOpen: PropTypes.func,
	onChange: PropTypes.func,
	onDate: PropTypes.func,
	onStatus: PropTypes.func,
	onDeleteStatus: PropTypes.func,
	onTarget: PropTypes.func,
	onTargetVendor: PropTypes.func
};

DocumentDetailModal.defaultProps = {
	isOpen: false,
	isOpenQuestion: false,
	reason: '',
	onClose: () => console.warn('Warning: onClose is not defined'),
	onHold: () => console.warn('Warning: onHold is not defined'),
	onDelete: () => console.warn('Warning: onDelete is not defined'),
	onOpen: () => console.warn('Warning: onOpen is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onDate: () => console.warn('Warning: onDate is not defined'),
	onStatus: () => console.warn('Warning: onStatus is not defined'),
	onDeleteStatus: () => console.warn('Warning: onDeleteStatus is not defined'),
	onTarget: () => console.warn('Warning: onTarget is not defined'),
	onTargetVendor: () => console.warn('Warning: onTargetVendor is not defined')
};

export default DocumentDetailModal;
