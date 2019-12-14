import React from 'react';
import classNames from 'classnames';
import { Collapse, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import PropTypes from 'prop-types';

const makeHeaderCell = ({ title, className }) => {
    const classes = classNames('k-link title-font', className);

    return <span className={classes}>{title}</span>;
};

const AccountCollapse = ({ 
    isOpen, 
    roles, 
    users, 
    user, 
    add, 
    edit, 
    errors, 
    count, 
    page, 
    onPage, 
    onSelect, 
    onChange, 
    onChangeRoles, 
    onSave, 
    onEdit, 
    onDelete
}) => {
    const isAdd = user.size === 0;

    const rowRender = (Row, props) => {
        const isActive = props.dataItem._id === user.get('_id');
        const isDelete = props.dataItem.deleteYn.yn === 'YES';

        return React.cloneElement(Row, {
            className: classNames(isActive && 'bg-gradient-theme-left text-white', isDelete && 'font-italic text-line-through', 'can-click', Row.props.className)
        })
    }

    const roleRender = (roles) => (
        roles.map((role) => {
            const { _id, sub, name, roleId } = role.toJS();
            const keys = Object.keys(roleId);

            let result = keys.map((key, index) => (
                <div key={`${_id}_${index}`} className="mb-2">
                    <input
                        type='checkbox'
                        name="roles"
                        value={roleId[key]}
                        checked={isAdd ? add.get('roles').includes(roleId[key]) : edit.get('roles').includes(roleId[key])}
                        onChange={onChangeRoles(isAdd ? 'add' : 'edit')}
                    />
                    <span className="pl-2">{name} ({key})</span>
                </div>
            ));

            if (sub.length > 0) {
                result.push(...sub.map((subRole) => {
                    const { _id: subId, name: subName, roleId: subRoleId } = subRole;
                    const keys = Object.keys(subRoleId);

                    return keys.map((key, index) => (
                        <div key={`${subId}_${index}`} className="mb-2">
                            <input
                                type='checkbox'
                                name="roles"
                                value={subRoleId[key]}
                                checked={isAdd ? add.get('roles').includes(subRoleId[key]) : edit.get('roles').includes(subRoleId[key])}
                                onChange={onChangeRoles(isAdd ? 'add' : 'edit')}
                            />
                            <span className="pl-2">{name} - {subName} ({key})</span>
                        </div>
                    ))
                }))
            }

            return result;
        })
    )

    return (
        <Collapse isOpen={isOpen} className="mt-3 pt-4 border-top">
            <Row style={{ minHeight: '400px' }}>
                <Col xl={4} lg={12}>
                    <Grid
                        data={users.toJS()}
                        pageable
                        total={count}
                        take={10}
                        skip={(page - 1) * 10}
                        onRowClick={(e) => onSelect(e.dataItem._id)}
                        onPageChange={(e) => onPage(e.page.skip / e.page.take + 1)}
                        rowRender={rowRender}
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
                            field="profile.username"
                            className="text-left"
                            headerCell={() => makeHeaderCell({ title: '이름', className: 'text-left' })}
                        />
                        <Column
                            field="profile.userType"
                            width={100}
                            className="text-center"
                            headerCell={() => makeHeaderCell({ title: '구분', className: 'text-center' })}
                        />
                    </Grid>
                </Col>
                <Col xl={4} lg={12}>
                    <Form className="pl-4 pr-4 pt-4 pb-2 border rounded bg-light h-100">
                        <FormGroup row>
                            <Col md={12} className="d-flex justify-content-center flex-column">
                                <FormGroup row>
                                    <Label md={3} for='username' className='text-right title-font'>이름</Label>
                                    <Col md={9}>
                                        <Input
                                            type='text'
                                            id='username'
                                            name='username'
                                            value={isAdd ? add.get('username') : edit.get('username')}
                                            onChange={onChange(isAdd ? 'add' : 'edit')}
                                            invalid={errors.get('usernameError')}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label md={3} for='description' className='text-right title-font'>설명</Label>
                                    <Col md={9}>
                                        <Input 
                                            type='text'
                                            id='description'
                                            name='description'
                                            value={isAdd ? add.get('description') : edit.get('description')}
                                            onChange={onChange(isAdd ? 'add' : 'edit')}
                                            invalid={errors.get('descriptionError')}
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label md={3} for='description' className='text-right title-font'>구분</Label>
                                    <Col md={9}>
                                        <Input 
                                            type='select'
                                            name='userType'
                                            value={isAdd ? add.get('userType') : edit.get('userType')}
                                            onChange={onChange(isAdd ? 'add' : 'edit')}
                                            invalid={errors.get('userTypeError')}
                                        >
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
                            <Label md={3} for='userId' className='text-right title-font'>ID</Label>
                            <Col md={9}>
                                <Input 
                                    type='text'
                                    id='userId'
                                    name='userId'
                                    value={isAdd ? add.get('userId') : edit.get('userId')}
                                    onChange={onChange(isAdd ? 'add' : 'edit')}
                                    invalid={errors.get('userIdError')}
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label md={3} for='pwd' className='text-right title-font'>PWD</Label>
                            <Col md={9}>
                                <Input 
                                    type='password'
                                    id='pwd'
                                    name='pwd'
                                    value={isAdd ? add.get('pwd') : edit.get('pwd')}
                                    onChange={onChange(isAdd ? 'add' : 'edit')}
                                    invalid={errors.get('pwdError')}
                                    placeholder={`${isAdd ? '' : '새로운 비밀번호를 입력하세요.'}`}
                                    className="placeholder"
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col className="d-flex align-items-center justify-content-end mt-4">
                                {isAdd ? (<Button color='primary' onClick={onSave}>추가</Button>)
                                    : (
                                        <React.Fragment>
                                            <Button color='primary' className="mr-2" onClick={() => onEdit(user.get('_id'))}>수정</Button>
                                            {user.getIn(['deleteYn', 'yn']) === 'YES'
                                                ? <Button color='success' onClick={() => onDelete(user.get('_id'), 'NO')}>복구</Button>
                                                : <Button color='danger' onClick={() => onDelete(user.get('_id'), 'YES')}>삭제</Button>
                                            }
                                        </React.Fragment>
                                    )
                                }
                            </Col>
                        </FormGroup>
                    </Form>
                </Col>

                <Col xl={4} lg={12} style={{ maxHeight: '450px', overflow: 'scroll' }}>
                    <Form className="pl-4 pr-4 pt-4 pb-2 border rounded bg-light h-100 overflow-scroll">
                        <h3 className="title-font">권한</h3>
                        {roleRender(roles)}
                    </Form>
                </Col>
            </Row>
        </Collapse>
    )
}

AccountCollapse.propTypes = {
    isOpen: PropTypes.bool,
    onSelect: PropTypes.func,
    onChange: PropTypes.func,
    onSave: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
}

AccountCollapse.defaultProps = {
    isOpen: false,
    onSelect: () => console.warn('Warning: onSelect is not defined'),
    onChange: () => console.warn('Warning: onChange is not defined'),
    onSave: () => console.warn('Warning: onSave is not defined'),
    onEdit: () => console.warn('Warning: onEdit is not defined'),
    onDelete: () => console.warn('Warning: onDelete is not defined')
}

export default AccountCollapse;