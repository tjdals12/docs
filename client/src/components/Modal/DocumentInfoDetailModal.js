import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table } from 'reactstrap';
import PropTypes from 'prop-types';

const DocumentInfoDetailModal = ({
	isOpen,
	data,
	onClose,
	onTarget,
	onOpenVendor,
	onOpenDetail,
	className,
	...rest
}) => {
	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose}
			className={className}
			contentClassName="border-right rounded"
			{...rest}
			size="xl"
		>
			<ModalHeader className="bg-light" toggle={onClose}>
				Document Info 상세
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
								업체
							</th>
							<td>
								<span
									className="have-link"
									onClick={() => {
										onTarget(data.getIn([ 'vendor', '_id' ]));
										onOpenVendor();
									}}
								>
									{data.getIn([ 'vendor', 'vendorName' ])} ({data.getIn([ 'vendor', 'partNumber' ])} /{' '}
									{data.getIn([ 'vendor', 'part', 'cdSName' ])}){' '}
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
							<th scope="row" className="text-right bg-light">
								접수예정일
							</th>
							<td>{data.get('plan').substr(0, 10)}</td>
							<th scope="row" className="text-right bg-light">
								삭제여부
							</th>
							<td>
								{data.getIn([ 'removeYn', 'yn' ])}{' '}
								{data.getIn([ 'removeYn', 'yn' ]) === 'YES' && (
									<span className="text-danger">({data.getIn([ 'removeYn', 'deleteDt' ])})</span>
								)}
							</td>
						</tr>
						<tr className="border-bottom">
							<td colSpan={4}>
								<Table bordered className="mb-0">
									<thead>
										<tr className="border-bottom" style={{ background: '#e7f5ff' }}>
											<th className="text-center">문서번호</th>
											<th className="text-center">문서명</th>
											<th className="text-center">Rev.</th>
											<th className="text-center">접수일</th>
											<th className="text-right">상태</th>
										</tr>
									</thead>
									<tbody>
										{data.get('trackingDocument').size === 0 ? (
											<tr>
												<td colSpan={5} className="text-center font-italic">
													접수된 문서가 없습니다.
												</td>
											</tr>
										) : (
											data.get('trackingDocument').map((document, index) => (
												<tr key={index} className="border-bottom">
													<td className="text-center">{document.get('documentNumber')}</td>
													<td className="text-center">
														<span
															className="have-link"
															onClick={onOpenDetail(document.get('_id'))}
														>
															{document.get('documentTitle')}
														</span>
													</td>
													<td className="text-center">{document.get('documentRev')}</td>
													<td className="text-center">
														{document.getIn([ 'timestamp', 'regDt' ]).substr(0, 10)}
													</td>
													<td className="text-right">
														{document.getIn([ 'documentStatus', -1, 'statusName' ])}{' '}
														<span className="text-danger">
															({document
																.getIn([ 'documentStatus', -1, 'timestamp', 'regDt' ])
																.substr(0, 10)})
														</span>
													</td>
												</tr>
											))
										)}
									</tbody>
								</Table>
							</td>
						</tr>
						<tr>
							<th scope="row" className="text-right bg-light">
								등록정보
							</th>
							<td colSpan={3}>
								<span className="text-danger">
									등록: {data.getIn([ 'timestamp', 'regId' ])} ({data.getIn([ 'timestamp', 'regDt' ])})
								</span>
								<br />
								<span className="text-danger">
									수정: {data.getIn([ 'timestamp', 'updId' ])} ({data.getIn([ 'timestamp', 'updDt' ])})
								</span>
							</td>
						</tr>
					</tbody>
				</Table>
			</ModalBody>
			<ModalFooter className="bg-light">
				<Button className="secondary" onClick={onClose}>
					CANCEL
				</Button>
			</ModalFooter>
		</Modal>
	);
};

DocumentInfoDetailModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onTarget: PropTypes.func,
	onOpenVendor: PropTypes.func,
	onOpenDetail: PropTypes.func,
	className: PropTypes.string
};

DocumentInfoDetailModal.defaultProps = {
	isOpen: false,
	onClose: () => console.warn('Warning: onClose is not defined'),
	onTarget: () => console.warn('Warning: onTarget is not defined'),
	onOpenVendor: () => console.warn('Warning: onOpenVendor is not defined'),
	onOpenDetail: () => console.warn('Warning: onOpenDetail is not defined')
};

export default DocumentInfoDetailModal;
