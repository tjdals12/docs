import React from 'react';
import ScrollToTop from 'components/ScrollToTop';
import Page from 'components/Page';

import { Row, Col } from 'reactstrap';
import NumberWidget from 'components/Widget/NumberWidget';
import IconWidget from 'components/Widget/IconWidget';
import { FaBuilding } from 'react-icons/fa';

const DashboardPage = (props) => {
	return (
		<Page title="Dashboard" breadcrumbs={[{ name: 'Dashboard', active: true }]}>
			<ScrollToTop>
				<Row>
					<Col lg={3} md={6} sm={6} xs={12}>
						<NumberWidget
							title="프로젝트 기간"
							subtitle="현재까지"
							number="87 일"
							color="secondary"
							progress={{ value: 32, label: '2018-02-23 ~ 2021-07-12' }}
						/>
					</Col>

					<Col lg={3} md={6} sm={6} xs={12}>
						<NumberWidget
							title="관리 도서"
							subtitle="접수"
							number="2,781 건"
							color="secondary"
							progress={{ value: 32, label: '전체 28,921 건' }}
						/>
					</Col>

					<Col lg={3} md={6} sm={6} xs={12}>
						<NumberWidget
							title="Transmittal"
							subtitle="회신"
							number="78 건"
							color="secondary"
							progress={{ value: 79, label: '전체 102 건' }}
						/>
					</Col>

					<Col lg={3} md={6} sm={6} xs={12}>
						<IconWidget
							bgColor="secondary"
							icon={FaBuilding}
							title="계약 업체"
							subtitle="50 개"
						/>
					</Col>
				</Row>
			</ScrollToTop>
		</Page>
	);
};

export default DashboardPage;
