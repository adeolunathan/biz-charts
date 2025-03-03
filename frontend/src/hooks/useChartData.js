// FILE: ~/Downloads/my work/bizcharts/frontend/src/hooks/useChartData.js
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

// Default sample data for new charts
const DEFAULT_DATA = [
  { x: 'A', y: 1 },
  { x: 'B', y: 2 },
  { x: 'C', y: 3 },
  { x: 'D', y: 4 },
  { x: 'E', y: 5 }
];

/**
 * Custom hook for managing chart data
 * Handles data loading, processing, column selection, and data filtering
 */
const useChartData = () => {
  // Chart data state
  const [chartData, setChartData] = useState(DEFAULT_DATA);
  const [xAxisKey, setXAxisKey] = useState('x');
  const [yAxisKeys, setYAxisKeys] = useState(['y']);

  // Available columns after removing used ones
  const [availableColumns, setAvailableColumns] = useState([]);

  // Visible data range for large datasets
  const [visibleRows, setVisibleRows] = useState({
    start: 0,
    end: 100 // Default to showing all rows
  });
  const [rangeValue, setRangeValue] = useState(100);

  // Sort options
  const [sortOrder, setSortOrder] = useState('default');
  const [sortedData, setSortedData] = useState([]);

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

  // Update available columns whenever data changes
  useEffect(() => {
    if (chartData.length > 0) {
      const allColumns = Object.keys(chartData[0]);
      const usedColumns = [xAxisKey, ...yAxisKeys];
      const availableCols = allColumns.filter(col => !usedColumns.includes(col));
      setAvailableColumns(availableCols);
    }
  }, [chartData, xAxisKey, yAxisKeys]);

  // Update visible data based on slider
  useEffect(() => {
    if (chartData.length > 0) {
      const sliderMax = Math.max(Math.floor(chartData.length * (rangeValue / 100)), 1);
      setVisibleRows({
        start: 0,
        end: sliderMax
      });
    }
  }, [rangeValue, chartData]);

  // Apply sorting whenever sort order changes
  useEffect(() => {
    if (sortOrder === 'default' || !chartData.length) {
      setSortedData([...chartData]);
      return;
    }

    const newData = [...chartData];

    if (sortOrder === 'ascending') {
      newData.sort((a, b) => {
        if (typeof a[xAxisKey] === 'number' && typeof b[xAxisKey] === 'number') {
          return a[xAxisKey] - b[xAxisKey];
        }
        return String(a[xAxisKey]).localeCompare(String(b[xAxisKey]));
      });
    } else if (sortOrder === 'descending') {
      newData.sort((a, b) => {
        if (typeof a[xAxisKey] === 'number' && typeof b[xAxisKey] === 'number') {
          return b[xAxisKey] - a[xAxisKey];
        }
        return String(b[xAxisKey]).localeCompare(String(a[xAxisKey]));
      });
    }

    setSortedData(newData);
  }, [sortOrder, chartData, xAxisKey]);

  // Get visible data based on range slider and sorting
  const getVisibleData = () => {
    if (chartData.length === 0) return [];

    const dataToUse = sortOrder !== 'default' ? sortedData : chartData;
    const end = Math.min(visibleRows.end, dataToUse.length);

    let result = dataToUse.slice(visibleRows.start, end);

    // Apply any data transformations
    if (transforms.normalize) {
      result = normalizeData(result);
    }

    if (transforms.cumulative) {
      result = cumulativeData(result);
    }

    if (transforms.percentage) {
      result = percentageData(result);
    }

    if (transforms.movingAverage.enabled) {
      result = movingAverageData(result, transforms.movingAverage.window);
    }

    return result;
  };

  // Data transformation functions
  const normalizeData = (data) => {
    // Find min/max for each Y axis
    const mins = {};
    const maxs = {};

    yAxisKeys.forEach(key => {
      mins[key] = Infinity;
      maxs[key] = -Infinity;
    });

    // Find min and max for each y-axis
    data.forEach(row => {
      yAxisKeys.forEach(key => {
        if (typeof row[key] === 'number') {
          mins[key] = Math.min(mins[key], row[key]);
          maxs[key] = Math.max(maxs[key], row[key]);
        }
      });
    });

    // Normalize the data to 0-1 range
    return data.map(row => {
      const newRow = { ...row };

      yAxisKeys.forEach(key => {
        if (typeof row[key] === 'number') {
          const range = maxs[key] - mins[key];
          newRow[key] = range === 0 ? 0 : (row[key] - mins[key]) / range;
        }
      });

      return newRow;
    });
  };

  const cumulativeData = (data) => {
    // Calculate running totals for each Y axis
    const sums = {};
    yAxisKeys.forEach(key => {
      sums[key] = 0;
    });

    return data.map(row => {
      const newRow = { ...row };

      yAxisKeys.forEach(key => {
        if (typeof row[key] === 'number') {
          sums[key] += row[key];
          newRow[key] = sums[key];
        }
      });

      return newRow;
    });
  };

  const percentageData = (data) => {
    // Calculate total for each Y axis
    const totals = {};
    yAxisKeys.forEach(key => {
      totals[key] = 0;
    });

    // Sum up all values
    data.forEach(row => {
      yAxisKeys.forEach(key => {
        if (typeof row[key] === 'number') {
          totals[key] += row[key];
        }
      });
    });

    // Convert to percentages
    return data.map(row => {
      const newRow = { ...row };

      yAxisKeys.forEach(key => {
        if (typeof row[key] === 'number') {
          newRow[key] = totals[key] === 0 ? 0 : (row[key] / totals[key]) * 100;
        }
      });

      return newRow;
    });
  };

  const movingAverageData = (data, window) => {
    if (window < 2 || data.length < window) {
      return data;
    }

    const result = [];

    // For each data point
    for (let i = 0; i < data.length; i++) {
      const newRow = { ...data[i] };

      // For each y-axis
      yAxisKeys.forEach(key => {
        // Check if we can calculate a moving average
        if (i >= window - 1) {
          let sum = 0;
          for (let j = 0; j < window; j++) {
            const val = data[i - j][key];
            if (typeof val === 'number') {
              sum += val;
            }
          }
          newRow[`${key}_MA`] = sum / window;
        } else {
          newRow[`${key}_MA`] = null;
        }
      });

      result.push(newRow);
    }

    return result;
  };

  // Import data from CSV
  const importCsv = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const csvData = event.target.result;
          const result = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
          });

          if (result.data && result.data.length > 0) {
            // Set chart data
            setChartData(result.data);

            // Set x-axis key to first column
            const firstColumnName = Object.keys(result.data[0])[0];
            setXAxisKey(firstColumnName);

            // Set y-axis keys to all other columns (up to 5 by default)
            const columns = Object.keys(result.data[0]);
            const newYAxisKeys = columns
              .filter(col => col !== firstColumnName)
              .slice(0, 5); // Limit to 5 series by default

            setYAxisKeys(newYAxisKeys);

            resolve({
              data: result.data,
              columns: columns,
              rows: result.data.length
            });
          } else {
            reject(new Error('No data found in CSV'));
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(file);
    });
  };

  // Export data to CSV
  const exportCsv = () => {
    const csvData = Papa.unparse(chartData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create download link and trigger click
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'chart_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add a new column to the data
  const addColumn = (name, defaultValue = '') => {
    if (chartData.length === 0) {
      // If no data yet, create initial data structure
      setChartData([{ [name]: defaultValue }]);
      setXAxisKey(name);
      return true;
    }

    // Check if column name already exists
    const columns = Object.keys(chartData[0]);
    if (columns.includes(name)) {
      return false;
    }

    // Add new column to all rows
    const newData = chartData.map(row => ({
      ...row,
      [name]: defaultValue
    }));

    setChartData(newData);
    return true;
  };

  // Add a Y-axis column (or create a new one)
  const addYAxisColumn = (columnName) => {
    if (columnName === 'new') {
      // Create a new column with auto-generated name
      const columns = Object.keys(chartData[0] || {});
      let newColumnName = `y${yAxisKeys.length + 1}`;

      // Avoid duplicate column names
      while (columns.includes(newColumnName)) {
        newColumnName = `y${parseInt(newColumnName.replace('y', '')) + 1}`;
      }

      // Add the column to the data
      const added = addColumn(newColumnName, '');

      if (added) {
        // Add to Y-axis keys
        setYAxisKeys([...yAxisKeys, newColumnName]);
      }

      return newColumnName;
    } else if (columnName && !yAxisKeys.includes(columnName)) {
      // Add existing column as Y-axis
      setYAxisKeys([...yAxisKeys, columnName]);
      return columnName;
    }

    return null;
  };

  // Remove a Y-axis column
  const removeYAxisColumn = (columnName) => {
    if (yAxisKeys.includes(columnName)) {
      setYAxisKeys(yAxisKeys.filter(key => key !== columnName));
      return true;
    }
    return false;
  };

  // Update cell value
  const updateCellValue = (rowIndex, columnName, value) => {
    if (rowIndex < 0 || rowIndex >= chartData.length) {
      return false;
    }

    const newValue = typeof value === 'string' && !isNaN(Number(value))
      ? Number(value)
      : value;

    const newData = [...chartData];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [columnName]: newValue
    };

    setChartData(newData);
    return true;
  };

  // Rename a column
  const renameColumn = (oldName, newName) => {
    if (!oldName || !newName || oldName === newName) {
      return false;
    }

    // Check if new name already exists
    const columns = Object.keys(chartData[0] || {});
    if (columns.includes(newName)) {
      return false;
    }

    // Update data
    const newData = chartData.map(row => {
      const newRow = { ...row };
      newRow[newName] = newRow[oldName];
      delete newRow[oldName];
      return newRow;
    });

    setChartData(newData);

    // Update xAxisKey if needed
    if (xAxisKey === oldName) {
      setXAxisKey(newName);
    }

    // Update yAxisKeys if needed
    const newYAxisKeys = yAxisKeys.map(key =>
      key === oldName ? newName : key
    );

    setYAxisKeys(newYAxisKeys);

    return true;
  };

  return {
    // Data state
    chartData,
    setChartData,
    xAxisKey,
    setXAxisKey,
    yAxisKeys,
    setYAxisKeys,
    availableColumns,

    // Visible data range
    visibleRows,
    setVisibleRows,
    rangeValue,
    setRangeValue,

    // Data access and transformation
    getVisibleData,
    sortOrder,
    setSortOrder,
    transforms,
    setTransforms,

    // CSV import/export
    importCsv,
    exportCsv,

    // Data manipulation
    addColumn,
    addYAxisColumn,
    removeYAxisColumn,
    updateCellValue,
    renameColumn
  };
};

export default useChartData;