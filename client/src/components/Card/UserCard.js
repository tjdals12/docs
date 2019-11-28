import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import classNames from 'classnames';
import Avatar from 'components/Avatar';
import PropTypes from 'prop-types';

const UserCard = ({ 
	avatar, 
	avatarSize, 
	title, 
	subtitle, 
	text, 
	children, 
	className, 
	...restProps
}) => {
	const classes = classNames('bg-gradient-theme border-0 w-100 h-100', className);

	return (
		<Card inverse className={classes} {...restProps}>
			<CardBody className="d-flex align-items-center justify-content-center flex-column">
				<Avatar src={avatar} size={avatarSize} alt="Avatar" />
				<CardTitle>{title}</CardTitle>
				<CardSubtitle>{subtitle}</CardSubtitle>
				<CardText>{text}</CardText>
			</CardBody>
			{children}
		</Card>
	);
};

UserCard.propTypes = {
	avatar: PropTypes.string,
	avatarSize: PropTypes.number,
	title: PropTypes.string,
	subtitle: PropTypes.string,
	text: PropTypes.string,
	className: PropTypes.string
};

UserCard.defaultProps = {
	avatarSize: 80,
	title: '',
	subtitle: '',
	text: ''
};

export default UserCard;
