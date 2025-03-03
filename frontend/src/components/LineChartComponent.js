// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/LineChartComponent.js
// Replace everything in this file with the following code:

import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Brush, Label
} from 'recharts';
import Papa from 'papaparse';
import _ from 'lodash';
import '../styles/LineChartComponent.css';

// Default sample data in CSV format
const DEFAULT_CSV = `date,revenue,expenses,profit
2023-01,45000,32000,13000
2023-02,47500,33500,14000
2023-03,51000,35000,16000
2023-04,49000,34500,14500
2023-05,52500,36000,16500
2023-06,56000,37500,18500
2023-07,58000,38000,20000
2023-08,61000,39500,21500
2023-09,64000,41000,23000
2023-10,67500,42500,25000
2023-11,71000,44000,27000
2023-12,75000,46000,29000`;

// Theme definitions
const themes = {
  default: {
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
    backgroundColor: 'white',
    gridColor: '#e0e0e0',
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
    titleColor: '#333333',
    axisColor: '#666666'
  },
  dark: {
    colors: ['#61dafb', '#fb8c00', '#4caf50', '#e53935', '#ba68c8', '#8d6e63'],
    backgroundColor: '#282c34',
    gridColor: '#444444',
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
    titleColor: '#ffffff',
    axisColor: '#aaaaaa'
  },
  pastel: {
    colors: ['#8dd3c7', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69'],
    backgroundColor: '#f8f9fa',
    gridColor: '#e9ecef',
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
    titleColor: '#495057',
    axisColor: '#6c757d'
  }
};

const LineChartComponent = ({ initialData = [] }) => {
  // State management
  const [chartData, setChartData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [chartTitle, setChartTitle] = useState('Business Performance Over Time');
  const [xAxisLabel, setXAxisLabel] = useState('Time Period');
  const [yAxisLabel, setYAxisLabel] = useState('Value');
  const [currentTheme, setCurrentTheme] = useState('default');
  const [lineType, setLineType] = useState('monotone'); // linear, monotone, step, etc.
  const [showPoints, setShowPoints] = useState(true);
  const [csvText, setCsvText] = useState(DEFAULT_CSV);
  const [parseError, setParseError] = useState(null);
  const [xAxisKey, setXAxisKey] = useState('date');
  const chartRef = useRef(null);

  // Use initialData if provided, otherwise use default
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setChartData(initialData);

      // Get all keys except the one used for X-axis
      const firstItem = initialData[0];
      const keys = Object.keys(firstItem).filter(key => key !== xAxisKey);
      setColumns(keys);
      setSelectedColumns(keys.slice(0, 3)); // Select first three by default

      // Convert data to CSV for display
      const csv = Papa.unparse(initialData);
      setCsvText(csv);
    } else {
      // Process the default CSV data
      processData(DEFAULT_CSV);
    }
  }, [initialData]);

  // Process CSV data
  const processData = (csvData) => {
    try {
      setParseError(null);

      const result = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true, // Automatically convert numeric values
      });

      if (result.errors && result.errors.length > 0) {
        setParseError(`CSV parsing error: ${result.errors[0].message}`);
        return;
      }

      if (result.data && result.data.length > 0) {
        // Validate that we have at least one numeric column
        const firstRow = result.data[0];
        const numericColumns = Object.keys(firstRow).filter(key =>
          typeof firstRow[key] === 'number'
        );

        if (numericColumns.length === 0) {
          setParseError("No numeric columns found. Please ensure your CSV has at least one column with numeric values.");
          return;
        }

        // Identify a potential X-axis column (prefer 'date' or first column)
        const potentialXAxisKey =
          Object.keys(firstRow).includes('date') ? 'date' :
          Object.keys(firstRow)[0];

        setXAxisKey(potentialXAxisKey);
        setChartData(result.data);

        // Get all column names except the X-axis column
        const dataKeys = Object.keys(firstRow).filter(key => key !== potentialXAxisKey);
        setColumns(dataKeys);

        // If no columns are currently selected or selected columns aren't in the new data,
        // select the first three numeric columns by default
        const validNumericColumns = numericColumns.filter(col => col !== potentialXAxisKey);
        const columnsToSelect = validNumericColumns.slice(0, Math.min(3, validNumericColumns.length));

        setSelectedColumns(columnsToSelect);
      } else {
        setParseError("No valid data rows found in the CSV.");
      }
    } catch (error) {
      console.error('Error parsing CSV data:', error);
      setParseError(`Error parsing CSV: ${error.message}`);
    }
  };

  const handleColumnToggle = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
  };

  const handleCsvChange = (e) => {
    const newCsvText = e.target.value;
    setCsvText(newCsvText);
    processData(newCsvText);
  };

  const exportChart = (format) => {
    if (format === 'csv') {
      // Export current data as CSV
      const csvData = Papa.unparse(chartData);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${chartTitle.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'png' || format === 'svg') {
      alert(`${format.toUpperCase()} export would be implemented here.`);
      // For PNG/SVG export, we would need to use a library like html2canvas or dom-to-image
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;
        setCsvText(csvData);
        processData(csvData);
      };
      reader.readAsText(file);
    }
  };

  const theme = themes[currentTheme];

  return (
    <div className="chart-container" style={{
      backgroundColor: theme.backgroundColor,
      color: theme.titleColor,
      fontFamily: theme.fontFamily
    }}>
      <div className="chart-title">{chartTitle}</div>

      {/* Chart */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400} ref={chartRef}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} />

            <XAxis
              dataKey={xAxisKey}
              stroke={theme.axisColor}
              tick={{ fill: theme.axisColor }}
            >
              <Label
                value={xAxisLabel}
                position="bottom"
                fill={theme.axisColor}
              />
            </XAxis>

            <YAxis
              stroke={theme.axisColor}
              tick={{ fill: theme.axisColor }}
            >
              <Label
                value={yAxisLabel}
                angle={-90}
                position="left"
                fill={theme.axisColor}
              />
            </YAxis>

            <Tooltip
              contentStyle={{
                backgroundColor: theme.backgroundColor,
                borderColor: theme.gridColor,
                color: theme.titleColor
              }}
            />

            <Legend />

            {selectedColumns.map((column, index) => (
              <Line
                key={column}
                type={lineType}
                dataKey={column}
                stroke={theme.colors[index % theme.colors.length]}
                activeDot={{ r: 8, fill: theme.colors[index % theme.colors.length] }}
                dot={showPoints}
                strokeWidth={2}
              />
            ))}

            <Brush
              dataKey={xAxisKey}
              height={30}
              stroke={theme.colors[0]}
              fill={theme.backgroundColor}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Controls */}
      <div className="controls-section">
        {/* Left Panel - Chart Settings */}
        <div className="controls-panel">
          <h3>Chart Settings</h3>

          <div className="control-group">
            <label>Chart Title:</label>
            <input
              type="text"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="control-group">
            <label>X-Axis Label:</label>
            <input
              type="text"
              value={xAxisLabel}
              onChange={(e) => setXAxisLabel(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="control-group">
            <label>Y-Axis Label:</label>
            <input
              type="text"
              value={yAxisLabel}
              onChange={(e) => setYAxisLabel(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="control-group">
            <label>X-Axis Data Column:</label>
            <select
              value={xAxisKey}
              onChange={(e) => setXAxisKey(e.target.value)}
              className="select-field"
            >
              {chartData.length > 0 && Object.keys(chartData[0]).map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Theme:</label>
            <select
              value={currentTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="select-field"
            >
              <option value="default">Default</option>
              <option value="dark">Dark</option>
              <option value="pastel">Pastel</option>
            </select>
          </div>

          <div className="control-group">
            <label>Line Type:</label>
            <select
              value={lineType}
              onChange={(e) => setLineType(e.target.value)}
              className="select-field"
            >
              <option value="linear">Linear</option>
              <option value="monotone">Monotone</option>
              <option value="step">Step</option>
              <option value="basis">Basis</option>
            </select>
          </div>

          <div className="control-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={showPoints}
                onChange={() => setShowPoints(!showPoints)}
              />
              Show Data Points
            </label>
          </div>
        </div>

        {/* Right Panel - Data Input */}
        <div className="controls-panel">
          <h3>Data Input</h3>

          <div className="control-group">
            <label>Upload CSV:</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="file-input"
            />
          </div>

          <div className="control-group">
            <label>CSV Data:</label>
            <textarea
              value={csvText}
              onChange={handleCsvChange}
              rows={8}
              className="textarea-field"
              placeholder="Paste your CSV data here..."
            />
            {parseError && (
              <div className="error-message">{parseError}</div>
            )}
          </div>

          <div className="control-group">
            <label>Data Series:</label>
            <div className="checkbox-group">
              {columns.map(column => (
                <label key={column} className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column)}
                    onChange={() => handleColumnToggle(column)}
                  />
                  {column}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="export-section">
        <h3>Export Options</h3>
        <div className="button-group">
          <button className="button button-primary" onClick={() => exportChart('png')}>
            Download PNG
          </button>
          <button className="button button-primary" onClick={() => exportChart('svg')}>
            Download SVG
          </button>
          <button className="button button-primary" onClick={() => exportChart('csv')}>
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default LineChartComponent;