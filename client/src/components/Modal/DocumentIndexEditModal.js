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

const DocumentIndexItem = React.memo(({ gbs, index, _id, documentNumber, documentTitle, documentGb, plan, isError, onChangeInfo, onChangeList }) => {
	return (
		<tr key={index} className={isError ? 'bg-secondary' : ''}>
			<td className="text-right">{index + 1}</td>
			<td>
				<Input
					type="text"
					name="documentNumber"
					value={documentNumber}
					onChange={onChangeInfo(_id || index)}
					bsSize="sm"
				/>
			</td>
			<td>
				<Input
					type="text"
					name="documentTitle"
					value={documentTitle}
					onChange={onChangeInfo(_id || index)}
					bsSize="sm"
				/>
			</td>
			<td>
				<Input
					type="select"
					name="documentGb"
					value={documentGb || index}
					onChange={onChangeInfo(_id || index)}
				>
					<option value="">-- 구분 --</option>
					{gbs.get('cdMinors').map((gb) => (
						<option key={gb.get('_id')} value={gb.get('_id')}>
							{gb.get('cdSName')}
						</option>
					))}
				</Input>
			</td>
			<td className="text-center">
				<Input
					type="date"
					name="plan"
					value={plan.substr(0, 10)}
					onChange={onChangeInfo(_id || index)}
					bsSize="sm"
				/>
			</td>
			<td className="text-center">
				<MdClose
					size={20}
					className="text-danger can-click"
					onClick={
						_id === '' ? (
							onChangeList(index, 'DELETE')
						) : (
								onChangeList(_id, 'REMOVE')
							)
					}
				/>
			</td>
		</tr>
	)
})

const DocumentIndexAddModal = ({
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
							<Input type="select" id="vendor" name="vendor" value={data.get('vendor')} disabled>
								<option value="">--- 업체를 선택해주세요. ---</option>
								{vendorList.map((vendor) => (
									<option key={vendor.get('_id')} value={vendor.get('_id')}>
										{vendor.get('vendorName')} ({vendor.getIn(['part', 'cdSName'])},{' '}
										{vendor.get('partNumber')})
									</option>
								))}
							</Input>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label for="list" md={2}>
							<FaCaretRight className="text-success pb-1" size={20} />문서목록
						</Label>
						{data.get('list').size === 0 && (
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
					<Table bordered striped className="mb-5">
						<colgroup>
							<col with="5%" />
							<col width="25%" />
							<col width="35%" />
							<col width="15%" />
							<col width="15%" />
							<col width="5%" />
						</colgroup>
						<thead>
							<tr style={{ background: '#e7f5ff' }}>
								<th>#</th>
								<th>문서번호</th>
								<th>문서제목</th>
								<th>구분</th>
								<th className="text-center">Plan</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{data.get('list').size === 0 ? (
								<tr>
									<td colSpan={6} className="text-center text-muted font-italic">
										양식에 맞게 작성된 엑셀 파일을 선택해주세요.
									</td>
								</tr>
							) : (
									data.get('list').map((document, index) => {
										const {
											_id = '',
											documentNumber,
											documentTitle,
											documentGb,
											plan
										} = document.toJS();
										const isError = infosError.indexOf(_id) > -1;

										return (
											<DocumentIndexItem
												key={index}
												gbs={gbs}
												index={index}
												_id={_id}
												documentNumber={documentNumber}
												documentTitle={documentTitle}
												documentGb={documentGb}
												plan={plan}
												isError={isError}
												onChangeInfo={onChangeInfo}
												onChangeList={onChangeList} />
										);
									})
								)}
						</tbody>
					</Table>

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
								<th>문서번호</th>
								<th>문서제목</th>
								<th className="text-center">Plan</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{data.get('deleteList').size === 0 ? (
								<tr>
									<td colSpan={5} className="text-center text-muted font-italic">
										삭제된 문서가 없습니다.
									</td>
								</tr>
							) : (
									data.get('deleteList').map((document, index) => {
										const { _id = '', documentNumber, documentTitle, plan } = document.toJS();

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
