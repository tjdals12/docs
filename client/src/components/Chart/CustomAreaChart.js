import React from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from 'recharts';

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

const CustomAreaChart = ({ data }) => {
    const getArea = (data) => {
        const keys = Object.keys(data.reduce((acc, cur) => Object.assign(acc, cur), {}));
        
        return keys.slice(1, keys.length).map((key, index) => (
            <Area type="monotone" dataKey={key} stackId="1" stroke={colors[index]} fill={colors[index]}/>
        ));
    }

    return (
        <ResponsiveContainer minHeight={400}>
            <AreaChart
                data={data}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickSize={15}/>
                <YAxis />
                <Tooltip />
                {getArea(data)}
            </AreaChart>
        </ResponsiveContainer>
    )
}

export default CustomAreaChart;