import React from 'react';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Col,
	Input,
	InputGroup,
	InputGroupAddon,
	Button,
	Table
} from 'reactstrap';
import { MdClose } from 'react-icons/md';
import QuestionModal from 'components/Modal/QuestionModal';
import Typography from 'components/Typography';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import { Table as VirtualTable, Column as VirtualColumn, InfiniteLoader } from 'react-virtualized';
import Loader from 'components/Loader';

const VendorLetterDetailModal = ({
	loading,
	codes,
	date,
	reasonError,
	isOpen,
	isOpenQuestion,
	data,
	documentsCount,
	onMoreDocuments,
	onClose,
	onChange,
	onTarget,
	onTargetVendor,
	onOpen,
	onOpenDetail,
	onDelete,
	onDate,
	onStatus,
	onDeleteStatus,
	className,
	...rest
}) => {
	const documents = data.get('documents').toJS();
	const width = 1100;

	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose('vendorLetterDetail')}
			className={className}
			contentClassName="border-light rouned"
			{...rest}
			size="xl"
		>
			<QuestionModal
				isOpen={isOpen && isOpenQuestion}
				onClose={onClose}
				size="md"
				header="상태 삭제"
				body={
					<div>
						<p className="m-0">선택 값을 삭제하시겠습니까?</p>
						<p className="m-0 text-danger">(* 삭제된 데이터 복구되지 않습니다.)</p>
					</div>
				}
				footer={
					<Button color="primary" onClick={onDeleteStatus}>
						삭제
					</Button>
				}
			/>
			<ModalHeader className="bg-light" toggle={onClose('vendorLetterDetail')}>
				업체 공문 상세 <span className="text-primary">({data.get('officialNumber')})</span>
			</ModalHeader>
			<ModalBody className="p-0">
				<Table borderless className="rounded m-0 overflow-hidden">
					<colgroup>
						<col width="20%" />
						<col width="30%" />
						<col width="20%" />
						<col width="30%" />
					</colgroup>
					<tbody>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								업체
							</th>
							<td>
								<span
									className="have-link"
									onClick={() => {
										onTargetVendor(data.getIn(['vendor', '_id']));
										onOpen('vendorDetail')();
									}}
								>
									{data.getIn(['vendor', 'vendorName'])} ({data.getIn(['vendor', 'partNumber'])} /{' '}
									{data.getIn(['vendor', 'part', 'cdSName'])})
								</span>
							</td>
							<th scope="row" className="text-right bg-light">
								접수 번호
							</th>
							<td>{data.get('officialNumber')}</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								발신
							</th>
							<td>
								{data.get('senderGb')}: {data.get('sender')}
							</td>
							<th scope="row" className="text-right bg-light">
								수신
							</th>
							<td>
								{data.get('receiverGb')}: {data.get('receiver')}
							</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right bg-light">
								접수일
							</th>
							<td>
								<span className="text-success font-weight-bold">
									{data.get('receiveDate').substr(0, 10)}
								</span>
							</td>
							<th scope="row" className="text-right bg-light">
								회신요청일
							</th>
							<td>
								<span className="text-success font-weight-bold">
									{data.get('targetDate').substr(0, 10)}
								</span>
							</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right align-middle bg-light">
								지연여부
							</th>
							<td className="title-font">
								{data.getIn(['isDelay', 'delayGb'])}{' '}
								<Typography tag="span" className="text-danger">
									({data.getIn(['isDelay', 'remain'])})
								</Typography>
							</td>
							<th scope="row" className="text-right align-middle bg-light">
								삭제여부
							</th>
							<td>
								{data.getIn(['cancelYn', 'yn'])}{' '}
								{data.getIn(['cancelYn', 'yn']) === 'YES' && (
									<React.Fragment>
										<Typography tag="span" className="text-danger">
											({data.getIn(['cancelYn', 'deleteDt'])})
										</Typography>
										<Typography type="p" className="m-0 pt-2">
											사유: {data.getIn(['cancelYn', 'reason'])}
										</Typography>
									</React.Fragment>
								)}
							</td>
						</tr>
						<tr className="border-bottom">
							<th scope="row" className="text-right  bg-light">
								상태
							</th>
							<td>
								{data.get('letterStatus').map((item, index) => {
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
												({item.getIn(['timestamp', 'regDt']).substr(0, 10)})
											</span>
										</div>
									);
								})}
							</td>
						</tr>
						<tr className="border-bottom" height="30">
							<td colSpan={4}>
								<InfiniteLoader
									isRowLoaded={({ index }) => !!documents[index]}
									loadMoreRows={({ startIndex }) => onMoreDocuments(data.get('_id'), startIndex)}
									rowCount={documentsCount}
								>
									{({ onRowsRendered, registerChild }) => (
										<VirtualTable
											ref={registerChild}
											className="pb-2 ml-2"
											headerClassName="d-flex align-items-center justify-content-center bg-light title-font"
											rowClassName="table-row d-flex border-bottom outline-none"
											gridClassName="outline-none"
											headerHeight={70}
											width={width}
											height={500}
											rowHeight={50}
											rowCount={documents.length}
											rowGetter={({ index }) => documents[index]}
											onRowsRendered={onRowsRendered}
										>
											<VirtualColumn
												label="문서번호"
												dataKey="documentNumber"
												className="pl-2 align-self-center"
												width={width * 0.2}
											/>
											<VirtualColumn
												label="문서명"
												dataKey="documentTitle"
												cellRenderer={({ dataKey,rowData }) => <span onClick={() => onOpenDetail(rowData._id)}>{rowData[dataKey]}</span>}
												className="align-self-center have-link"
												width={width * 0.4}
											/>
											<VirtualColumn
												label="Rev."
												dataKey="documentRev"
												className="text-center align-self-center"
												width={width * 0.05}
											/>
											<VirtualColumn
												label="접수일"
												cellDataGetter={({ dataKey, rowData }) => rowData.timestamp[dataKey].substr(0, 10)}
												dataKey="regDt"
												className="text-center align-self-center"
												width={width * 0.1}
											/>
											<VirtualColumn
												label="상태"
												cellRenderer={({ dataKey, rowData }) => {
													const documentStatus = rowData[dataKey][rowData[dataKey].length - 1];
		
													return <span>{documentStatus.statusName} <strong className="text-danger">({documentStatus.timestamp.regDt.substr(0, 10)})</strong></span>
												}}
												dataKey="documentStatus"
												className="text-center align-self-center"
												width={width * 0.25}
											/>
										</VirtualTable>
									)}
								</InfiniteLoader>
							</td>
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
				<Col className="pr-5 hidden-md hidden-sm hidden-xs">
					{loading && <Loader size={20} margin={10} />}

					{loading ||
						<InputGroup>
							<Input type="select" name="status" className="text-center" onChange={onChange}>
								<option value="">--- 변경할 상태 선택 --</option>
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
								<Button onClick={() => onStatus({ id: data.get('_id') })}>변경</Button>
							</InputGroupAddon>
						</InputGroup>
					}
				</Col>
				<Input
					type="text"
					name="reason"
					placeholder="DELETE 사유 (필수)"
					className="w-25"
					onChange={onChange}
					invalid={reasonError}
				/>
				{data.getIn(['cancelYn', 'yn']) === 'YES' ? (
					<Button color="danger" onClick={() => onDelete({ id: data.get('_id'), yn: 'NO' })}>
						삭제 취소
					</Button>
				) : (
						<Button color="danger" onClick={() => onDelete({ id: data.get('_id'), yn: 'YES' })}>
							삭제
					</Button>
					)}
				<Button color="primary" onClick={onOpen('vendorLetterEdit')}>
					수정
				</Button>
				<Button color="secondary" onClick={onClose('vendorLetterDetail')}>
					닫기
				</Button>
			</ModalFooter>
		</Modal>
	);
};

