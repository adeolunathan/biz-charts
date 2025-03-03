// FILE: ~/Downloads/my work/bizcharts/frontend/src/contexts/ChartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Default sample data
const DEFAULT_DATA = [
  { date: '1', Rev: 5000, COGS: 32000, 'Gross Profit': 13000 },
  { date: '2', Rev: 47500, COGS: 33500, 'Gross Profit': 14000 },
  { date: '3', Rev: 51000, COGS: 35000, 'Gross Profit': 16000 },
  { date: '4', Rev: 49000, COGS: 34500, 'Gross Profit': 14500 },
  { date: '5', Rev: 52500, COGS: 36000, 'Gross Profit': 16500 },
  { date: '6', Rev: 56000, COGS: 37500, 'Gross Profit': 18500 },
  { date: '7', Rev: 58000, COGS: 38000, 'Gross Profit': 20000 },
  { date: '8', Rev: 61000, COGS: 39500, 'Gross Profit': 21500 }
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
  const [xAxisKey, setXAxisKey] = useState('date');
  const [yAxisKeys, setYAxisKeys] = useState(['Rev', 'COGS', 'Gross Profit']);

  // Chart customization
  const [chartTitle, setChartTitle] = useState('Monthly Sales Performance');

  // Visible data range for large datasets
  const [visibleRows, setVisibleRows] = useState({
    start: 0,
    end: 100 // Default to showing all rows
  });
  const [rangeValue, setRangeValue] = useState(100);

  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('options');

  // Line style
  const [lineStyles, setLineStyles] = useState({});
  const [defaultLineThickness, setDefaultLineThickness] = useState(2);
  const [defaultDotSize, setDefaultDotSize] = useState(4);
  const [orientation, setOrientation] = useState('horizontal');
  const [logScale, setLogScale] = useState(false);
  const [curveType, setCurveType] = useState('step');
  const [fillArea, setFillArea] = useState(false);

  // Visibility options
  const [visibilityOptions, setVisibilityOptions] = useState({
    showXAxis: true,
    showYAxis: true,
    showGridX: true,
    showGridY: true,
    showLegend: true,
    showPoints: true,
    showValues: false
  });

  // Update visibility options
  const updateVisibilityOptions = (updates) => {
    setVisibilityOptions(prev => ({ ...prev, ...updates }));
  };

  // Style options
  const [styleOptions, setStyleOptions] = useState({
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 12,
    bgColor: '#ffffff',
    colorPalette: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
    xAxisLabelColor: '#666666',
    yAxisLabelColor: '#666666',
    xAxisTickColor: '#666666',
    yAxisTickColor: '#666666',
    legendPosition: 'bottom',
    legendLayout: 'horizontal',
    legendBgColor: 'transparent'
  });

  // Utility function to update partial style options
  const updateStyleOptions = (updates) => {
    setStyleOptions(prev => ({ ...prev, ...updates }));
  };

  // Axis options
  const [axisOptions, setAxisOptions] = useState({
    xTitle: '',
    yTitle: '',
    xRange: { min: null, max: null },
    yRange: { min: null, max: null },
    xTicks: { interval: 'auto' },
    yTicks: { interval: 'auto', tickFormatter: null }
  });

  // Utility function to update partial axis options
  const updateAxisOptions = (updates) => {
    setAxisOptions(prev => ({ ...prev, ...updates }));
  };

  // Format options
  const [formatOptions, setFormatOptions] = useState({
    precision: 2,
    commaSeparator: true,
    decimalSeparator: '.',
    prefix: '',
    postfix: ''
  });

  // Utility function to update partial format options
  const updateFormatOptions = (updates) => {
    setFormatOptions(prev => ({ ...prev, ...updates }));
  };

  // Data transformation options
  const [transforms, setTransforms] = useState({
    normalize: false,
    cumulative: false,
    percentage: false,
    movingAverage: {
      enabled: false,
      window: 3
    }
  });

  // Sort order
  const [sortOrder, setSortOrder] = useState('default');

  // Available columns (calculated)
  const [availableColumns, setAvailableColumns] = useState([]);

  // Calculate available columns whenever data changes
  useEffect(() => {
    if (chartData.length > 0) {
      const allColumns = Object.keys(chartData[0]);
      const usedColumns = [xAxisKey, ...yAxisKeys];
      const availableCols = allColumns.filter(col => !usedColumns.includes(col));
      setAvailableColumns(availableCols);
    }
  }, [chartData, xAxisKey, yAxisKeys]);

  // Get processed data with transformations applied
  const getProcessedData = () => {
    if (!chartData || chartData.length === 0) return [];

    // Start with sorting if needed
    let processedData = [...chartData];

    if (sortOrder !== 'default') {
      processedData.sort((a, b) => {
        if (sortOrder === 'ascending') {
          return a[xAxisKey] > b[xAxisKey] ? 1 : -1;
        } else if (sortOrder === 'descending') {
          return a[xAxisKey] < b[xAxisKey] ? 1 : -1;
        }
        return 0;
      });
    }

    // Apply range filter
    const maxRows = Math.ceil(processedData.length * (rangeValue / 100));
    processedData = processedData.slice(0, maxRows);

    // Apply data transformations
    if (transforms.normalize) {
      processedData = normalizeData(processedData);
    }
    if (transforms.cumulative) {
      processedData = cumulativeData(processedData);
    }
    if (transforms.percentage) {
      processedData = percentageData(processedData);
    }
    if (transforms.movingAverage && transforms.movingAverage.enabled) {
      processedData = movingAverageData(processedData);
    }

    return processedData;
  };

  // Normalization transformation
  const normalizeData = (data) => {
    const result = [...data];
    yAxisKeys.forEach(key => {
      // Find min and max
      const values = data.map(d => d[key]).filter(v => !isNaN(v));
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min;

      // Normalize values between 0 and 1
      if (range > 0) {
        for (let i = 0; i < result.length; i++) {
          if (!isNaN(result[i][key])) {
            result[i][key] = (result[i][key] - min) / range;
          }
        }
      }
    });
    return result;
  };

  // Cumulative transformation
  const cumulativeData = (data) => {
    const result = [...data];
    yAxisKeys.forEach(key => {
      let sum = 0;
      for (let i = 0; i < result.length; i++) {
        if (!isNaN(result[i][key])) {
          sum += Number(result[i][key]);
          result[i][key] = sum;
        }
      }
    });
    return result;
  };

  // Percentage transformation
  const percentageData = (data) => {
    const result = [...data];
    yAxisKeys.forEach(key => {
      // Calculate total
      const total = data.reduce((sum, item) => sum + (isNaN(item[key]) ? 0 : Number(item[key])), 0);

      // Convert to percentage
      if (total > 0) {
        for (let i = 0; i < result.length; i++) {
          if (!isNaN(result[i][key])) {
            result[i][key] = (result[i][key] / total) * 100;
          }
        }
      }
    });
    return result;
  };

  // Moving average transformation
  const movingAverageData = (data) => {
    const result = JSON.parse(JSON.stringify(data)); // Deep clone
    const window = transforms.movingAverage.window;

    if (window < 2 || data.length < window) return result;

    yAxisKeys.forEach(key => {
      for (let i = 0; i < result.length; i++) {
        const start = Math.max(0, i - window + 1);
        const end = i + 1;
        const values = data.slice(start, end).map(d => d[key]).filter(v => !isNaN(v));

        if (values.length > 0) {
          const sum = values.reduce((a, b) => a + b, 0);
          const maKey = `${key}_MA`;
          result[i][maKey] = sum / values.length;
        }
      }
    });
    return result;
  };

  // Format a number according to current format options
  const formatNumber = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '';

    const { precision, commaSeparator, decimalSeparator, prefix, postfix } = formatOptions;

    let formatted = Number(value).toFixed(precision);

    // Apply comma separator
    if (commaSeparator) {
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      formatted = parts.join('.');
    }

    // Apply decimal separator
    if (decimalSeparator !== '.') {
      formatted = formatted.replace('.', decimalSeparator);
    }

    // Apply prefix and postfix
    return `${prefix}${formatted}${postfix}`;
  };

  // Import CSV data
  const importCsv = (csvString) => {
    const rows = csvString.split('\n');
    if (rows.length < 2) return false;

    // Parse headers
    const headers = rows[0].split(',').map(h => h.trim());

    // Parse data rows
    const data = [];
    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue;

      const values = rows[i].split(',');
      const rowData = {};

      headers.forEach((header, index) => {
        let value = values[index] ? values[index].trim() : '';
        // Try to convert to number if possible
        const num = parseFloat(value);
        rowData[header] = isNaN(num) ? value : num;
      });

      data.push(rowData);
    }

    if (data.length > 0) {
      setChartData(data);
      setXAxisKey(headers[0]);

      // Set first numeric column as y-axis
      const numericColumn = headers.find(header =>
        data[0][header] !== undefined && !isNaN(data[0][header])
      );

      if (numericColumn) {
        setYAxisKeys([numericColumn]);
      }

      return true;
    }

    return false;
  };

  // Context value containing all state and functions
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
    availableColumns,
    getProcessedData,

    // Visible data range
    visibleRows,
    setVisibleRows,
    rangeValue,
    setRangeValue,

    // Chart customization
    chartTitle,
    setChartTitle,

    // Line style
    lineStyles,
    setLineStyles,
    defaultLineThickness,
    setDefaultLineThickness,
    defaultDotSize,
    setDefaultDotSize,
    orientation,
    setOrientation,
    logScale,
    setLogScale,
    curveType,
    setCurveType,
    fillArea,
    setFillArea,

    // UI state
    isFullscreen,
    setIsFullscreen,
    activeTab,
    setActiveTab,

    // Visibility options
    visibilityOptions,
    updateVisibilityOptions,

    // Style options
    styleOptions,
    updateStyleOptions,

    // Axis options
    axisOptions,
    updateAxisOptions,

    // Format options
    formatOptions,
    updateFormatOptions,
    formatNumber,

    // Data transformations
    transforms,
    setTransforms,

    // Sort order
    sortOrder,
    setSortOrder,

    // Data import/export
    importCsv
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