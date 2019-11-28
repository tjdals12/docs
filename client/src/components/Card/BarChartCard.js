import React from 'react';
import classNames from 'classnames';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import Typography from 'components/Typography';
import PropTypes from 'prop-types';

const BarChartCard = ({ 
	stack, 
	title, 
	data, 
	color1, 
	color2, 
	color3, 
	className, 
	...rest
}) => {
	const classes = classNames('w-100 h-100', className);

	const getChart = (data) => {
		if (data.length === 0)
			return (
				<Typography type="h5" className="text-center font-italic">
					데이터가 없습니다.
				</Typography>
			);

		const [...keys] = Object.keys(data[0]);

		return (
			<ResponsiveContainer minHeight={300}>
				<BarChart data={data}>
					<CartesianGrid />
					<XAxis dataKey={keys[0]} />
					<YAxis domain={[0, 'dataMax + 10']} />
					<Legend />
					<Tooltip />
					{keys[1] && <Bar dataKey={keys[1]} barSize={30} fill={color1} />}
					{keys[2] && <Bar dataKey={keys[2]} barSize={30} fill={color2} />}
					{keys[3] && <Bar dataKey={keys[3]} barSize={30} fill={color3} />}
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
	stack: PropTypes.bool,
	title: PropTypes.string,
	data: PropTypes.array,
	color1: PropTypes.string,
	color2: PropTypes.string,
	className: PropTypes.string
};

BarChartCard.defaultProps = {
	stack: false,
	title: 'Chart',
	data: [],
	color1: '#6a82fb',
	color2: '#fc5c7d',
	color3: '#ffd700'
};

export default BarChartCard;
