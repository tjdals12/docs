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
	Table
} from 'reactstrap';
import { MdClose, MdKeyboardCapslock } from 'react-icons/md';
import { FaCaretRight } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { Table as VirtualTable, Column as VirtualColumn } from 'react-virtualized';
import Loader from 'components/Loader';
import { FaExclamation } from 'react-icons/fa';

const DocumentIndexAddModal = ({
	loading,
	vendorList,
	gbs,
	data,
	error,
	infosError,
	isOpen,
	onClose,
	onChange,
	onChangeInfo,
	onChangeList,
	onExcelUpload,
	onEdit,
	className,
	...rest
}) => {
	const width = 1100;

	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose}
			className={className}
			contentClassName="border-light rounded"
			{...rest}
			size="xl"
		>
			<ModalHeader toggle={onClose} className="bg-light">
				문서목록 수정
			</ModalHeader>
			<ModalBody>
				<Form onSubmit={(e) => e.preventDefault()}>
					<FormGroup row>
						<Col md={12}>
							<Label for="vendor">업체</Label>
							<Input type="select" id="vendor" name="vendor" value={data.vendor} disabled>
								<option value="">--- 업체를 선택해주세요. ---</option>
								{vendorList.map((vendor) => (
									<option key={vendor._id} value={vendor._id}>
										{vendor.vendorName} ({vendor.part.cdSName},{' '}
										{vendor.partNumber}
									</option>
								))}
							</Input>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label for="list" md={2}>
							<FaCaretRight className="text-success pb-1" size={20} />문서목록
						</Label>
						{data.list.length === 0 && (
							<Col md={4}>
								<Button className="custom-file-uploader">
									<Input
										type="file"
										name="indexes"
										onChange={(e) => {
											onExcelUpload(e.target.files[0]);
										}}
									/>
									Select a file
								</Button>
							</Col>
						)}
					</FormGroup>
					<VirtualTable
						className="pb-2"
						headerClassName="d-flex align-items-center justify-content-center bg-light title-font h-100"
						rowClassName="table-row d-flex align-items-center justify-content-center border-bottom outline-none"
						gridClassName="outline-none"
						headerHeight={70}
						width={width}
						height={400}
						rowHeight={50}
						rowCount={data.list.length}
						rowGetter={({ index }) => data.list[index]}
					>
						<VirtualColumn
							label="#"
							dataKey="index"
							className="text-right p-2"
							cellRenderer={({ rowData, rowIndex }) => {
								const isError = infosError.indexOf(rowData['_id']) > -1;

								return <span className={`${isError ? 'text-danger title-font' : 'font-weight-bold'} font-italic`}>{rowIndex + 1}.</span>
							}}
							width={width * 0.05}
						/>
						<VirtualColumn
							label="문서번호"
							dataKey="documentNumber"
							className="p-2"
							cellRenderer={({ dataKey, rowData, rowIndex }) => (
								<Input 
									type='text'
									name={dataKey}
									value={rowData[dataKey]}
									onChange={onChangeInfo(rowData['_id'] || rowIndex)}
								/>
							)}
							width={width * 0.20}
						/>
						<VirtualColumn
							label="문서명"
							dataKey="documentTitle"
							className="p-2"
							cellRenderer={({ dataKey, rowData, rowIndex }) => (
								<Input
									type='text'
									name={dataKey}
									value={rowData[dataKey]}
									onChange={onChangeInfo(rowData['_id'] || rowIndex)}
								/>
							)}
							width={width * 0.4}
						/>
						<VirtualColumn
							label="구분"
							dataKey="documentGb"
							className="p-2"
							cellRenderer={({ dataKey, rowData, rowIndex }) => {
								return (
									<Input
										type="select"
										name="documentGb"
										value={rowData[dataKey] || rowIndex}
										onChange={onChangeInfo(rowData['_id'] || rowIndex)}
									>
										<option value="">-- 구분 --</option>
										{gbs.cdMinors.map((gb) => (
											<option key={gb._id} value={gb._id}>
												{gb.cdSName}
											</option>
										))}
									</Input>	
								)
							}}
							width={width * 0.10}
						/>
						<VirtualColumn
							label="Plan"
							dataKey="plan"
							className="p-2"
							cellRenderer={({ dataKey, rowData, rowIndex }) => (
								<Input
									type="date"
									name="plan"
									value={rowData[dataKey].substr(0, 10)}
									onChange={onChangeInfo(rowData['_id'] || rowIndex)}
									bsSize="sm"
								/>
							)}
							width={width * 0.20}
						/>
						<VirtualColumn
							label=""
							dataKey="_id"
							className="text-center"
							cellRenderer={({ dataKey, rowData, rowIndex }) => (
								<MdClose
									size={20}
									className="text-danger can-click"
									onClick={
										rowData[dataKey] === '' ? (
											onChangeList(rowIndex, 'DELETE')
										) : (
											onChangeList(rowData[dataKey], 'REMOVE')
										)
									}
								/>
							)}
							width={width * 0.05}
						/>
					</VirtualTable>

					<FormGroup row>
						<Label for="deleteList" md={2}>
							<FaCaretRight className="text-danger pb-1" size={20} />삭제된 문서목록
						</Label>
					</FormGroup>
					<Table bordered striped>
						<colgroup>
							<col with="5%" />
							<col width="35%" />
							<col width="40%" />
							<col width="15%" />
							<col width="5%" />
						</colgroup>
						<thead>
							<tr style={{ background: '#ffe3e3' }}>
								<th>#</th>
								<th>문서명</th>
								<th>문서제목</th>
								<th className="text-center">Plan</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{data.deleteList.length === 0 ? (
								<tr>
									<td colSpan={5} className="text-center text-muted font-italic">
										삭제된 문서가 없습니다.
									</td>
								</tr>
							) : (
									data.deleteList.map((document, index) => {
										const { _id = '', documentNumber, documentTitle, plan } = document;

										return (
											<tr key={index}>
												<td>{index + 1}</td>
												<td>{documentNumber}</td>
												<td>{documentTitle}</td>
												<td>{plan.substr(0, 10).replace(/-/g, '. ')}</td>
												<td className="text-center">
													<MdKeyboardCapslock
														size={20}
														className="text-danger can-click"
														onClick={onChangeList(_id, 'RECOVERY')}
													/>
												</td>
											</tr>
										);
									})
								)}
						</tbody>
					</Table>
				</Form>
			</ModalBody>
			<ModalFooter className="bg-light">
				{loading || infosError.length === 0 || <span className="m-auto text-danger"><FaExclamation size={20} className="pb-1" /> 누락된 값이 없는지 확인 바랍니다.</span>}
				{loading
					? <Loader size={20} margin={10} />
					: ([
							<Button key="edit" color="primary" onClick={onEdit}>
								수정
							</Button>,
							<Button key="cancel" color="secondary" onClick={onClose}>
								취소
							</Button>
						])
				}
			</ModalFooter>
		</Modal>
	);
};

DocumentIndexAddModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onChange: PropTypes.func,
	onChangeInfo: PropTypes.func,
	onChangeList: PropTypes.func,
	onExcelUpload: PropTypes.func,
	onEdit: PropTypes.func,
	className: PropTypes.string
};

DocumentIndexAddModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onChangeInfo: () => console.warn('Warning: onChangeInfo is not defined'),
	onChangeList: () => console.warn('Warning: onChangeList is not defined'),
	onExcelUpload: () => console.warn('Warning: onExcelUpload is not defined'),
	onEdit: () => console.warn('Warning: onEdit is not defined')
};

export default DocumentIndexAddModal;
