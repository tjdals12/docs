import React from 'react';
import ScrollToTop from 'components/ScrollToTop';
import Page from 'components/Page';

import { Row, Col } from 'reactstrap';
import NumberWidget from 'components/Widget/NumberWidget';
import OverallCard from 'components/Card/OverallCard';
import BarChartCard from 'components/Card/BarChartCard';
import InfiniteCalendar from 'react-infinite-calendar';

import { transmittalsByVendor, transmittalsByStatus, vendors } from 'demos/dashboard';

const DashboardPage = (props) => {
	return (
		<ScrollToTop>
			<Page title="Dashboard" breadcrumbs={[{ name: 'Dashboard', active: true }]}>
				<Row>
					<Col lg={4} md={6} sm={6} xs={12}>
						<NumberWidget
							title="프로젝트 기간"
							subtitle="현재까지"
							number="87 일"
							color="secondary"
							progress={{ value: 32, label: '2018-02-23 ~ 2021-07-12' }}
						/>
					</Col>

					<Col lg={4} md={6} sm={6} xs={12}>
						<NumberWidget
							title="관리 도서"
							subtitle="접수"
							number="2,781 건"
							color="secondary"
							progress={{ value: 32, label: '전체 28,921 건' }}
						/>
					</Col>

					<Col lg={4} md={6} sm={6} xs={12}>
						<NumberWidget
							title="Transmittal"
							subtitle="회신"
							number="78 건"
							color="secondary"
							progress={{ value: 79, label: '전체 102 건' }}
						/>
					</Col>

					{/* <Col lg={3} md={6} sm={6} xs={12}>
						<NumberWidget
							title="Transmittal"
							subtitle="회신"
							number="78 건"
							color="secondary"
							progress={{ value: 79, label: '전체 102 건' }}
						/>
					</Col> */}
				</Row>

				<Row>
					<Col lg={3} md={12} sm={12} xs={12}>
						<OverallCard title="계약 업체" data={vendors} />
					</Col>
					<Col lg={9} md={12} sm={12} xs={12}>
						<BarChartCard title="업체별 In / Out 통계" data={transmittalsByVendor} />
					</Col>
				</Row>

				<Row>
					<Col lg={4} md={12} sm={12} xs={12}>
						<InfiniteCalendar
							width='100%'
							theme={{
								headerColor: '#6a82fb',
								weekdayColor: '#758af5',
								todayColor: '#6a82fb',
								selectionColor: '#6a82fb'
							}}
							locale={{
								headerFormat: 'MM / DD',
								weekdays: ['일', '월', '화', '수', '목', '금', '토']
							}}
						/>
					</Col>
					<Col lg={8} md={12} sm={12} xs={12}>
						<BarChartCard title="상태별 통계" data={transmittalsByStatus} />
					</Col>
				</Row>
			</Page>

		</ScrollToTop>
	);
};

export default DashboardPage;
