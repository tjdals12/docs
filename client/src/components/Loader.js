import React from 'react';
import classNames from 'classnames';
import { Row } from 'reactstrap';
import PulseLoader from 'react-spinners/PulseLoader';
import PropTypes from 'prop-types';

const Loader = ({ size, sizeUnit, margin, color, style, className }) => (
    <Row className={classNames(className, "flex-grow-1 flex-shrink-1 d-flex align-items-center justify-content-center")} style={style}>
        <PulseLoader size={size} sizeUnit={sizeUnit} margin={`${margin}px`} color={color} />
    </Row>
)

Loader.propTypes = {
    size: PropTypes.number,
    sizeUnit: PropTypes.string,
    margin: PropTypes.number,
    color: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
};

Loader.defaultProps = {
    size: 10,
    sizeUnit: 'px',
    margin: 5,
    color: '#6a82fb',
    style: {},
    className: '',
};

export default Loader;