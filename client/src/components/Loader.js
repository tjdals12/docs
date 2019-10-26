import React from 'react';
import { Row } from 'reactstrap';
import PulseLoader from 'react-spinners/PulseLoader';
import PropTypes from 'prop-types';

const Loader = ({ size, sizeUnit, margin, color }) => (
    <Row className="flex-grow-1 flex-shrink-1 d-flex align-items-center justify-content-center">
        <PulseLoader size={size} sizeUnit={sizeUnit} margin={`${margin}px`} color={color} />
    </Row>
)

Loader.propTypes = {
    size: PropTypes.number,
    sizeUnit: PropTypes.string,
    margin: PropTypes.number,
    color: PropTypes.string
};

Loader.defaultProps = {
    size: 10,
    sizeUnit: 'px',
    margin: 5,
    color: '#6a82fb'
};

export default Loader;