import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import bn from 'utils/bemnames';
import PropTypes from 'prop-types';

const bem = bn.create('widget');

const IconWidget = ({ bgColor, icon: Icon, iconProps, title, subtitle, className, ...restProps }) => {
    const classes = bem.b(className, `bg-${bgColor}`);

    return (
        <Card inverse className={classes} {...restProps}>
            <CardBody className={bem.e('icon')}>
                <Icon size={50} {...iconProps} />
            </CardBody>
            <CardBody>
                <CardTitle>{title}</CardTitle>
                <CardSubtitle>{subtitle}</CardSubtitle>
            </CardBody>
        </Card>
    );
};

IconWidget.propTypes = {
    bgColor: PropTypes.string,
    icon: PropTypes.node,
    iconProps: PropTypes.object,
    title: PropTypes.string,
    subtitle: PropTypes.string
};

IconWidget.defaultProps = {
    bgColor: 'primary',
    icon: 'span',
    iconProps: { size: 50 }
}

export default IconWidget;