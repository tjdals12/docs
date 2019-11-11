import React from 'react';
import { Col, Label } from 'reactstrap';
import PropTypes from 'prop-types';

const LabelInput = ({ name, label, size, children }) => (
    <React.Fragment>
        <Label md={1} for={name} className="title-font text-right">{label}</Label>
        <Col md={size}>
            {children}
        </Col>
    </React.Fragment>
);

LabelInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    size: PropTypes.number
}

LabelInput.defaultProps = {
    size: 2
}

export default LabelInput;