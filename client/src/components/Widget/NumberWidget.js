import React from 'react';
import { Card, CardText, CardTitle, Progress } from 'reactstrap';
import Typography from 'components/Typography';
import PropTypes from 'prop-types';

const NumberWidget = ({ title, subtitle, number, color, progress: { value, label }, ...restProps }) => (
    <Card body {...restProps}>
        <div className="d-flex justify-content-between">
            <CardText tag="div">
                <Typography className="mb-0 title-font">
                    {title}
                </Typography>
                <Typography className="mb-0 text-muted small">{subtitle}</Typography>
            </CardText>
            <CardTitle className={`text-${color}`}>{number}</CardTitle>
        </div>
        <Progress value={value} color={color} style={{ height: '8px' }} />
        <CardText tag="div" className="d-flex justify-content-between">
            <Typography tag="span" className="text-left text-muted small">
                {label}
            </Typography>
            <Typography tag="span" className="text-right text-muted small">
                {value} %
            </Typography>
        </CardText>
    </Card>
);

NumberWidget.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    color: PropTypes.oneOf([
        'primary',
        'secondary',
        'warning',
        'danger',
        'success',
        'info',
        'light',
        'dark'
    ]).isRequired,
    progress: PropTypes.shape({
        value: PropTypes.number,
        label: PropTypes.string
    }).isRequired
}

NumberWidget.defaultProps = {
    subtitle: ''
}

export default NumberWidget;