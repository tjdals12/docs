import React from 'react';
import { Row, Col } from 'reactstrap';
import UserCard from 'components/Card/UserCard';
import userImg from 'assets/img/users/default.png';
import DocumentIndexOverallCardContainer from 'containers/Card/DocumentIndexOverallCardContainer';
import StatisticsByStatusBarCharCardContainer from 'containers/Card/StatisticsByStatusBarChartCardContainer';
import TransmittalCardContainer from 'containers/Card/TransmittalCardContainer';
import StatisticsByTransmittalBarCharCardContainer from 'containers/Card/StatisticsByTransmittalBarChartCardContainer';
import DocumentInfoCardContainer from 'containers/Card/DocumentInfoCardContainer';
import VendorLetterDetailModalContainer from 'containers/Modal/VendorLetterDetailModalContainer';
import Loader from 'components/Loader';

const IndexesDetailTemplate = ({ loading, id, vendor, manager, currentPage }) => {
	return (
		<React.Fragment>
			{loading && <Loader size={20} margin={10} className="h-100" />}

			{!loading &&
				<Row>
					<Col md={12} className="mb-4">
						<Row>
							<Col md={6} lg={3} className="mb-4">
								<UserCard
									avatar={userImg}
									avatarSize={150}
									title={`${manager.get('name')} ${manager.get('position')}`}
									subtitle={`${manager.get('effStaDt').substr(0, 10)} ~ ${manager.get('effEndDt').substr(0, 10)}`}
									text="담당자"
								/>
							</Col>
							<Col md={6} lg={3} className="mb-4">
								<DocumentIndexOverallCardContainer id={id} />
							</Col>
							<Col md={12} lg={6} className="mb-4">
								<StatisticsByStatusBarCharCardContainer id={id} />
							</Col>
						</Row>
						<Row>
							<Col md={12} lg={6} className="mb-4">
								<TransmittalCardContainer vendor={vendor} />
							</Col>
							<Col md={12} lg={6} className="mb-4">
								<StatisticsByTransmittalBarCharCardContainer vendor={vendor} />
							</Col>
						</Row>
					</Col>
				</Row>
			}

			{!loading &&
				<Row>
					<Col md={12}>
						<DocumentInfoCardContainer id={id} currentPage={currentPage} />
					</Col>
				</Row>
			}
			<VendorLetterDetailModalContainer />
		</React.Fragment>
	);
};

export default IndexesDetailTemplate;
