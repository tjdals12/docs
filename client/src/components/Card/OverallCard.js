import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import LabelText from 'components/LabelText';
import Typography from 'components/Typography';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const OverallCard = ({ data, description, className, ...rest }) => {
	const classes = classNames('w-100 h-100', className);

	const getData = (data) => {
		if (data.size === 0)
			return (
				<Typography type="h5" className="text-center font-italic">
					데이터가 없습니다.
				</Typography>
			);

		const [ ...keys ] = data.keys();

		return keys.map((key) => <LabelText key={key} label={key} text={`${data.get(key)} 개`} />);
	};

	return (
		<Card className={classes} {...rest}>
			<CardHeader className="font-weight-bold title-font">Overall</CardHeader>
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
	description: PropTypes.string,
	className: PropTypes.string
};

OverallCard.defaultProps = {
	description: 'Overall'
};

export default OverallCard;
