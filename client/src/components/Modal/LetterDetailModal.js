import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table, Input, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import Typography from 'components/Typography';
import queryString from 'query-string';

const LetterDetailModal = ({
	templates,
	selectedTemplate,
	data,
	reasonError,
	replyDate,
	isOpen,
	onClose,
	onOpen,
	onChange,
	onCancel,
	onOpenReference,
	onDownload,
	onReply,
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
			size="xl"
		>
			<ModalHeader toggle={onClose} className="bg-light">
				내부 공문 상세 <span className="text-primary">({data.get('officialNumber')})</span>
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
								구분
							</th>
							<td className={data.get('letterGb') === '01' ? 'text-info' : 'text-danger'}>
								{data.get('letterGb') === '01' ? 'E-mail' : 'TR'}
							</td>
							<th scope="row" className="text-right bg-light">
								공식번호
							</th>
							<td>{data.get('officialNumber')}</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								제목
							</th>
							<td colSpan="3">{data.get('letterTitle')}</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								발신
							</th>
							<td>
								{data.get('senderGb') === '01' ? 'CLIENT' : 'CONTRACTOR'}: {data.get('sender')}
							</td>
							<th scope="row" className="text-right bg-light">
								수신
							</th>
							<td>
								{data.get('receiverGb') === '01' ? 'CLIENT' : 'CONTRACTOR'}: {data.get('receiver')}
							</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right align-middle bg-light">
								발신일
							</th>
							<td className="text-success font-weight-bold">{data.get('sendDate').substr(0, 10)}</td>
							<th scope="row" className="text-right align-middle bg-light">
								취소 여부
							</th>
							<td>
								{data.getIn(['cancelYn', 'yn'])}{' '}
								{data.getIn(['cancelYn', 'yn']) === 'YES' && (
									<React.Fragment>
										<Typography tag="span" className="text-danger">
											({data.getIn(['cancelYn', 'cancelDt'])})
										</Typography>
										<Typography type="p" className="m-0 pt-2">
											사유: {data.getIn(['cancelYn', 'reason'])}
										</Typography>
									</React.Fragment>
								)}
							</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								회신요청일
							</th>
							<td>
								{data.get('replyRequired') === 'NO' ? (
									<span className="text-danger">회신 필요없음</span>
								) : (
										<span className="text-success">{data.get('targetDate').substr(0, 10)}</span>
									)}
							</td>
							<th scope="row" className="text-right bg-light">
								회신여부
							</th>
							<td>
								{data.get('replyRequired') === 'YES' ? (
									<span className="text-danger">
										{data.get('replyYn')}{' '}
										{data.get('replyYn') === 'YES' && `(${data.get('replyDate')})`}
									</span>
								) : (
										'-'
									)}
							</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								참조
							</th>
							<td colSpan={3}>
								{data.get('vendorLetters') &&
									data.get('vendorLetters').size !== 0 &&
									data.get('vendorLetters').map((vendorLetter) => {
										return (
											<Typography
												key={vendorLetter.get('_id')}
												type="p"
												className="mb-0 have-link"
												onClick={onOpenReference({
													name: 'vendorLetterDetail',
													id: vendorLetter.get('_id')
												})}
											>
												{vendorLetter.get('officialNumber')} ({`${vendorLetter.get('documents').size} 개`})
											</Typography>
										);
									})}

								{data.get('documents') &&
									data.get('documents').size !== 0 &&
									data.get('documents').map((document) => {
										return (
											<Typography
												key={document.get('_id')}
												type="p"
												className="mb-0 have-link"
												onClick={onOpenReference({
													name: 'documentDetail',
													id: document.get('_id')
												})}
											>
												{document.get('documentNumber')}_{document.get('documentTitle')}_{`Rev.${document.get('documentRev')}`}
											</Typography>
										);
									})}
							</td>
						</tr>

						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								메모
							</th>
							<td colSpan={3}>{data.get('memo') || '-'}</td>
						</tr>
						<tr>
							<th scope="row" className="text-right bg-light">
								등록정보
							</th>
							<td colSpan={3}>
								<span className="text-danger">
									등록: {data.getIn(['timestamp', 'regId'])} ({data.getIn(['timestamp', 'regDt'])})
								</span>
								<br />
								<span className="text-danger">
									수정: {data.getIn(['timestamp', 'updId'])} ({data.getIn(['timestamp', 'updDt'])})
								</span>
							</td>
						</tr>
					</tbody>
				</Table>
			</ModalBody>
			<ModalFooter className="bg-light">
				{data.get('letterGb') === '01' ? (
					<Col className="m-0 p-0">
						<Button
							color="success"
							className="flex-start"
							onClick={() => {
								const subject = `[${data.get('officialNumber')}] ${data.get('letterTitle')}`;

								const { clientCode, contractorCode } = data.get('project').toJS();

								const body = `수신: ${data.get('receiver')} / ${data.get('receiverGb') === '01'
									? clientCode
									: contractorCode}\n발신: ${data.get('sender')} / ${data.get('senderGb') === '01'
										? clientCode
										: contractorCode}\n\n제목: ${subject}\t\t\t${data.get('sendDate').substr(0, 10)}`;

								window.location.href = `mailto:lll2slll@naver.com?${queryString.stringify({
									subject,
									body
								})}`;
							}}
						>
							E-mail 작성
						</Button>
					</Col>
				) : (
						<Col className="d-flex align-items-center justify-content-start mr-4 p-0">
							<Input
								type="select"
								name="template"
								className="mr-2 w-60"
								value={selectedTemplate}
								onChange={onChange}
							>
								<option value="">-- 양식 --</option>
								{templates
									.filter((template) => template.getIn(['templateGb', 'cdMinor']) === '0001')
									.map((template) => (
										<option key={template.get('_id')} value={template.get('_id')}>
											{template.get('templateName')}
										</option>
									))}
							</Input>
							<Button
								color="success"
								disabled={selectedTemplate === ''}
								onClick={onDownload(data.get('_id'))}
							>
								다운로드
							</Button>
						</Col>
					)}

				<Input type='date' className="w-20" name="replyDate" onChange={onChange} value={replyDate}></Input>
				<Button color="danger" onClick={onReply(data.get('_id'))}>회신</Button>
				<Input
					type="text"
					name="reason"
					className="w-25"
					placeholder="취소 사유 (필수)"
					onChange={onChange}
					invalid={reasonError}
				/>
				{data.getIn(['cancelYn', 'yn']) === 'NO' ? (
					<Button color="danger" onClick={onCancel('YES')}>
						취소
					</Button>
				) : (
						<Button color="danger" onClick={onCancel('NO')}>
							복구
						</Button>
					)}

				<Button color="primary" onClick={onOpen('letterEdit')}>
					수정
				</Button>
				<Button color="secondary" onClick={onClose}>
					닫기
				</Button>
			</ModalFooter>
		</Modal>
	);
};

LetterDetailModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onOpen: PropTypes.func,
	onChange: PropTypes.func,
	onCancel: PropTypes.func,
	onOpenReference: PropTypes.func,
	onDownload: PropTypes.func,
	className: PropTypes.string
};

LetterDetailModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onOpen: () => console.warn('Warning: onOpen is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onCancel: () => console.warn('Warning: onCancel is not defined'),
	onOpenReference: () => console.warn('Warning: onOpenReference is not defined'),
	onDownload: () => console.warn('Warning: onDownload is not defined')
};

export default LetterDetailModal;
