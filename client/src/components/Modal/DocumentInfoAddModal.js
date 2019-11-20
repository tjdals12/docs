import React from 'react';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Form,
	FormGroup,
	Label,
	Input,
	Col,
	Button,
	ButtonGroup
} from 'reactstrap';
import { MdClose } from 'react-icons/md';
import { TiPlus, TiMinus } from 'react-icons/ti';
import PropTypes from 'prop-types';
import { Table as VirtualTable, Column as VirtualColumn } from 'react-virtualized';
import Loader from 'components/Loader';

const DocumentInfoAddModal = ({
	loading,
	vendorList,
	gbs,
	infos,
	error,
	infosError,
	isOpen,
	onClose,
	onTarget,
	onChange,
	onExcelUpload,
	onAddInfoForm,
	onDeleteInfoForm,
	onAddInfo,
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
				문서 목록 > 문서 추가
			</ModalHeader>
			<ModalBody>
				<Form onSubmit={(e) => e.preventDefault()}>
					<FormGroup row>
						<Col md={12}>
							<Label for="vendor">업체</Label>
							<Input type="select" id="vendor" name="vendor" onChange={onTarget} invalid={error}>
								<option>--- 업체를 선택해주세요. ---</option>
								{vendorList.map((vendor) => (
									<option key={vendor.get('_id')} value={vendor.get('_id')}>
										{vendor.getIn(['vendor', 'vendorName'])} ({vendor.getIn(['vendor', 'part', 'cdSName'])},{' '}
										{vendor.getIn(['vendor', 'partNumber'])})
									</option>
								))}
							</Input>
						</Col>
					</FormGroup>
					<FormGroup row>
						<Label for="list" md={2}>
							문서목록
						</Label>
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
						rowGetter={({ index }) => infos[index]}
						rowCount={infos.length}
					>
						<VirtualColumn
							label="#"
							dataKey="index"
							className="p-2"
							cellRenderer={({ dataKey, rowData, rowIndex }) => {
								const isError = infosError.indexOf(rowData[dataKey]) > -1;

								return <span className={`${isError ? 'text-danger title-font' : 'font-weight-bold'} font-italic`}>{rowIndex + 1}.</span>
							}}
						/>
						<VirtualColumn
							label="문서번호"
							dataKey="documentNumber"
							className="p-2"
							cellRenderer={({ dataKey, rowData }) => (
								<Input
									type="text"
									name="documentNumber"
									value={rowData[dataKey]}
									onChange={onChange(rowData['index'])}
								/>
							)}
							width={width * 0.25}
						/>
						<VirtualColumn
							label="문서제목"
							dataKey="documentTitle"
							className="p-2"
							cellRenderer={({ dataKey, rowData }) => (
									<Input
										type="text"
										name="documentTitle"
										value={rowData[dataKey]}
										onChange={onChange(rowData['index'])}
									/>
								)
							}
							width={width * 0.35}
						/>
						<VirtualColumn
							label="구분"
							dataKey="documentGb"
							className="p-2"
							cellRenderer={({ dataKey, rowData }) => (
								<Input
									type="select"
									name="documentGb"
									value={rowData[dataKey]}
									onChange={onChange(rowData['index'])}
								>
									<option value="">-- 구분 --</option>
									{gbs.get('cdMinors').map((gb) => (
										<option key={gb.get('_id')} value={gb.get('_id')}>
											{gb.get('cdSName')}
										</option>
									))}
								</Input>
							)}
							width={width * 0.10}
						/>
						<VirtualColumn
							label="Plan"
							dataKey="plan"
							className="p-2"
							cellRenderer={({ dataKey, rowData }) => (
								<Input
									type="date"
									name="plan"
									value={rowData[dataKey]}
									onChange={onChange(rowData['index'])}
								/>
							)}
							width={width * 0.2}
						/>
						<VirtualColumn
							label=""
							dataKey="index"
							className="p-2 text-center"
							cellRenderer={({ dataKey, rowData }) => (
								<MdClose
									className="can-click text-danger"
									onClick={onDeleteInfoForm(rowData[dataKey])}
								/>
							)}
							width={width * 0.05}
						/>
					</VirtualTable>

					<ButtonGroup className="d-block text-center">
						<Button color="primary" onClick={onAddInfoForm}>
							<TiPlus />
						</Button>
						<Button color="secondary" onClick={onDeleteInfoForm(-1)}>
							<TiMinus />
						</Button>
					</ButtonGroup>
				</Form>
			</ModalBody>
			<ModalFooter className="bg-light">
				{loading
					? <Loader size={20} margin={10} />
					: ([
						<Button key="add" color="primary" onClick={onAddInfo}>
							추가
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

DocumentInfoAddModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onTarget: PropTypes.func,
	onChange: PropTypes.func,
	onExcelUpload: PropTypes.func,
	onAddInfoForm: PropTypes.func,
	onDeleteInfoForm: PropTypes.func,
	onAddInfo: PropTypes.func,
	className: PropTypes.string
};

DocumentInfoAddModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onTarget: () => console.warn('Warning: onClose is not defined'),
	onChange: () => console.warn('Warning: onClose is not defined'),
	onExcelUpload: () => console.warn('Warning: onClose is not defined'),
	onAddInfoForm: () => console.warn('Warning: onClose is not defined'),
	onDeleteInfoForm: () => console.warn('Warning: onClose is not defined'),
	onAddInfo: () => console.warn('Warning: onClose is not defined')
};

export default DocumentInfoAddModal;
