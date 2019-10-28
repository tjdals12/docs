import React from 'react';
import { Row, Col, Card } from 'reactstrap';
import LoginFormContainer from 'containers/Form/LoginFormContainer';

const LoginPage = () => {
    return (
        <Row style={{
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Col md={6} lg={4}>
                <Card body>
                    <LoginFormContainer />
                </Card>
            </Col>
        </Row>
    )
}

export default LoginPage;