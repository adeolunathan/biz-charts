// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/charts/line/LineChart.js
import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useChartContext } from '../../../contexts/ChartContext';

/**
 * Basic LineChart component to display line chart visualization
 */
const LineChart = () => {
  const {
    chartData,
    xAxisKey,
    yAxisKeys,
    styleOptions
  } = useChartContext();

  // Simple color palette
  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

  return (
    <div className="line-chart">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 30
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: styleOptions?.fontSize || 12 }}
          />
          <YAxis tick={{ fontSize: styleOptions?.fontSize || 12 }} />
          <Tooltip />
          <Legend />

          {yAxisKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;