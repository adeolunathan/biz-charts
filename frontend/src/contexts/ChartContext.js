// FILE: ~/Downloads/my work/bizcharts/frontend/src/contexts/ChartContext.js
import React, { createContext, useState, useContext } from 'react';

// Default sample data
const DEFAULT_DATA = [
  { x: 'A', y: 1 },
  { x: 'B', y: 2 },
  { x: 'C', y: 3 },
  { x: 'D', y: 4 },
  { x: 'E', y: 5 }
];

// Create the context
const ChartContext = createContext();

/**
 * ChartProvider component for global state management
 */
export const ChartProvider = ({ children }) => {
  // Chart type
  const [chartType, setChartType] = useState('line');

  // Chart data
  const [chartData, setChartData] = useState(DEFAULT_DATA);
  const [xAxisKey, setXAxisKey] = useState('x');
  const [yAxisKeys, setYAxisKeys] = useState(['y']);

  // Chart customization
  const [chartTitle, setChartTitle] = useState('');
  const [showPoints, setShowPoints] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  // Line style
  const [lineThickness, setLineThickness] = useState(2);
  const [pointSize, setPointSize] = useState(4);

  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('fields');

  // Style options
  const [styleOptions, setStyleOptions] = useState({
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 12,
    bgColor: '#ffffff',
    colorPalette: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
  });

  // Utility function to update partial style options
  const updateStyleOptions = (updates) => {
    setStyleOptions(prev => ({ ...prev, ...updates }));
  };

  // Context value
  const contextValue = {
    // Chart type
    chartType,
    setChartType,

    // Chart data
    chartData,
    setChartData,
    xAxisKey,
    setXAxisKey,
    yAxisKeys,
    setYAxisKeys,

    // Chart customization
    chartTitle,
    setChartTitle,
    showPoints,
    setShowPoints,
    showGrid,
    setShowGrid,
    showLegend,
    setShowLegend,

    // Line style
    lineThickness,
    setLineThickness,
    pointSize,
    setPointSize,

    // UI state
    isFullscreen,
    setIsFullscreen,
    activeTab,
    setActiveTab,

    // Style options
    styleOptions,
    updateStyleOptions
  };

  return (
    <ChartContext.Provider value={contextValue}>
      {children}
    </ChartContext.Provider>
  );
};

/**
 * Custom hook to use the chart context
 */
export const useChartContext = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('useChartContext must be used within a ChartProvider');
  }
  return context;
};

export default ChartContext;