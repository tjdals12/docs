import React from 'react';
import classNames from 'classnames';
import { Collapse, Row, Col, Form, FormGroup, Button, Label, Input } from 'reactstrap';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';

const colStyle = {
    maxHeight: '400px',
    overflow: 'scroll',
    margin: 0
};

const makeHeaderCell = ({ title, className }) => {
    const classes = classNames('k-link title-font', className);

    return <span className={classes}>{title}</span>;
};

const ManagerCollapse = ({ isOpen }) => {
    return (
        <Collapse isOpen={isOpen} className="mt-3 pt-4 border-top">
            <Row style={{ minHeight: '400px' }}>

                <Col md={4} style={colStyle}>
                    <Grid
                        pageable
                        className="h-100 border rounded"
                    >
                        <Column
                            field="index"
                            width={60}
                            className="text-center"
                            headerCell={() => makeHeaderCell({ title: '#', className: 'text-right' })}
                        />
                        <Column
                            field="team"
                            className="text-center"
                            headerCell={() => makeHeaderCell({ title: '팀명', className: 'text-center' })}
                        />
                        <Column
                            field="managers"
                            width={100}
                            className="text-center"
                            headerCell={() => makeHeaderCell({ title: '소속', className: 'text-center' })}
                        />
                    </Grid>
                </Col>
                <Col md={4} style={colStyle}>
                    <Grid
                        pageable
                        className="h-100 border rounded"
                    >
                        <Column
                            field="index"
                            width={60}
                            className="text-center"
                            headerCell={() => makeHeaderCell({ title: '#', className: 'text-right' })}
                        />
                        <Column
                            field="name"
                            className="text-center"
                            headerCell={() => makeHeaderCell({ title: '이름', className: 'text-center' })}
                        />
                        <Column
                            field="position"
                            width={80}
                            className="text-center"
                            headerCell={() => makeHeaderCell({ title: '직책', className: 'text-center' })}
                        />
                        <Column
                            field="team"
                            width={120}
                            className="text-center"
                            headerCell={() => makeHeaderCell({ title: '시작일', className: 'text-center' })}
                        />
                        <Column
                            field="name"
                            width={120}
                            className="text-center"
                            headerCell={() => makeHeaderCell({ title: '종료일', className: 'text-center' })}
                        />
                    </Grid>
                </Col>
                <Col md={4} style={colStyle} className="pl-4 pr-4 pt-4 pb-1 border rounded bg-light">
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault()
                        }}
                        className="mb-5"
                    >
                        <FormGroup row>
                            <Label md={3} for='team' className='text-right'>
                                팀명
                            </Label>
                            <Col md={9}>
                                <Input type='text' id='team' name='team' />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col className="d-flex align-items-center justify-content-end">
                                <Button color="primary">팀 추가</Button>

                                {/* <React.Fragment>
                                    <Button color="primary" className="mr-2">수정</Button>
                                    <Button color="danger">삭제</Button>
                                </React.Fragment> */}
                            </Col>
                        </FormGroup>
                    </Form>

                    <Form
                        onSubmit={(e) => {
                            e.preventDefault()
                        }}
                    >
                        <FormGroup row>
                            <Label md={3} for='name' className='text-right'>이름</Label>
                            <Col md={4}>
                                <Input type='text' id='name' name='name' />
                            </Col>
                            <Label md={2} for='position' className='text-right'>직책</Label>
                            <Col md={3}>
                                <Input type='text' id='position' name='position' />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label md={3} for='effStaDt' className='text-right'>시작일</Label>
                            <Col md={9}>
                                <Input type='date' id='effStaDt' name='effStaDt' />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label md={3} for='effEndDt' className='text-right'>종료일</Label>
                            <Col md={9}>
                                <Input type='date' id='effEndDt' name='effEndDt' />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col className="d-flex align-items-center justify-content-end">
                                <Button color="primary">담당자 추가</Button>

                                {/* <React.Fragment>
                                    <Button color="primary" className="mr-2">수정</Button>
                                    <Button color="danger">삭제</Button>
                                </React.Fragment> */}
                            </Col>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Collapse>
    )
}

export default ManagerCollapse;