VendorLetterDetailModal.propTypes = {
	reasonError: PropTypes.bool,
	isOpen: PropTypes.bool,
	isOpenQuestion: PropTypes.bool,
	onClose: PropTypes.func,
	onChange: PropTypes.func,
	onTarget: PropTypes.func,
	onTargetVendor: PropTypes.func,
	onOpen: PropTypes.func,
	onOpenDetail: PropTypes.func,
	onDelete: PropTypes.func,
	onDate: PropTypes.func,
	onStatus: PropTypes.func,
	onDeleteStatus: PropTypes.func,
	className: PropTypes.string
};

VendorLetterDetailModal.defaultProps = {
	reasonError: false,
	isOpen: false,
	isOpenQuestion: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onTarget: () => console.warn('Warning: onTarget is not defined'),
	onTargetVendor: () => console.warn('Warning: onTargetVendor is not defined'),
	onOpen: () => console.warn('Warning: onOpen is not defined'),
	onOpenDetail: () => console.warn('Warning: onOpenDetail is not defined'),
	onDelete: () => console.warn('Warning: onDelete is not defined'),
	onDate: () => console.warn('Warning: onDate is not defined'),
	onStatus: () => console.warn('Warning: onStatus is not defined'),
	onDeleteStatus: () => console.warn('Warning: onDeleteStatus is not defined')
};

export default VendorLetterDetailModal;
