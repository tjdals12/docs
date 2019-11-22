import React from 'react';
import classNames from 'classnames';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const colors = [
    '#8884d8',
    '#82ca9d',
    '#e64980',
    '#4dabf7',
    '#1098ad',
    '#40c057',
    '#ffe066',
    '#d9480f',
    '#5f3dc4',
];

const PieChartCard = ({ data, className }) => {
    const classes = classNames(className, 'w-100', 'h-100');
    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
        const x = cx + radius * Math.cos(midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text className="title-font" x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${name} ${(percent * 100).toFixed(0)}%`}
            </text>
        );
    }

    return (
        <Card className={classes}>
            <CardHeader className="bg-white title-font">
                업체 비율 (%)
            </CardHeader>
            <CardBody>
                <ResponsiveContainer minHeight={400}>
                    <PieChart>
                        <Pie
                            data={data} 
                            dataKey="value"
                            label={renderCustomizedLabel}
                        >
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index]} />)}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </CardBody>
        </Card>
    )
}

export default PieChartCard;