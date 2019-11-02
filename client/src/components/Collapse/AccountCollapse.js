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

const AccountCollapse = ({ isOpen, onChange, onSave, onEdit, onDelete }) => {

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
                <Col md={4} style={colStyle}>
                    <Form className="pl-4 pr-4 pt-4 pb-2 border rounded bg-light h-100">
                        <FormGroup row>
                            <Col md={4} className="mt-2 d-flex align-items-start justify-content-center">
                                <Avatar size={140} />
                            </Col>
                            <Col md={8} className="d-flex justify-content-center flex-column">
                                <FormGroup row>
                                    <Label md={3} for='username' className='text-right title-font'>이름</Label>
                                    <Col md={9}>
                                        <Input type='text' id='username' name='username' onChange={onChange} />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label md={3} for='description' className='text-right title-font'>설명</Label>
                                    <Col md={9}>
                                        <Input type='text' id='description' name='description' onChange={onChange} />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label md={3} for='description' className='text-right  title-font'>구분</Label>
                                    <Col md={9}>
                                        <Input type='select' name='userType' onChange={onChange}>
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
                                <Input type='text' id='userId' name='userId' onChange={onChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label md={4} for='pwd' className='text-right title-font'>PWD</Label>
                            <Col md={8}>
                                <Input type='text' id='pwd' name='pwd' disabled />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col className="d-flex align-items-center justify-content-end">
                                {/* <Button color='primary' onClick={onSave}>추가</Button> */}
                                <Button color='primary' className="mr-2" onClick={onEdit}>수정</Button>
                                <Button color='danger' onClick={onDelete}>삭제</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </Col>

                <Col md={4} style={colStyle}>
                    <Form className="pl-4 pr-4 pt-4 pb-2 border rounded bg-light h-100">
                        <Label for='roles' className="title-font">권한</Label>
                        <Input type='select' id='roles' name='roles[]' className="p-1 h-85" onChange={onChange} multiple>
                            <option value='a' className="p-2 mb-1">Dashboard</option>
                            <option value='b' className="p-2 mb-1">Documents (READ)</option>
                            <option value='c' className="p-2 mb-1">Documents (WRITE)</option>
                            <option value='d' className="p-2 mb-1">Vendors (READ)</option>
                            <option value='e' className="p-2 mb-1">Vendors (WRITE)</option>
                        </Input>
                    </Form>
                </Col>
            </Row>
        </Collapse>
    )
}

AccountCollapse.propTypes = {
    isOpen: PropTypes.bool,
    onChange: PropTypes.func,
    onSave: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
}

AccountCollapse.defaultProps = {
    isOpen: false,
    onChange: () => console.warn('onChange is not defined'),
    onSave: () => console.warn('onChange is not defined'),
    onEdit: () => console.warn('onChange is not defined'),
    onDelete: () => console.warn('onChange is not defined')
}

export default AccountCollapse;