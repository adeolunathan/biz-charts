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
  ResponsiveContainer,
  Label,
  ReferenceLine,
  Area
} from 'recharts';
import { useChartContext } from '../../../contexts/ChartContext';

/**
 * Enhanced LineChart component with full customization support
 */
const LineChart = () => {
  const {
    // Chart data and keys
    chartData,
    xAxisKey,
    yAxisKeys,

    // Line styles
    lineStyles,
    defaultLineThickness,
    defaultDotSize,
    orientation,
    logScale,
    curveType,
    fillArea,

    // Visibility options
    visibilityOptions,

    // Style options
    styleOptions,

    // Axis options
    axisOptions,

    // Format options
    formatNumber
  } = useChartContext();

  // Early return if no data
  if (!chartData || chartData.length === 0) {
    return (
      <div className="line-chart-no-data">
        <p>No data available to display</p>
      </div>
    );
  }

  // Generate custom ticks if specified
  const getAxisTicks = (axisType) => {
    const option = axisOptions[`${axisType}Ticks`];
    if (option && option.interval !== 'auto') {
      const values = chartData.map(item => item[axisType === 'x' ? xAxisKey : yAxisKeys[0]]);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const ticks = [];

      for (let i = min; i <= max; i += Number(option.interval)) {
        ticks.push(i);
      }

      return ticks;
    }

    return undefined;
  };

  // Custom format for Y axis
  const formatYAxis = (value) => {
    return formatNumber ? formatNumber(value) : value;
  };

  // Tooltip formatter
  const tooltipFormatter = (value, name) => {
    return [formatNumber ? formatNumber(value) : value, name];
  };

  // Set layout based on orientation
  const layout = orientation === 'vertical' ? 'vertical' : 'horizontal';

  return (
    <div className="line-chart">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart
          data={chartData}
          layout={layout}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 30
          }}
        >
          {/* Grid */}
          {(visibilityOptions.showGridX || visibilityOptions.showGridY) && (
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={visibilityOptions.showGridX}
              vertical={visibilityOptions.showGridY}
            />
          )}

          {/* X Axis */}
          {visibilityOptions.showXAxis !== false && (
            <XAxis
              dataKey={xAxisKey}
              type="category"
              tick={{
                fontSize: styleOptions.fontSize,
                fill: styleOptions.xAxisLabelColor
              }}
              tickMargin={10}
              ticks={getAxisTicks('x')}
              domain={[axisOptions.xRange.min, axisOptions.xRange.max]}
              hide={visibilityOptions.showXAxis === false}
            >
              {axisOptions.xTitle && (
                <Label
                  value={axisOptions.xTitle}
                  position="bottom"
                  style={{
                    textAnchor: 'middle',
                    fontSize: styleOptions.fontSize,
                    fill: styleOptions.xAxisLabelColor
                  }}
                  dy={15}
                />
              )}
            </XAxis>
          )}

          {/* Y Axis */}
          {visibilityOptions.showYAxis !== false && (
            <YAxis
              scale={logScale ? 'log' : 'auto'}
              tickFormatter={formatYAxis}
              tick={{
                fontSize: styleOptions.fontSize,
                fill: styleOptions.yAxisLabelColor
              }}
              ticks={getAxisTicks('y')}
              domain={[
                axisOptions.yRange.min !== null ? axisOptions.yRange.min : 'auto',
                axisOptions.yRange.max !== null ? axisOptions.yRange.max : 'auto'
              ]}
              hide={visibilityOptions.showYAxis === false}
              allowDataOverflow
            >
              {axisOptions.yTitle && (
                <Label
                  value={axisOptions.yTitle}
                  angle={-90}
                  position="left"
                  style={{
                    textAnchor: 'middle',
                    fontSize: styleOptions.fontSize,
                    fill: styleOptions.yAxisLabelColor
                  }}
                  dx={-20}
                />
              )}
            </YAxis>
          )}

          {/* Tooltip */}
          <Tooltip
            formatter={tooltipFormatter}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '4px',
              fontSize: styleOptions.fontSize,
              fontFamily: styleOptions.fontFamily
            }}
          />

          {/* Legend */}
          {visibilityOptions.showLegend !== false && (
            <Legend
              verticalAlign={styleOptions.legendPosition === 'top' ? 'top' : 'bottom'}
              layout={styleOptions.legendLayout === 'vertical' ? 'vertical' : 'horizontal'}
              wrapperStyle={{
                paddingTop: styleOptions.legendPosition === 'bottom' ? '10px' : '0',
                paddingBottom: styleOptions.legendPosition === 'top' ? '10px' : '0',
                fontSize: styleOptions.fontSize,
                fontFamily: styleOptions.fontFamily,
                backgroundColor: styleOptions.legendBgColor !== 'transparent' ? styleOptions.legendBgColor : undefined
              }}
            />
          )}

          {/* Data Lines */}
          {yAxisKeys.map((key, index) => {
            const color = styleOptions.colorPalette ?
              styleOptions.colorPalette[index % styleOptions.colorPalette.length] :
              ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'][index % 5];

            const seriesStyle = lineStyles && lineStyles[key] ? lineStyles[key] : {};
            const thickness = seriesStyle.thickness || defaultLineThickness || 2;
            const dotSize = seriesStyle.dotSize || defaultDotSize || 4;

            // If fill area is enabled, use Area component
            return fillArea ? (
              <Area
                key={key}
                type={curveType || 'monotone'}
                dataKey={key}
                stroke={color}
                fill={`${color}20`} // Semi-transparent fill
                strokeWidth={thickness}
                dot={visibilityOptions.showPoints !== false ? { r: dotSize } : false}
                activeDot={{ r: dotSize * 1.5 }}
                name={key}
                isAnimationActive={true}
              />
            ) : (
              <Line
                key={key}
                type={curveType || 'monotone'}
                dataKey={key}
                stroke={color}
                strokeWidth={thickness}
                dot={visibilityOptions.showPoints !== false ? { r: dotSize } : false}
                activeDot={{ r: dotSize * 1.5 }}
                name={key}
                isAnimationActive={true}
                label={visibilityOptions.showValues ? {
                  position: 'top',
                  formatter: formatNumber,
                  fontSize: styleOptions.fontSize * 0.8
                } : false}
              />
            );
          })}

          {/* Zero reference line if needed */}
          {axisOptions.yRange.min < 0 && axisOptions.yRange.max > 0 && (
            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
          )}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;