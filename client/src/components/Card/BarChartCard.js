import React from 'react';
import classNames from 'classnames';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import Typography from 'components/Typography';
import PropTypes from 'prop-types';

const BarChartCard = ({ title, data, color1, color2, className, ...rest }) => {
	const classes = classNames('w-100 h-100', className);

	const getChart = (data) => {
		if (data.size === 0)
			return (
				<Typography type="h5" className="text-center font-italic">
					데이터가 없습니다.
				</Typography>
			);

		const [ ...keys ] = data.get(0).keys();

		return (
			<ResponsiveContainer minHeight={300}>
				<BarChart data={data.toJS()}>
					<CartesianGrid />
					<XAxis dataKey={keys[0]} />
					<YAxis domain={[ 0, 'dataMax + 10' ]} />
					<Legend />
					<Tooltip />
					{keys[1] && <Bar dataKey={keys[1]} barSize={30} fill={color1} />}
					{keys[2] && <Bar dataKey={keys[2]} barSize={30} fill={color2} />}
				</BarChart>
			</ResponsiveContainer>
		);
	};

	return (
		<Card className={classes} {...rest}>
			<CardHeader className="title-font">{title}</CardHeader>
			<CardBody>{getChart(data)}</CardBody>
		</Card>
	);
};

BarChartCard.propTypes = {
	title: PropTypes.string,
	data: PropTypes.object,
	color1: PropTypes.string,
	color2: PropTypes.string,
	className: PropTypes.string
};

BarChartCard.defaultProps = {
	title: 'Chart',
	color1: '#6a82fb',
	color2: '#fc5c7d'
};

export default BarChartCard;
