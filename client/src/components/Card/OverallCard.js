import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import LabelText from 'components/LabelText';
import Typography from 'components/Typography';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const OverallCard = ({ title, description, data, className, ...rest }) => {
	const classes = classNames('w-100 h-100', className);

	const getData = (data) => {
		if (data.length === 0)
			return (
				<Typography type="h5" className="text-center font-italic">
					데이터가 없습니다.
				</Typography>
			);

		const [...keys] = Object.keys(data);

		return keys.map((key) => <LabelText key={key} label={key} text={`${data[key]} 개`} />);
	};

	return (
		<Card className={classes} {...rest}>
			<CardHeader className="font-weight-bold title-font">{title}</CardHeader>
			<CardBody>
				{description && (
					<Typography type="p" className="text-danger text-right">
						* {description}
					</Typography>
				)}
				{getData(data)}
			</CardBody>
		</Card>
	);
};

OverallCard.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	className: PropTypes.string
};

OverallCard.defaultProps = {
	title: 'Overall',
	description: ''
};

export default OverallCard;
