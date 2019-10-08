import React from 'react';
import classNames from 'classnames';
import { Form, FormGroup, Label, Col, Input } from 'reactstrap';
import { MdClose } from 'react-icons/md';
import PropTypes from 'prop-types';


const VendorPersonEditForm = React.memo(({ index, data, onChange, onDelete, className, ...rest }) => {
    const classes = classNames('mb-2 p-4 border rounded bg-light position-relative', className);

    return (
        <Form className={classes} {...rest}>
            <MdClose
                className="position-absolute can-click border rounded-circle text-white bg-danger"
                style={{ top: -7, right: -7 }}
                onClick={() => onDelete(index)}
            />
            <FormGroup row>
                <Label for="name" md={2} className="text-right pr-0" size="sm">
                    이름 :
				</Label>
                <Col md={5}>
                    <Input type="text" id="name" name="name" bsSize="sm" onChange={(e) => onChange(e, index)} value={data.get('name')} />
                </Col>
                <Label for="position" md={2} className="text-right pr-0" size="sm">
                    직급 :
				</Label>
                <Col md={3}>
                    <Input type="text" id="position" name="position" bsSize="sm" onChange={(e) => onChange(e, index)} value={data.get('position')} />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="task" md={2} className="text-right pr-0" size="sm">
                    업무 :
				</Label>
                <Col md={10}>
                    <Input type="text" id="task" name="task" bsSize="sm" onChange={(e) => onChange(e, index)} value={data.get('task')} />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="email" md={2} className="text-right pr-0" size="sm">
                    E-mail :
				</Label>
                <Col md={10}>
                    <Input type="email" name="email" bsSize="sm" onChange={(e) => onChange(e, index)} value={data.get('email')} />
                </Col>
            </FormGroup>
            <FormGroup row className="mb-0">
                <Label for="contactNumber" md={2} className="text-right pr-0" size="sm">
                    연락처 :
				</Label>
                <Col md={10}>
                    <Input type="text" id="contactNumber" name="contactNumber" bsSize="sm" onChange={(e) => onChange(e, index)} value={data.get('contactNumber')} />
                </Col>
            </FormGroup>
        </Form>
    );
})

VendorPersonEditForm.propTypes = {
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    className: PropTypes.string
};

VendorPersonEditForm.defaultProps = {
    onChange: () => console.warn('Warning: onChange is not defined'),
    onDelete: () => console.warn('Warning: onDelete is not defined')
}

export default VendorPersonEditForm;