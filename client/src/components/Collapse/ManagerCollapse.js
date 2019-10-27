import React from 'react';
import classNames from 'classnames';
import { Collapse, Row, Col, Form, FormGroup, Button, Label, Input } from 'reactstrap';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import PropTypes from 'prop-types';

const colStyle = {
    maxHeight: '400px',
    overflow: 'scroll',
    margin: 0
};

const makeHeaderCell = ({ title, className }) => {
    const classes = classNames('k-link title-font', className);

    return <span className={classes}>{title}</span>;
};

const ManagerCollapse = ({ parts, teams, team, manager, isOpen, onSelectTeam, onSelectManager, onChange }) => {
    const isTeamAdd = team.size === 0;
    const isManagerAdd = manager.size === 0;

    const teamRowRender = (Row, props) => {
        const isActive = props.dataItem._id === team.get('_id');

        return React.cloneElement(Row, {
            className: classNames(isActive && 'bg-gradient-theme-left text-white', 'can-click', Row.props.className)
        });
    }

    const managerRowRender = (Row, props) => {
        const isActive = props.dataItem._id === manager.get('_id');
        const isDelete = props.dataItem.effEndDt !== '9999-12-31';

        return React.cloneElement(Row, {
            className: classNames(isDelete && 'text-line-through text-muted font-italic', isActive && 'bg-gradient-theme-left text-white', 'can-click', Row.props.className)
        });
    }

    return (
        <Collapse isOpen={isOpen} className="mt-3 pt-4 border-top">
            <Row style={{ minHeight: '400px' }}>

                <Col md={4} style={colStyle}>
                    <Grid
                        pageable
                        data={teams.toJS()}
                        total={30}
                        take={10}
                        skip={0}
                        onRowClick={(e) => onSelectTeam(e.dataItem._id)}
                        rowRender={teamRowRender}
                        className="h-100 border rounded"
                    >
                        <Column
                            field="index"
                            width={60}
                            className="text-right"
                            headerCell={() => makeHeaderCell({ title: '#', className: 'text-right' })}
                        />
                        <Column
                            field="part.cdSName"
                            width={100}
                            className="text-center"
                            headerCell={() => makeHeaderCell({ title: '#', className: 'text-center' })}
                        />
                        <Column
                            field="teamName"
                            className="text-left"
                            headerCell={() => makeHeaderCell({ title: '팀명', className: 'text-left' })}
                        />
                        <Column
                            field="managers.length"
                            width={100}
                            className="text-center"
                            headerCell={() => makeHeaderCell({ title: '소속', className: 'text-center' })}
                        />
                    </Grid>
                </Col>
                <Col md={4} style={colStyle}>
                    <Grid
                        pageable
                        data={team.toJS().managers}
                        onRowClick={(e) => onSelectManager(e.dataItem._id)}
                        rowRender={managerRowRender}
                        className="h-100 border rounded"
                    >
                        <Column
                            field="index"
                            width={60}
                            className="text-right"
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
                            field="effStaDt"
                            width={120}
                            className="text-center"
                            headerCell={() => makeHeaderCell({ title: '시작일', className: 'text-center' })}
                        />
                        <Column
                            field="effEndDt"
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
                            <Label md={2} for='part' className='text-right'>
                                공종
                            </Label>
                            <Col md={3}>
                                <Input type='select' id='part' name='part' value={team.getIn(['part', '_id'])} onChange={onChange}>
                                    <option>-- 공종 --</option>
                                    {
                                        parts.get('cdMinors').map((code) => (
                                            <option key={code.get('_id')} value={code.get('_id')}>
                                                {code.get('cdSName')}
                                            </option>
                                        ))
                                    }
                                </Input>
                            </Col>
                            <Label md={2} for='team' className='text-right'>
                                팀명
                            </Label>
                            <Col md={5}>
                                <Input type='text' id='team' name='team' defaultValue={team.get('teamName')} onChange={onChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col className="d-flex align-items-center justify-content-end">
                                {isTeamAdd ?
                                    (<Button color="primary">팀 추가</Button>) :
                                    (<React.Fragment>
                                        <Button color="primary" className="mr-2">수정</Button>
                                        <Button color="danger">삭제</Button>
                                    </React.Fragment>
                                    )}
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
                                <Input type='text' id='name' name='name' defaultValue={manager.get('name')} onChange={onChange} />
                            </Col>
                            <Label md={2} for='position' className='text-right'>직책</Label>
                            <Col md={3}>
                                <Input type='text' id='position' name='position' defaultValue={manager.get('position')} onChange={onChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label md={3} for='effStaDt' className='text-right'>시작일</Label>
                            <Col md={9}>
                                <Input type='date' id='effStaDt' name='effStaDt' defaultValue={manager.get('effStaDt')} onChange={onChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label md={3} for='effEndDt' className='text-right'>종료일</Label>
                            <Col md={9}>
                                <Input type='date' id='effEndDt' name='effEndDt' defaultValue={manager.get('effEndDt')} onChange={onChange} />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col className="d-flex align-items-center justify-content-end">
                                {isManagerAdd ?
                                    (<Button color="primary">담당자 추가</Button>) :
                                    (<React.Fragment>
                                        <Button color="primary" className="mr-2">수정</Button>
                                        <Button color="danger">삭제</Button>
                                    </React.Fragment>
                                    )}
                            </Col>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Collapse>
    )
}

ManagerCollapse.propTypes = {
    isOpen: PropTypes.bool,
    onSelectTeam: PropTypes.func,
    onSelectManager: PropTypes.func,
    onChange: PropTypes.func
}

ManagerCollapse.defaultProps = {
    isOpen: false,
    onSelectTeam: () => console.warn('Warning: onSelectTeam is not defined'),
    onSelectManager: () => console.warn('Warning: onSelectManager is not defined'),
    onChange: () => console.warn('Warning: onChange is not defined')
}

export default ManagerCollapse;