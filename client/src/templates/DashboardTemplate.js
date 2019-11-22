import React from 'react';
import { Row, Col } from 'reactstrap';
import NumberWidget from 'components/Widget/NumberWidget';
import IconWidget from 'components/Widget/IconWidget';
import { FaBuilding } from 'react-icons/fa';
import { 
    ResponsiveContainer, 
    LineChart, 
    CartesianGrid, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Legend, 
    Line
} from 'recharts';
import PieChartCard from 'components/Card/PieChartCard';

const demo = [
    {
        "name": "2019-02",
        "기계": 8,
        "장치": 15,
        "전기": 4,
        "계장": 7,
        "배관": 15,
        "소방": 3,
        "토목": 1,
        "HVAC": 5,
    },
    {
        "name": "2019-03",
        "기계": 4,
        "장치": 9,
        "전기": 4,
        "계장": 5,
        "배관": 34,
        "소방": 1,
        "건축": 2,
        "HVAC": 1,
    },
    {
        "name": "2019-04",
        "기계": 2,
        "장치": 3,
        "전기": 1,
        "계장": 2,
        "소방": 6,
        "건축": 1,
        "토목": 2,
        "HVAC": 4,
    },
    {
        "name": "2019-04",
        "기계": 11,
        "장치": 24,
        "전기": 8,
        "계장": 11,
        "배관": 24,
        "소방": 2,
        "건축": 2,
        "HVAC": 0,
    },
    {
        "name": "전체",
        "기계": 25,
        "장치": 51,
        "전기": 17,
        "계장": 25,
        "배관": 73,
        "소방": 12,
        "건축": 5,
        "토목": 3,
        "HVAC": 10,
    },
]

const demo2 = [
    { name: "기계", value: 26, color: '#8884d8' },
    { name: "장치", value: 42, color: '#82ca9d' },
    { name: "전기", value: 18, color: '#e64980' },
    { name: "계장", value: 22, color: '#4dabf7' },
    { name: "배관", value: 52, color: '#1098ad' },
    { name: "소방", value: 8, color: '#40c057' },
    { name: "건축", value: 5, color: '#ffe066' },
    { name: "토목", value: 2, color: '#d9480f' },
    { name: "HVAC", value: 8, color: '#5f3dc4' },
]

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

            <Row>
                <Col md={7}>
                    <ResponsiveContainer minHeight={400}>
                        <LineChart data={demo}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="기계" stroke="#8884d8" strokeWidth={2} />
                            <Line type="monotone" dataKey="장치" stroke="#82ca9d" strokeWidth={2} />
                            <Line type="monotone" dataKey="전기" stroke="#e64980" strokeWidth={2} />
                            <Line type="monotone" dataKey="계장" stroke="#4dabf7" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Col>

                <Col md={5}>
                    <PieChartCard data={demo2} />
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default DashboardTemplate;