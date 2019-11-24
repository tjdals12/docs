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
import { colors } from 'utils/define';

const CustomAreaChart = ({ data }) => {
    const getArea = (data) => {
        const keys = Object.keys(data.reduce((acc, cur) => Object.assign(acc, cur), {}));
        
        return keys.slice(1, keys.length).sort().map((key, index) => (
            <Area key={key} type="monotone" dataKey={key} stackId="1" stroke={colors[index]} fill={colors[index]}/>
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