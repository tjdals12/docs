import React from 'react';
import { Row, Col } from 'reactstrap';
import NumberWidget from 'components/Widget/NumberWidget';
import IconWidget from 'components/Widget/IconWidget';
import { FaBuilding } from 'react-icons/fa';

const DashboardTemplate = ({ project, managedDocuments, receivedVendorLetters, contractedVendors }) => {
    return (
        <React.Fragment>
            <Row>
                <Col lg={3} md={6} sm={6} xs={12}>
                    <NumberWidget
                        title="프로젝트 기간"
                        subtitle="현재까지"
                        number={`${project.projectPeriod.untilNow} 일`}
                        color="secondary"
                        progress={{ value: project.projectPeriod.percentage, label: `${project.effStaDt.substr(0, 10)} ~ ${project.effEndDt.substr(0, 10)}` }}
                    />
                </Col>

                <Col lg={3} md={6} sm={6} xs={12}>
                    <NumberWidget
                        title="관리 도서"
                        subtitle="접수"
                        number={`${managedDocuments.current} 건`}
                        color="secondary"
                        progress={{ value: managedDocuments.percentage, label: `전체 ${managedDocuments.total} 건` }}
                    />
                </Col>

                <Col lg={3} md={6} sm={6} xs={12}>
                    <NumberWidget
                        title="Transmittal"
                        subtitle="회신"
                        number={`${receivedVendorLetters.replied} 건`}
                        color="secondary"
                        progress={{ value: receivedVendorLetters.percentage, label: `전체 ${receivedVendorLetters.received} 건` }}
                    />
                </Col>

                <Col lg={3} md={6} sm={6} xs={12}>
                    <IconWidget
                        bgColor="secondary"
                        icon={FaBuilding}
                        title="계약 업체"
                        subtitle={`${contractedVendors} 개`}
                    />
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default DashboardTemplate;