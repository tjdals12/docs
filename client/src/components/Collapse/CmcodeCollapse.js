import React from 'react';
import classNames from 'classnames';
import { Collapse, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import PropTypes from 'prop-types';

const majorDemos = [
    { index: 1, cdMajor: '0001', cdFName: '공종', effStaDt: '2019-06-13', effEndDt: '9999-12-31' },
    { index: 2, cdMajor: '0002', cdFName: '구분', effStaDt: '2019-07-20', effEndDt: '9999-12-31' },
    { index: 3, cdMajor: '0003', cdFName: '수발신 및 상태코드', effStaDt: '2019-07-28', effEndDt: '9999-12-31' },
]

const minorDemos = [
    { index: 1, cdMinor: '0001', cdSName: '기계', regDt: '2019-06-13' },
    { index: 2, cdMinor: '0002', cdSName: '장치', regDt: '2019-06-13' },
    { index: 3, cdMinor: '0003', cdSName: '배관', regDt: '2019-06-13' },
    { index: 4, cdMinor: '0004', cdSName: '계장', regDt: '2019-06-13' },
    { index: 5, cdMinor: '0005', cdSName: '전기', regDt: '2019-06-13' }
]

const colStyle = {
    maxHeight: '400px',
    overflow: 'scroll'
}

const makeHeaderCell = ({ title, className }) => {
    const classes = classNames('k-link title-font', className);

    return <span className={classes}>{title}</span>;
};

const CmcodeCollapse = ({ cdMajors, isOpen, onChange, onSave, onEdit }) => {
    return (
        <Collapse isOpen={isOpen} className="mt-3 pt-4 border-top">
            <Row style={{ minHeight: '400px' }}>
                <Col md={5} style={colStyle}>
                    <Grid
                        pageable
                        data={cdMajors.toJS()}
                        total={30}
                        take={10}
                        skip={0}
                        className='h-100 border rounded'>
                        <Column
                            field='index'
                            width={40}
                            className='text-right'
                            headerCell={() => makeHeaderCell({ title: '#', className: 'text-right' })} />
                        <Column
                            field='cdMajor'
                            width={80}
                            className='text-center'
                            headerCell={() => makeHeaderCell({ title: '코드', className: 'text-center' })} />
                        <Column
                            field='cdFName'
                            headerCell={() => makeHeaderCell({ title: '코드명' })} />
                        < Column
                            field='effStaDt'
                            width={120}
                            className='text-center'
                            headerCell={() => makeHeaderCell({ title: '이력시작일', className: 'text-center' })} />
                        <Column
                            field='effEndDt'
                            width={120}
                            className='text-center'
                            headerCell={() => makeHeaderCell({ title: '이력종료일', className: 'text-center' })} />
                    </Grid>
                </Col>

                <Col md={4} style={colStyle}>
                    <Grid
                        pageable
                        data={minorDemos}
                        total={30}
                        take={10}
                        skip={0}
                        className='h-100 border rounded'>
                        <Column
                            field='index'
                            width={40}
                            className='text-right'
                            headerCell={() => makeHeaderCell({ title: '#', className: 'text-right' })} />
                        <Column
                            field='cdMinor'
                            width={80}
                            className='text-center'
                            headerCell={() => makeHeaderCell({ title: '코드', className: 'text-center' })} />
                        <Column
                            field='cdSName'
                            headerCell={() => makeHeaderCell({ title: '코드명' })} />
                        <Column
                            field='regDt'
                            width={120}
                            className='text-center'
                            headerCell={() => makeHeaderCell({ title: '등록일', className: 'text-center' })} />
                    </Grid>
                </Col>

                <Col md={3} style={colStyle} className='pl-4 pr-4 pt-4 pb-1 border rounded bg-light'>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                        <FormGroup row>
                            <Label md={4} for='cdMinor'>코드</Label>
                            <Col md={8}>
                                <Input type='text' id='cdMinor' name='cdMinor' onChange={onChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label md={4} for='cdSName'>코드명</Label>
                            <Col md={8}>
                                <Input type='text' id='cdSName' name='cdSName' onChange={onChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col className='d-flex align-items-center justify-content-end'>
                                <Button color='primary' onClick={onSave}>SAVE</Button>
                                <Button color='primary' className="mr-2">EDIT</Button>
                                <Button color='danger'>DELETE</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Collapse>
    )
}

CmcodeCollapse.propTypes = {
    isOpen: PropTypes.bool,
    onChage: PropTypes.func,
    onSave: PropTypes.func,
    onEdit: PropTypes.func
}

CmcodeCollapse.defaultProps = {
    isOpen: false,
    onChage: () => console.warn('Warning: onChange is not defined'),
    onSave: () => console.warn('Warning: onSave is not defined'),
    onEdit: () => console.warn('Warning: onEdit is not defined')
}

export default CmcodeCollapse;