import React from 'react';
import classNames from 'classnames';
import { Table } from 'reactstrap';
import Pagination from 'components/Pagination';
import Loader from 'components/Loader';

const DocumentInfoTable = ({
	loading,
	page,
	lastPage,
	data,
	checkedList,
	onPage,
	onTargetVendor,
	onOpen,
	onOpenDetail,
	onChecked,
	onCheckedAll,
	className,
	...rest
}) => {
	const classes = classNames('mb-4 bg-white', className);

	return (
		<React.Fragment>
			{loading && <Loader size={20} margin={10} />}

			{!loading && (
				<Table className={classes} {...rest}>
					<colgroup>
						<col width="3%" />
						<col width="15%" />
						<col width="6%" />
						<col width="16%" />
						<col width="30%" />
						<col width="8%" />
						<col width="5%" />
						<col width="17%" />
					</colgroup>
					<thead>
						<tr>
							<th className="text-center">
								<input type="checkbox" onChange={onCheckedAll}/>
							</th>
							<th className="text-center">업체</th>
							<th className="text-center">구분</th>
							<th className="text-center">문서번호</th>
							<th className="text-center">문서명</th>
							<th className="text-center">삭제여부</th>
							<th className="text-center">접수</th>
							<th className="text-center">등록정보</th>
						</tr>
					</thead>
					<tbody>
						{data.map((info, index) => {
							const id = info.get('_id');

							return (
								<tr key={index}>
									<td className="text-center">
										<input type="checkbox" value={id} checked={checkedList.includes(id)} onChange={onChecked}/>
									</td>
									<td className="text-center">
										<span
											className={`can-click have-link ${info.getIn(['vendor', 'deleteYn', 'yn']) === 'YES' && 'text-line-through text-danger'}`}
											onClick={() => {
												onTargetVendor({ id: info.getIn(['vendor', '_id']) });
												onOpen('vendorDetail')();
											}}
										>
											{info.getIn(['vendor', 'vendorName'])}
											<br />
											({info.getIn(['vendor', 'partNumber'])} /{' '}
											{info.getIn(['vendor', 'part', 'cdSName'])})
										</span>
									</td>
									<td className="text-center">{info.getIn(['documentGb', 'cdSName'])}</td>
									<td>{info.get('documentNumber')}</td>
									<td>
										<span className="can-click have-link" onClick={onOpenDetail(id)}>
											{info.get('documentTitle')}
										</span>
									</td>
									<td className="text-center">
										{info.getIn(['removeYn', 'yn'])}
										<br />
										{info.getIn(['removeYn', 'yn']) === 'YES' && (
											<small className="text-danger font-weight-bold">
												{info.getIn(['removeYn', 'deleteDt']).substr(0, 10)}
											</small>
										)}
									</td>
									<td className="text-center">
										<span className="text-success font-weight-bold can-click have-link">
											{info.get('trackingDocument').size} 건
										</span>
									</td>
									<td className="text-right">
										<span className="text-danger">
											등록: {info.getIn(['timestamp', 'regId'])} ({info.getIn(['timestamp', 'regDt'])})
										</span>
										<br />
										<span className="text-danger">
											수정: {info.getIn(['timestamp', 'updId'])} ({info.getIn(['timestamp', 'updDt'])})
										</span>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			)}

			{!loading && (
				<Pagination
					currentPage={page}
					lastPage={lastPage}
					onPage={onPage}
					aria-label="Page navigation"
					listClassName="flex-row justify-content-end ml-auto"
				/>
			)}
		</React.Fragment>
	);
};

export default DocumentInfoTable;
