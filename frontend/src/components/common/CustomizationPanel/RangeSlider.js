// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/common/RangeSlider.js
import React from 'react';
import { useChartContext } from '../../contexts/ChartContext';

/**
 * RangeSlider component for filtering data on large datasets
 * This allows users to view a subset of their data
 */
const RangeSlider = () => {
  const {
    // Range slider state
    rangeValue,
    setRangeValue,

    // Visible data range
    visibleRows,

    // Chart data
    chartData
  } = useChartContext();

  // Handle range slider change
  const handleRangeChange = (e) => {
    setRangeValue(parseInt(e.target.value));
  };

  // Skip rendering if no data
  if (!chartData || chartData.length === 0) {
    return null;
  }

  return (
    <div className="range-slider-container">
      <input
        type="range"
        min="1"
        max="100"
        value={rangeValue}
        onChange={handleRangeChange}
        className="range-slider"
      />
      <div className="range-slider-label">
        Showing {visibleRows.start + 1} to {Math.min(visibleRows.end, chartData.length)} of {chartData.length} rows
      </div>
    </div>
  );
};

export default RangeSlider;