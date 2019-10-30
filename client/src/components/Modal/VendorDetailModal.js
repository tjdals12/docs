import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import QuestionModal from 'components/Modal/QuestionModal';
import Typography from 'components/Typography';

const VendorDetailModal = ({
	writable,
	data,
	reasonError,
	isOpen,
	isOpenQuestion,
	onOpen,
	onClose,
	onDelete,
	onTarget,
	onChange,
	className,
	...rest
}) => {
	const isDelete = data.getIn(['deleteYn', 'yn']) === 'YES';

	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose('vendorDetail')}
			className={className}
			contentClassName="border-light rounded"
			{...rest}
			size="lg"
		>
			<QuestionModal
				isOpen={isOpen && isOpenQuestion}
				onClose={onClose}
				size="md"
				header="업체 삭제"
				body={
					<div>
						<p className="m-0">해당 업체를 삭제하시겠습니까?</p>
						<p className="m-0 text-danger">(* 삭제된 데이터 복구되지 않습니다.)</p>
						<Input type='text' name='reason' className="mt-2" placeholder={isDelete ? '복구 사유 (필수)' : '삭제 사유 (필수)'} onChange={onChange} invalid={reasonError} />
					</div>
				}
				footer={
					isDelete ?
						<Button color="success" onClick={() => onDelete('NO')}>
							복구
						</Button>
						:
						<Button color="primary" onClick={() => onDelete('YES')}>
							삭제
						</Button>
				}
			/>
			<ModalHeader toggle={onClose('vendorDetail')} className="bg-light">
				업체 상세
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
								프로젝트
							</th>
							<td colSpan="3">
								[{data.getIn(['project', 'projectCode'])}] {data.getIn(['project', 'projectName'])}
							</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								담당자
							</th>
							<td colSpan="3">
								{data.getIn(['manager', 'name'])} {data.getIn(['manager', 'position'])}
							</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								구분
							</th>
							<td>{data.get('vendorGb')}</td>
							<th scope="row" className="text-right bg-light">
								국가
							</th>
							<td>{data.get('countryCd')}</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								Item 명
							</th>
							<td colSpan="3" className="title-font">
								{data.get('itemName')}
							</td>
						</tr>
						<tr className="border-bottom">
							<th rowSpan="2" scope="row" className="text-right align-middle bg-light">
								업체명
							</th>
							<td className="title-font" rowSpan="2">
								{data.get('vendorName')}
							</td>
							<th scope="row" className="text-right bg-light">
								공종
							</th>
							<td>
								{data.getIn(['part', 'cdSName'])} ({data.get('partNumber')})
							</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								관리번호
							</th>
							<td>{data.get('officialName')}</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right align-middle bg-light">
								계약기간
							</th>
							<td>
								{data.get('effStaDt').substr(0, 10)} ~ {data.get('effEndDt').substr(0, 10)}
							</td>
							<th scope="row" className="text-right align-middle bg-light">삭제여부</th>
							<td>
								{data.getIn(['deleteYn', 'yn'])}{' '}
								{data.getIn(['deleteYn', 'yn']) === 'YES' && (
									<React.Fragment>
										<Typography tag="span" className="text-danger">
											({data.getIn(['deleteYn', 'deleteDt'])})
											</Typography>
										<Typography type="p" className="m-0 pt-2">
											사유: {data.getIn(['deleteYn', 'reason'])}
										</Typography>
									</React.Fragment>
								)}
							</td>
						</tr>
						<tr className="border-bottom">
							<th className="text-right bg-light">등록정보</th>
							<td colSpan="3">
								<span className="text-secondary">
									등록: {data.getIn(['timestamp', 'regId'])} ({data.getIn(['timestamp', 'regDt'])})
								</span>
								<br />
								<span className="text-secondary">
									수정: {data.getIn(['timestamp', 'updId'])} ({data.getIn(['timestamp', 'updDt'])})
								</span>
							</td>
						</tr>
						<tr>
							<td colSpan="4">
								<Table bordered className="m-0">
									<thead>
										<tr className="border-bottom" style={{ background: '#e7f5ff' }}>
											<th className="text-center">이름</th>
											<th className="text-center">E-mail</th>
											<th className="text-center">연락처</th>
											<th className="text-center">담당업무</th>
										</tr>
									</thead>
									<tbody>
										{data.get('vendorPerson').size === 0 ? (
											<tr>
												<td colSpan="4" className="text-center font-italic">
													등록된 담당자가 없습니다.
												</td>
											</tr>
										) : (
												data.get('vendorPerson').map((person) => (
													<tr key={person.get('_id')} className="border-bottom">
														<td className="text-center">
															{person.get('name')} {person.get('position')}
														</td>
														<td className="text-center">{person.get('email')}</td>
														<td className="text-center">{person.get('contactNumber')}</td>
														<td className="text-center">{person.get('task')}</td>
													</tr>
												))
											)}
									</tbody>
								</Table>
							</td>
						</tr>
					</tbody>
				</Table>
			</ModalBody>
			<ModalFooter className="bg-light">
				{
					writable &&
					([
						<Button
							key={1}
							color="danger"
							className="mr-auto"
							onClick={() => {
								onTarget({ id: data.get('_id') });
								onOpen('question')();
							}}
						>
							삭제/복구
						</Button>,
						<Button color="primary" onClick={onOpen('vendorEdit')} key={2}>
							수정
						</Button>
					])
				}
				<Button color="secondary" onClick={onClose('vendorDetail')}>
					닫기
				</Button>
			</ModalFooter>
		</Modal>
	);
};

VendorDetailModal.propTypes = {
	writable: PropTypes.bool,
	isOpen: PropTypes.bool,
	isOpenQuestion: PropTypes.bool,
	onOpen: PropTypes.func,
	onClose: PropTypes.func,
	onDelete: PropTypes.func,
	onTarget: PropTypes.func
};

VendorDetailModal.defaultProps = {
	writable: false,
	isOpen: false,
	isOpenQuestion: false,
	onOpen: () => console.warn('Warning: onOpen is not defined'),
	onClose: () => console.warn('Warning: onClose is not defined'),
	onDelete: () => console.warn('Warning: onDelete is not defined'),
	onTarget: () => console.warn('Warning: onTarget is not defined')
};

export default VendorDetailModal;
