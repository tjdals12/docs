import React from 'react';
import classNames from 'classnames';
import { Row, Col, Button, Table } from 'reactstrap';
import Pagination from 'components/Pagination';
import PropTypes from 'prop-types';

const LetterTable = ({ writable, page, lastPage, data, onOpen, onOpenDetail, onPage, className, ...rest }) => {
	const classes = classNames('mt-2 mb-4 bg-white', classNames);

	return (
		<React.Fragment>
			{
				writable &&
				<Row className="hidden-md hidden-sm hidden-xs">
					<Col md={4}>
						<Button color="primary" className="mr-2" onClick={onOpen('letterAdd')}>
							ADD
					</Button>
					</Col>
				</Row>
			}
			<Table className={classes} {...rest} bordered striped hover>
				<colgroup>
					<col width="3%" />
					<col width="5%" />
					<col width="17%" />
					<col width="30%" />
					<col width="10%" />
					<col width="10%" />
					<col width="10%" />
					<col width="10%" />
					<col width="5%" />
				</colgroup>
				<thead>
					<tr>
						<th className="text-center">
							<input type="checkbox" />
						</th>
						<th className="text-center">구분</th>
						<th className="text-center">공식번호</th>
						<th className="text-center">제목</th>
						<th className="text-center">발신</th>
						<th className="text-center">수신</th>
						<th className="text-center">발신일</th>
						<th className="text-center">회신요청일</th>
						<th className="text-center">회신</th>
					</tr>
				</thead>
				<tbody>
					{data.map((transmittal) => {
						const id = transmittal.get('_id');

						return (
							<tr key={id}>
								<td className="text-center">
									<input type="checkbox" />
								</td>
								<td className="text-center">
									{transmittal.get('letterGb') === 'E-mail' ? (
										<span className="text-info font-weight-bold">
											{transmittal.get('letterGb')}
										</span>
									) : (
											<span className="text-secondary font-weight-bold">
												{transmittal.get('letterGb')}
											</span>
										)}
								</td>
								<td className="text-center">{transmittal.get('officialNumber')}</td>
								<td className="text-left">
									<span className="have-link" onClick={onOpenDetail(id)}>
										{transmittal.get('letterTitle')}
									</span>
								</td>
								<td className="text-center">{transmittal.get('sender')}</td>
								<td className="text-center">{transmittal.get('receiver')}</td>
								<td className="text-center">
									<span className="text-success font-weight-bold">
										{transmittal.get('sendDate').substr(0, 10)}
									</span>
								</td>
								<td className="text-center">
									{transmittal.get('replyRequired') === 'YES' ? (
										<span className="text-success font-weight-bold">
											{transmittal.get('targetDate').substr(0, 10)}
										</span>
									) : (
											<span className="text-danger">회신 필요없음</span>
										)}
								</td>
								<td className="text-center">
									{transmittal.get('replyRequired') === 'YES' ? transmittal.get('replyYn') : '-'}
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

LetterTable.propTypes = {
	writable: PropTypes.bool,
	page: PropTypes.number,
	lastPage: PropTypes.number,
	onOpen: PropTypes.func,
	onOpenDetail: PropTypes.func,
	onPage: PropTypes.func,
	className: PropTypes.string
}

LetterTable.defaultProps = {
	writable: false,
	page: 1,
	lastPage: 1,
	onOpen: () => console.warn('Warning: onOpen is not defined'),
	onOpenDetail: () => console.warn('Warning: onOpenDetail is not defined'),
	onPage: () => console.warn('Warning: onPage is not defined')
}

export default LetterTable;
