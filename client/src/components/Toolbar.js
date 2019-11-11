import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Toolbar = ({ buttons, className }) => {
    const classes = classNames('hidden-md hidden-sm hidden-xs', className);

    return (
        <Row className={classes}>
            <Col md={4}>
                {buttons.map(({ color, name, event }, index) => (
                    <Button key={name} color={color} className="mr-2" onClick={event}>{name}</Button>
                ))}
            </Col>
        </Row>
    )
}

Toolbar.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        event: PropTypes.func.isRequired
    })).isRequired,
    className: PropTypes.string
};

Toolbar.defaultProps = {
    className: ''
}

export default Toolbar;