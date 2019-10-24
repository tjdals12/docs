import React from 'react';
import classNames from 'classnames';
import { Row, Col, Button, Table } from 'reactstrap';
import Pagination from 'components/Pagination';
import PropTypes from 'prop-types';

const VendorLetterTable = ({ writable, page, lastPage, data, onPage, onTarget, onOpen, onOpenDetail, className, ...rest }) => {
	const classes = classNames('mt-2 mb-4 bg-white', className);

	return (
		<React.Fragment>
			{
				writable &&
				<Row className="hidden-md hidden-sm -hidden-xs">
					<Col md={4}>
						<Button color="primary" className="mr-2" onClick={onOpen('vendorLetterReceive')}>
							접수
					</Button>
						<Button color="secondary" className="mr-2" onClick={onOpen('vendorLetterAdditionalReceive')}>
							추가 접수
					</Button>
					</Col>
				</Row>
			}

			<Table className={classes} {...rest} bordered striped hover>
				<colgroup>
					<col width="3%" />
					<col width="10%" />
					<col width="15%" />
					<col width="6%" />
					<col width="14%" />
					<col width="14%" />
					<col width="10%" />
					<col width="10%" />
					<col width="10%" />
					<col width="8%" />
				</colgroup>
				<thead>
					<tr>
						<th className="text-center">
							<input type="checkbox" />
						</th>
						<th className="text-center">업체</th>
						<th className="text-center">접수번호</th>
						<th className="text-center">목록</th>
						<th className="text-center">발신</th>
						<th className="text-center">수신</th>
						<th className="text-center">접수일</th>
						<th className="text-center">회신요청일</th>
						<th className="text-center">상태</th>
						<th className="text-center">삭제여부</th>
					</tr>
				</thead>
				<tbody>
					{data.map((transmittal) => {
						const id = transmittal.get('_id');

						return (
							<tr key={id}>
								<td className="text-center">
									<input type="checkbox" value={id} />
								</td>
								<td className="text-center">
									<span
										className="have-link"
										onClick={() => {
											onTarget(transmittal.getIn(['vendor', '_id']));
											onOpen('vendorDetail')();
										}}
									>
										{transmittal.getIn(['vendor', 'vendorName'])} <br />
										({transmittal.getIn(['vendor', 'partNumber'])} /{' '}
										{transmittal.getIn(['vendor', 'part', 'cdSName'])})
									</span>
								</td>
								<td className="text-center">
									<span className="have-link" onClick={onOpenDetail(id)}>
										{transmittal.get('officialNumber')}
									</span>
								</td>
								<td className="text-center">{transmittal.get('documents').size} 개</td>
								<td className="text-center">
									{transmittal.get('senderGb')}: {transmittal.get('sender')}
								</td>
								<td className="text-center">
									{transmittal.get('receiverGb')}: {transmittal.get('receiver')}
								</td>
								<td className="text-center">
									<span className="text-success font-weight-bold">
										{transmittal.get('receiveDate').substr(0, 10)}
									</span>
								</td>
								<td className="text-center">
									<span className="text-success font-weight-bold">
										{transmittal.get('targetDate').substr(0, 10)}
									</span>
								</td>
								<td className="text-center">
									{transmittal.getIn(['letterStatus', -1, 'statusName'])} <br />
									<span className="text-primary">
										({transmittal
											.getIn(['letterStatus', -1, 'timestamp', 'regDt'])
											.substr(0, 10)})
									</span>
								</td>
								<td className="text-center">
									{transmittal.getIn(['cancelYn', 'yn'])} <br />
									{transmittal.getIn(['cancelYn', 'yn']) === 'YES' && (
										<span className="text-danger">
											({transmittal.getIn(['cancelYn', 'deleteDt']).substr(0, 10)})
										</span>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>

			<Pagination
				currentPage={page}
				lastPage={lastPage}
				onPage={onPage}
				size="md"
				aria-label="Page navigation"
				listClassName="flex-row justify-content-end ml-auto"
			/>
		</React.Fragment>
	);
};

VendorLetterTable.propTypes = {
	writable: PropTypes.bool,
	page: PropTypes.number,
	lastPage: PropTypes.number,
	onPage: PropTypes.func, onTarget: PropTypes.func,
	onOpen: PropTypes.func,
	onOpenDetail: PropTypes.func,
	className: PropTypes.string
}

VendorLetterTable.defaultProps = {
	writable: false,
	page: 1,
	lastPage: 1,
	onPage: () => console.warn('Warning: onPage is not defined'),
	onOpen: () => console.warn('Warning: onOpen is not defined'),
	onOpenDetail: () => console.warn('Warning: onOpenDetail is not defined')
}

export default VendorLetterTable;
