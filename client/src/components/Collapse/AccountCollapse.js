import React from 'react';
import classNames from 'classnames';
import { Collapse, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import Avatar from 'components/Avatar';
import PropTypes from 'prop-types';

const demo = [
    { index: 1, userId: 'master', username: 'Master', description: 'Master Account', userType: 'Admin' }
]

const colStyle = {
    maxHeight: '400px',
    overflow: 'scroll',
    margin: 0
};

const makeHeaderCell = ({ title, className }) => {
    const classes = classNames('k-link title-font', className);

    return <span className={classes}>{title}</span>;
};

const AccountCollapse = ({ isOpen }) => {
    return (
        <Collapse isOpen={isOpen} className="mt-3 pt-4 border-top">
            <Row style={{ minHeight: '400px' }}>
                <Col md={4} style={colStyle}>
                    <Grid
                        data={demo}
                        pageable
                        total={25}
                        take={10}
                        skip={0}
                        className="h-100 border rounded"
                    >
                        <Column
                            field="index"
                            width={60}
                            className="text-right"
                            headerCell={() => makeHeaderCell({ title: '#', className: 'text-right' })}
                        />
                        <Column
                            field="userId"
                            width={150}
                            className="text-left"
                            headerCell={() => makeHeaderCell({ title: 'ID', className: 'text-left' })}
                        />
                        <Column
                            field="username"
                            className="text-left"
                            headerCell={() => makeHeaderCell({ title: '이름', className: 'text-left' })}
                        />
                        <Column
                            field="userType"
                            width={80}
                            className="text-center"
                            headerCell={() => makeHeaderCell({ title: '구분', className: 'text-center' })}
                        />
                    </Grid>
                </Col>
                <Col md={4} style={colStyle} className="pl-4 pr-4 pt-4 pb-1 border rounded bg-light">
                    <Form>
                        <FormGroup row>
                            <Col md={4} className="mt-2 d-flex align-items-start justify-content-center">
                                <Avatar size={140} />
                            </Col>
                            <Col md={8} className="d-flex justify-content-center flex-column">
                                <FormGroup row>
                                    <Label md={3} for='username' className='text-right title-font'>이름</Label>
                                    <Col md={9}>
                                        <Input type='text' id='username' name='username' />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label md={3} for='description' className='text-right title-font'>설명</Label>
                                    <Col md={9}>
                                        <Input type='text' id='description' name='description' />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label md={3} for='description' className='text-right  title-font'>구분</Label>
                                    <Col md={9}>
                                        <Input type='select' name='userType'>
                                            <option value=''>-- 구분 --</option>
                                            <option value='Admin'>관리자</option>
                                            <option value='Manager'>담당자</option>
                                            <option value='Guest'>임시 사용자</option>
                                        </Input>
                                    </Col>
                                </FormGroup>
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label md={4} for='userId' className='text-right title-font'>ID</Label>
                            <Col md={8}>
                                <Input type='text' id='userId' name='userId' />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label md={4} for='pwd' className='text-right title-font'>PWD</Label>
                            <Col md={8}>
                                <Input type='password' id='pwd' name='pwd' />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col className="d-flex align-items-center justify-content-end">
                                {/* <Button color='primary'>추가</Button> */}
                                <Button color='primary' className="mr-2">수정</Button>
                                <Button color='danger'>삭제</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Collapse>
    )
}

export default AccountCollapse;