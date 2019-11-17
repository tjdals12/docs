import React from 'react';
import classNames from 'classnames';
import { Collapse, Row, Col, Form, FormGroup, Button, Label, Input } from 'reactstrap';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import QuestionModal from 'components/Modal/QuestionModal';
import PropTypes from 'prop-types';

const makeHeaderCell = ({ title, className }) => {
    const classes = classNames('k-link title-font', className);

    return <span className={classes}>{title}</span>;
};

const ManagerCollapse = ({
    isOpenQuestion,
    parts,
    teams,
    team,
    add,
    edit,
    teamErrors,
    manager,
    addManager,
    editManager,
    managerErrors,
    count,
    page,
    isOpen,
    onPage,
    onSelectTeam,
    onSelectManager,
    onChange,
    onSave,
    onEdit,
    onDelete,
    onSaveManager,
    onEditManager,
    onDeleteManager,
    onOpen,
    onClose
}) => {
    const isAddTeam = team.size === 0;
    const isAddManager = manager.size === 0;

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
        <React.Fragment>
            <QuestionModal
                isOpen={isOpenQuestion}
                onClose={onClose}
                size="md"
                header="담당자 삭제"
                body={
                    <div>
                        <p className="m-0">선택 값을 삭제하시겠습니까?</p>
                        <p className="m-0 text-danger">(* 삭제된 데이터 복구되지 않습니다.)</p>
                    </div>
                }
                footer={
                    <Button color="primary" onClick={onDeleteManager(team.get('_id'))}>
                        삭제
					</Button>
                }
            />
            <Collapse isOpen={isOpen} className="mt-3 pt-4 border-top">
                <Row style={{ minHeight: '400px' }}>

                    <Col xl={4} lg={12}>
                        <Grid
                            pageable
                            data={teams.toJS()}
                            total={count}
                            take={10}
                            skip={(page - 1) * 10}
                            onPageChange={(e) => onPage(e.page.skip / e.page.take + 1)}
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
                                headerCell={() => makeHeaderCell({ title: '공종', className: 'text-center' })}
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
                    <Col xl={4} lg={6}>
                        <Grid
                            data={team.toJS().managers}
                            onRowClick={(e) => onSelectManager(e.dataItem._id)}
                            rowRender={managerRowRender}
                            className="h-100 border rounded"
                            resizable
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
                    <Col xl={4} lg={6}>
                        <Form
                            className="pl-4 pr-4 pt-4 pb-1 mb-3 border rounded bg-light"
                            onSubmit={(e) => {
                                e.preventDefault()
                            }}
                        >
                            <FormGroup row>
                                <Label md={3} for='part' className='text-right title-font'>
                                    공종 / 팀명
                            </Label>
                                <Col md={4}>
                                    <Input type='select' id='part' name='part' value={isAddTeam ? add.get('part') : edit.get('part')} onChange={onChange(isAddTeam ? 'add' : 'edit')} invalid={teamErrors.get('partError')}>
                                        <option value="">-- 공종 --</option>
                                        {
                                            parts.get('cdMinors').map((code) => (
                                                <option key={code.get('_id')} value={code.get('_id')}>
                                                    {code.get('cdSName')}
                                                </option>
                                            ))
                                        }
                                    </Input>
                                </Col>
                                <Col md={5}>
                                    <Input type='text' id='teamName' name='teamName' value={isAddTeam ? add.get('teamName') : edit.get('teamName')} onChange={onChange(isAddTeam ? 'add' : 'edit')} invalid={teamErrors.get('teamNameError')} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col className="d-flex align-items-center justify-content-end">
                                    {isAddTeam ?
                                        (<Button color="primary" onClick={() => onSave()}>팀 추가</Button>) :
                                        (<React.Fragment>
                                            <Button color="primary" className="mr-2" onClick={() => onEdit(team.get('_id'))}>수정</Button>
                                            <Button color="danger" disabled={team.toJS().managers.length > 0} onClick={() => onDelete(team.get('_id'))}>삭제</Button>
                                        </React.Fragment>
                                        )}
                                </Col>
                            </FormGroup>
                        </Form>

                        <Form
                            className="pl-4 pr-4 pt-4 pb-1 border rounded bg-light"
                            onSubmit={(e) => {
                                e.preventDefault()
                            }}
                        >
                            <FormGroup row>
                                <Label md={3} for='name' className='text-right title-font'>이름</Label>
                                <Col md={4}>
                                    <Input type='text' id='name' name='name' value={isAddManager ? addManager.get('name') : editManager.get('name')} onChange={onChange(isAddManager ? 'addManager' : 'editManager')} invalid={managerErrors.get('nameError')} />
                                </Col>
                                <Label md={2} for='position' className='text-right title-font'>직책</Label>
                                <Col md={3}>
                                    <Input type='text' id='position' name='position' value={isAddManager ? addManager.get('position') : editManager.get('position')} onChange={onChange(isAddManager ? 'addManager' : 'editManager')} invalid={managerErrors.get('positionError')} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label md={3} for='effStaDt' className='text-right title-font'>시작일</Label>
                                <Col md={9}>
                                    <Input type='date' id='effStaDt' name='effStaDt' value={isAddManager ? addManager.get('effStaDt') : editManager.get('effStaDt')} onChange={onChange(isAddManager ? 'addManager' : 'editManager')} invalid={managerErrors.get('effStaDtError')} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label md={3} for='effEndDt' className='text-right title-font'>종료일</Label>
                                <Col md={9}>
                                    <Input type='date' id='effEndDt' name='effEndDt' value={isAddManager ? addManager.get('effEndDt') : editManager.get('effEndDt')} onChange={onChange(isAddManager ? 'addManager' : 'editManager')} invalid={managerErrors.get('effEndDtError')} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col className="d-flex align-items-center justify-content-end">
                                    {isAddManager ?
                                        (<Button color="primary" onClick={() => onSaveManager(team.get('_id'))} disabled={team.size === 0}>담당자 추가</Button>) :
                                        (<React.Fragment>
                                            <Button color="primary" className="mr-2" onClick={() => onEditManager(team.get('_id'))}>수정</Button>
                                            <Button color="danger" onClick={() => onOpen('question')}>삭제</Button>
                                        </React.Fragment>
                                        )}
                                </Col>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
            </Collapse>
        </React.Fragment>
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