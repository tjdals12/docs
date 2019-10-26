import React from 'react';
import { Col, Row, Button, Table } from 'reactstrap';
import classNames from 'classnames';
import Loader from 'components/Loader';
import PropTypes from 'prop-types';
import Pagination from 'components/Pagination';


const DocumentTable = ({
	loading,
	writable,
	search,
	page,
	lastPage,
	data,
	onOpenAdd,
	onDelete,
	onOpenDetail,
	checkedList,
	onChecked,
	onCheckedAll,
	onChange,
	onSearch,
	onPage,
	className,
	...rest
}) => {
	const classes = classNames('mt-2 mb-4 bg-white', className);

	return (
		<React.Fragment>
			{writable && <Row className="hidden-md hidden-sm hidden-xs">
				<Col md={4}>
					<Button color="primary" className="mr-2" onClick={onOpenAdd}>
						추가
					</Button>

					<Button color="secondary" onClick={onDelete}>
						삭제
					</Button>
				</Col>
			</Row>}

			{loading && (
				<Loader size={20} margin={10} />
			)}

			{!loading && ([
				<Table className={classes} {...rest} key='table'>
					<thead>
						<tr>
							<th width="3%" className="text-center">
								<input type="checkbox" onChange={onCheckedAll} />
							</th>
							<th width="6%" className="text-center">
								구분
					</th>
							<th width="15%" className="text-center">
								문서번호
					</th>
							<th width="25%" className="text-center">
								문서명
					</th>
							<th width="5%" className="text-center">
								Rev.
					</th>
							<th width="10%" className="text-center">
								접수일
					</th>
							<th width="" className="text-center">
								상태
					</th>
							<th width="8%" className="text-center">
								보류여부
					</th>
							<th width="7%" className="text-center">
								삭제여부
					</th>
							<th width="6%" className="text-center">
								중요도
					</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item) => {
							let { _id: id, level } = item.toJS();

							return (
								<tr key={id}>
									<td className="text-center">
										<input
											type="checkbox"
											value={id}
											checked={checkedList.includes(id)}
											onChange={onChecked}
										/>
									</td>
									<td className="text-center">{item.getIn(['documentGb', 'cdSName'])}</td>
									<td>{item.get('documentNumber')}</td>
									<td>
										<span className="have-link" onClick={onOpenDetail({ id })}>
											{item.get('documentTitle')}
										</span>
									</td>
									<td className="text-center">{item.get('documentRev')}</td>
									<td className="text-center">{item.getIn(['timestamp', 'regDt']).substr(0, 10)}</td>
									<td className="text-center">
										{item.getIn(['documentStatus', -1, 'statusName'])}
										<br />
										<small className="text-primary">
											({item.getIn(['documentStatus', -1, 'timestamp', 'regDt']).substr(0, 10)})
								</small>
									</td>
									<td className="text-center">
										{item.getIn(['holdYn', -1, 'yn'])}
										<br />
										{item.getIn(['holdYn', -1, 'yn']) === 'YES' && (
											<small className="text-danger font-weight-bold">
												({item.getIn(['holdYn', -1, 'effStaDt']).substr(0, 10)})
									</small>
										)}
									</td>
									<td className="text-center">
										{item.getIn(['deleteYn', 'yn'])}
										<br />
										{item.getIn(['deleteYn', 'yn']) === 'YES' && (
											<small className="text-danger font-weight-bold">
												({item.getIn(['deleteYn', 'deleteDt']).substr(0, 10)})
									</small>
										)}
									</td>
									<td className="text-center">
										{level.number > 3 ? (
											<span className="text-danger">{level.description}</span>
										) : level.number === 3 ? (
											<span className="text-info">{level.description}</span>
										) : (
													<span className="text-success">{level.description}</span>
												)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>,

				<Pagination
					key="pagination"
					currentPage={page}
					lastPage={lastPage}
					onPage={onPage}
					size="md"
					aria-label="Page navigation"
					listClassName="flex-row justify-content-end ml-auto"
				/>
			])}
		</React.Fragment>
	);
};

DocumentTable.propTypes = {
	writable: PropTypes.bool,
	page: PropTypes.number,
	lastPage: PropTypes.number
};

DocumentTable.defaultProps = {
	loading: false,
	writable: false,
	page: 1,
	lastPage: 1
}

export default DocumentTable;
