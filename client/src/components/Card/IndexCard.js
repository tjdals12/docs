import React from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardSubtitle,
	CardText,
	Row,
	Col,
	Progress,
	Button,
	ButtonGroup
} from 'reactstrap';
import { FaCaretRight } from 'react-icons/fa';
import { MdAccessAlarm, MdSearch } from 'react-icons/md';
import Typography from 'components/Typography';
import PropTypes from 'prop-types';

const IndexCard = ({ writable, data, type, onDetail, onOpenQuestion, onTarget, onOpenEdit }) => {
	return (
		<Card className="mb-3">
			<CardHeader className="bg-white">
				<Row>
					<Col md={4} lg={4} className="d-flex align-items-start justify-content-center flex-column">
						<CardTitle className="m-0">
							<Typography type="p" className="mb-2">
								{data.getIn(['vendor', 'partNumber'])} ({data.getIn(['vendor', 'part', 'cdSName'])})
								/ {data.getIn(['vendor', 'vendorName'])}
							</Typography>
							<Typography type="h5" className="title-font">
								{data.getIn(['vendor', 'itemName'])}
							</Typography>
						</CardTitle>
					</Col>
					<Col md={8} lg={4}>
						<div className="d-flex justify-content-between">
							<CardSubtitle className="pb-2 title-font">
								<FaCaretRight size={20} className="pb-1" />계약기간 진행율
							</CardSubtitle>
							<CardSubtitle className="text-secondary small">
								<MdAccessAlarm size={20} className="pb-1 mr-1" />
								{data.getIn(['vendor', 'period', 'leftMonth'])} months left
							</CardSubtitle>
						</div>

						<Progress color="secondary" value={data.getIn(['vendor', 'period', 'percent'])} />

						<CardText className="d-flex justify-content-between">
							<Typography tag="span" className="text-left text-muted small">
								{data.getIn(['vendor', 'effStaDt']).substr(0, 10)} ~{' '}
								{data.getIn(['vendor', 'effEndDt']).substr(0, 10)}
							</Typography>
							<Typography tag="span" className="text-right text-muted small">
								{data.getIn(['vendor', 'period', 'percent'])}%
							</Typography>
						</CardText>
					</Col>

					{type === 'list' && (
						<Col md={4} className="d-flex align-items-center justify-content-end">

							{
								writable &&
								<ButtonGroup className="mr-4">
									<Button
										color="primary"
										onClick={() => {
											onTarget(data.get('_id'));

											onOpenEdit(data.get('_id'))();
										}}
									>
										수정
								</Button>
									<Button
										color="danger"
										onClick={() => {
											onTarget(data.get('_id'));

											onOpenQuestion();
										}}
									>
										삭제
									</Button>
								</ButtonGroup>
							}

							<MdSearch size={25} onClick={onDetail(data.get('_id'))} className="can-click hover" />
						</Col>
					)}

					{type === 'detail' && (
						<Col md={4} className="text-right hidden-lg hidden-md hidden-sm hidden-xs">
							<Typography type="p" className="text-danger">
								등록: {data.getIn(['timestamp', 'regId'])} ({data.getIn(['timestamp', 'regDt'])})
							</Typography>
							<Typography type="p" className="text-danger">
								수정: {data.getIn(['timestamp', 'updId'])} ({data.getIn(['timestamp', 'updDt'])})
							</Typography>
						</Col>
					)}
				</Row>
			</CardHeader>
		</Card>
	);
};

IndexCard.propTypes = {
	data: PropTypes.object,
	onDetail: PropTypes.func,
	onOpenQuestion: PropTypes.func,
	onTarget: PropTypes.func,
	onOpenEdit: PropTypes.func
};

IndexCard.defaultProps = {
	onDetail: () => console.warn('Warning: onDetail is not defined'),
	onOpenQuestion: () => console.warn('Warning: onOpenQuestion is not defined'),
	onTarget: () => console.warn('Warning: onTarget is not defined'),
	onOpenEdit: () => console.warn('Warning: onOpenEdit is not defined')
};

export default IndexCard;
