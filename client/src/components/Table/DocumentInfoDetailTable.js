import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import { MdSubdirectoryArrowRight } from 'react-icons/md';
import Typography from 'components/Typography';

const DocumentInfoDetailTable = ({ data, onOpen, className, ...rest }) => {
	const documentInfos = data.toJS();

	return (
		<React.Fragment>
			<Table className={className} {...rest}>
				<colgroup>
					<col width="25%" />
					<col width="35%" />
					<col width="15%" />
					<col width="10%" />
					<col width="15%" />
				</colgroup>
				<thead>
					<tr>
						<th>No.</th>
						<th>Title</th>
						<th className="text-left">Date</th>
						<th className="text-center">삭제여부</th>
						<th className="text-center">등록정보</th>
					</tr>
				</thead>
				<tbody>
					{documentInfos.map(({ documentInfo }, index) => {
						return (
							<React.Fragment key={index}>
								<tr className="border-right">
									<td>{documentInfo.documentNumber}</td>
									<td>{documentInfo.documentTitle}</td>
									<td className="text-left">{documentInfo.plan.substr(0, 10)} 예정</td>
									<td className="text-center">
										{documentInfo.removeYn.yn === 'NO' ? (
											documentInfo.removeYn.yn
										) : (
											`${documentInfo.removeYn.yn} (${documentInfo.removeYn.deleteDt.substr(
												0,
												10
											)})`
										)}
									</td>
									<td className="text-danger text-right">
										{documentInfo.timestamp.regId} ({documentInfo.timestamp.regDt.substr(0, 10)})<br />
										{documentInfo.timestamp.updId} ({documentInfo.timestamp.updDt.substr(0, 10)})
									</td>
								</tr>
								{documentInfo.trackingDocument.map((document) => {
									const documentStatus = document.documentStatus[document.documentStatus.length - 1];

									return (
										<tr key={document._id} className="bg-light">
											<td>
												<MdSubdirectoryArrowRight size={25} className="pb-2 text-secondary" />
												<span className="pl-2">{document.documentNumber}</span>
											</td>
											<td
												className="pl-4 text-primary can-click have-link"
												onClick={onOpen({ id: document._id })}
											>
												{document.documentTitle}
												<Typography tag="span" className="pl-5">
													{`Rev.${document.documentRev}`}
												</Typography>
											</td>
											<td className="pl-4 text-left">
												{document.timestamp.regDt.substr(0, 10)} 접수<br />
											</td>
											<td colSpan={2} className="text-left">
												{documentStatus.statusName}{' '}
												<span
													className="text-primary can-click have-link"
													onClick={onOpen({ id: document._id })}
												>
													({documentStatus.timestamp.regDt.substr(0, 10)})
												</span>
											</td>
										</tr>
									);
								})}
							</React.Fragment>
						);
					})}
				</tbody>
			</Table>
		</React.Fragment>
	);
};

DocumentInfoDetailTable.propTypes = {
	data: PropTypes.object,
	className: PropTypes.string
};

export default DocumentInfoDetailTable;
