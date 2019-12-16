import React from 'react';
import classNames from 'classnames';
import { Modal } from 'reactstrap';
import PropTypes from 'prop-types';
import ScaleLoader from 'react-spinners/ScaleLoader';

const LoadingModal = ({ isOpen, className }) => {
    const classes = classNames('px-4 py-2 text-center', className);

    return (
        <Modal isOpen={isOpen} contentClassName={classes} size="sm" centered>
            <ScaleLoader color="#6a82fb" height={35} width={10} margin="5px"/>
        </Modal>
    )
};

LoadingModal.propTypes = {
    isOpen: PropTypes.bool,
    className: PropTypes.string
};

LoadingModal.defaultProps = {
    isOpen: false,
    className: ''
};

export default LoadingModal;