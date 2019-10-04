import React from 'react';
import { Media } from 'reactstrap';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar';

const Notifications = ({ notificationsData }) => {
	return (
		notificationsData &&
		notificationsData.length &&
		notificationsData.map(({ id, avatar, message, date }) => (
			<Media key={id} className="pb-3">
				<Media left className="align-self-center pr-2">
					<Avatar tag={Media} src={avatar} alt="Avatar" />
				</Media>
				<Media middle body className="align-self-center">
					{message}
				</Media>
				<Media right className="align-self-end">
					<small className="text-muted">{date}</small>
				</Media>
			</Media>
		))
	);
};

Notifications.propTypes = {
	notificationsData: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
			avatar: PropTypes.string,
			message: PropTypes.string,
			date: PropTypes.string
		})
	)
};

Notifications.defaultProps = {
	notificationsData: []
};

export default Notifications;
