import React from 'react';
import { Table } from 'reactstrap';
import classNames from 'classnames';
import Loader from 'components/Loader';
import PropTypes from 'prop-types';
import Pagination from 'components/Pagination';

const DocumentTable = ({
	loading,
	page,
	lastPage,
	documents,
	checkedList,
	onOpenDetail,
	onChecked,
	onCheckedAll,
	onChange,
	onSearch,
	onPage,
	className,
	...rest
}) => {
	const classes = classNames('mb-4 bg-white', className);

	return (
		<React.Fragment>
			{loading && <Loader size={20} margin={10} />}

			{!loading && (
				<Table className={classes} {...rest}>
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
						{documents.map((document) => {
							let { 
								_id, 
								documentGb, 
								documentNumber, 
								documentTitle, 
								documentRev, 
								documentStatus, 
								holdYn, 
								deleteYn, 
								level, 
								timestamp 
							} = document;

							return (
								<tr key={_id}>
									<td className="text-center">
										<input
											type="checkbox"
											value={_id}
											checked={checkedList.includes(_id)}
											onChange={onChecked}
										/>
									</td>
									<td className="text-center">{documentGb.cdSName}</td>
									<td>{documentNumber}</td>
									<td>
										<span className="have-link" onClick={() => onOpenDetail(_id)}>
											{documentTitle}
										</span>
									</td>
									<td className="text-center">{documentRev}</td>
									<td className="text-center">{timestamp.regDt.substr(0, 10)}</td>
									<td className="text-center">
										{documentStatus[documentStatus.length - 1].statusName}
										<br />
										<small className="text-primary">
											{documentStatus[documentStatus.length - 1].timestamp.regDt.substr(0, 10)}
										</small>
									</td>
									<td className="text-center">
										{holdYn[holdYn.length - 1].yn}
										<br />
										{holdYn[holdYn.length - 1].yn === 'YES' && (
											<small className="text-danger font-weight-bold">
												{holdYn[holdYn.length - 1].effStaDt.substr(0, 10)}
											</small>
										)}
									</td>
									<td className="text-center">
										{deleteYn.yn}
										<br />
										{deleteYn.yn === 'YES' && (
											<small className="text-danger font-weight-bold">
												{deleteYn.deleteDt.substr(0, 10)}
											</small>
										)}
									</td>
									<td className="text-center">
										{level.number > 3 ? <span className="text-danger">{level.description}</span>
											: level.number === 3 ? <span className="text-info">{level.description}</span>
												: <span className="text-success">{level.description}</span>}
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
					size="md"
					aria-label="Page navigation"
					listClassName="flex-row justify-content-end ml-auto"
				/>
			)}
		</React.Fragment>
	);
};

DocumentTable.propTypes = {
	loading: PropTypes.bool,
	page: PropTypes.number,
	lastPage: PropTypes.number,
	documents: PropTypes.array.isRequired,
	checkedList: PropTypes.array,
	onOpenDetail: PropTypes.func,
	onChecked: PropTypes.func,
	onCheckedAll: PropTypes.func,
	onChange: PropTypes.func,
	onSearch: PropTypes.func,
	onPage: PropTypes.func,
	className: PropTypes.string
};

DocumentTable.defaultProps = {
	loading: false,
	page: 1,
	lastPage: 1,
	checkedList: [],
	onOpenDetail: () => console.warn('Warning: onOpenDetail is not defined'),
	onChecked: () => console.warn('Warning: onChecked is not defined'),
	onCheckedAll: () => console.warn('Warning: onCheckedAll is not defined'),
	onChange: () => console.warn('Warning: onChange is not defined'),
	onSearch: () => console.warn('Warning: onSearch is not defined'),
	onPage: () => console.warn('Warning: onPage is not defined')
}

export default DocumentTable;
