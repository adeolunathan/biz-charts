// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/ChartInterface.js
// Search for "Y-AXIS SELECTOR" to find the modified section for column selection
// Search for "LEGEND FORMATTING" to find new legend controls
// Search for "LINE STYLING" to find line thickness controls
// Search for "EXPORT FUNCTIONS" to find enhanced export functionality

import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import '../styles/ChartInterface.css';

// Default sample data
const DEFAULT_DATA = [
  { x: 'A', y: 1 },
  { x: 'B', y: 2 },
  { x: 'C', y: 3 },
  { x: 'D', y: 4 },
  { x: 'E', y: 5 }
];

const ChartInterface = () => {
  // Data state
  const [chartData, setChartData] = useState(DEFAULT_DATA);
  const [xAxisKey, setXAxisKey] = useState('x');
  const [yAxisKeys, setYAxisKeys] = useState(['y']);
  const [activeCell, setActiveCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editingHeader, setEditingHeader] = useState(null);
  const [headerEditValue, setHeaderEditValue] = useState('');

  // Visible data range
  const [visibleRows, setVisibleRows] = useState({
    start: 0,
    end: 100 // Default to showing all rows
  });

  // Chart customization state
  const [chartTitle, setChartTitle] = useState('');
  const [xAxisTitle, setXAxisTitle] = useState('');
  const [yAxisTitle, setYAxisTitle] = useState('');
  const [fontSize, setFontSize] = useState(12);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showLegend, setShowLegend] = useState(true);
  const [logScale, setLogScale] = useState(false);
  const [orientation, setOrientation] = useState('horizontal');
  const [showValues, setShowValues] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');
  const [yAxisRange, setYAxisRange] = useState({ min: '', max: '' });
  const [axisStep, setAxisStep] = useState('');

  // Grid settings
  const [showGridX, setShowGridX] = useState(true);
  const [showGridY, setShowGridY] = useState(true);
  const [showXAxis, setShowXAxis] = useState(true);
  const [showYAxis, setShowYAxis] = useState(true);

  // Format settings
  const [commaSeparator, setCommaSeparator] = useState(true);
  const [decimalSeparator, setDecimalSeparator] = useState('.');
  const [precision, setPrecision] = useState(0);
  const [prefix, setPrefix] = useState('');
  const [postfix, setPostfix] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState('fields');
  const [colorPalette, setColorPalette] = useState([
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'
  ]);

  // LEGEND FORMATTING - New states for legend formatting
  const [legendPosition, setLegendPosition] = useState('bottom');
  const [legendLayout, setLegendLayout] = useState('horizontal');
  const [legendBgColor, setLegendBgColor] = useState('transparent');
  const [legendTextColor, setLegendTextColor] = useState('#333333');

  // LABEL FORMATTING
  const [xAxisLabelColor, setXAxisLabelColor] = useState('#333333');
  const [yAxisLabelColor, setYAxisLabelColor] = useState('#333333');
  const [xAxisTickColor, setXAxisTickColor] = useState('#666666');
  const [yAxisTickColor, setYAxisTickColor] = useState('#666666');

  // LINE STYLING
  const [lineStyles, setLineStyles] = useState({});
  const [defaultLineThickness, setDefaultLineThickness] = useState(2);
  const [defaultDotSize, setDefaultDotSize] = useState(4);

  // Y-AXIS SELECTOR - Modal states
  const [showYAxisSelector, setShowYAxisSelector] = useState(false);
  const [availableColumns, setAvailableColumns] = useState([]);

  // Refs
  const chartRef = useRef(null);
  const colorPickerRef = useRef(null);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState(null);

  // Range slider refs and state
  const [rangeValue, setRangeValue] = useState(100);
  const [sliderPosition, setSliderPosition] = useState({
    min: 0,
    max: 100
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

  // Initialize line styles when y-axis keys change
  useEffect(() => {
    const newLineStyles = {};
    yAxisKeys.forEach(key => {
      if (!lineStyles[key]) {
        newLineStyles[key] = {
          thickness: defaultLineThickness,
          dotSize: defaultDotSize
        };
      } else {
        newLineStyles[key] = lineStyles[key];
      }
    });
    setLineStyles(newLineStyles);
  }, [yAxisKeys, defaultLineThickness, defaultDotSize]);

  // Handle cell click in the data grid
  const handleCellClick = (rowIndex, columnName) => {
    setActiveCell({ rowIndex, columnName });
    setEditValue(chartData[rowIndex][columnName] !== undefined ?
      String(chartData[rowIndex][columnName]) : '');
  };

  // Handle cell value change
  const handleCellChange = (e) => {
    setEditValue(e.target.value);
  };

  // Update data when cell editing is complete
  const handleCellBlur = () => {
    if (activeCell) {
      const { rowIndex, columnName } = activeCell;
      const newData = [...chartData];

      // Try to convert to number if it looks like a number
      const numValue = parseFloat(editValue);
      const value = !isNaN(numValue) && editValue.trim() !== '' ? numValue : editValue;

      newData[rowIndex] = { ...newData[rowIndex], [columnName]: value };
      setChartData(newData);
      setActiveCell(null);
    }
  };

  // Handle header click for editing
  const handleHeaderClick = (columnName) => {
    setEditingHeader(columnName);
    setHeaderEditValue(columnName);
  };

  // Handle header value change
  const handleHeaderChange = (e) => {
    setHeaderEditValue(e.target.value);
  };

  // Update header when editing is complete
  const handleHeaderBlur = () => {
    if (editingHeader && headerEditValue && headerEditValue !== editingHeader) {
      const newData = chartData.map(row => {
        const newRow = { ...row };
        newRow[headerEditValue] = newRow[editingHeader];
        delete newRow[editingHeader];
        return newRow;
      });

      setChartData(newData);

      // Update xAxisKey if needed
      if (xAxisKey === editingHeader) {
        setXAxisKey(headerEditValue);
      }

      // Update yAxisKeys if needed
      const newYAxisKeys = yAxisKeys.map(key =>
        key === editingHeader ? headerEditValue : key
      );
      setYAxisKeys(newYAxisKeys);

      // Update line styles if needed
      if (lineStyles[editingHeader]) {
        const newLineStyles = { ...lineStyles };
        newLineStyles[headerEditValue] = newLineStyles[editingHeader];
        delete newLineStyles[editingHeader];
        setLineStyles(newLineStyles);
      }

      setEditingHeader(null);
    } else {
      setEditingHeader(null);
    }
  };

  // Handle keyboard navigation in the grid
  const handleKeyDown = (e, type = 'cell') => {
    if (type === 'cell' && !activeCell) return;
    if (type === 'header' && !editingHeader) return;

    if (e.key === 'Enter') {
      if (type === 'cell') {
        handleCellBlur();

        // Move to next row
        if (activeCell.rowIndex < chartData.length - 1) {
          const newRowIndex = activeCell.rowIndex + 1;
          setActiveCell({ rowIndex: newRowIndex, columnName: activeCell.columnName });
          setEditValue(chartData[newRowIndex][activeCell.columnName] !== undefined ?
            String(chartData[newRowIndex][activeCell.columnName]) : '');
        }
      } else {
        handleHeaderBlur();
      }
      e.preventDefault();
    } else if (e.key === 'Tab') {
      e.preventDefault();

      if (type === 'cell') {
        handleCellBlur();

        const columns = Object.keys(chartData[0] || {});
        const currentColumnIndex = columns.indexOf(activeCell.columnName);

        if (e.shiftKey) {
          // Move to previous cell
          if (currentColumnIndex > 0) {
            // Previous column in same row
            const newColumn = columns[currentColumnIndex - 1];
            setActiveCell({ rowIndex: activeCell.rowIndex, columnName: newColumn });
            setEditValue(chartData[activeCell.rowIndex][newColumn] !== undefined ?
              String(chartData[activeCell.rowIndex][newColumn]) : '');
          } else if (activeCell.rowIndex > 0) {
            // Last column in previous row
            const newRowIndex = activeCell.rowIndex - 1;
            const newColumn = columns[columns.length - 1];
            setActiveCell({ rowIndex: newRowIndex, columnName: newColumn });
            setEditValue(chartData[newRowIndex][newColumn] !== undefined ?
              String(chartData[newRowIndex][newColumn]) : '');
          }
        } else {
          // Move to next cell
          if (currentColumnIndex < columns.length - 1) {
            // Next column in same row
            const newColumn = columns[currentColumnIndex + 1];
            setActiveCell({ rowIndex: activeCell.rowIndex, columnName: newColumn });
            setEditValue(chartData[activeCell.rowIndex][newColumn] !== undefined ?
              String(chartData[activeCell.rowIndex][newColumn]) : '');
          } else if (activeCell.rowIndex < chartData.length - 1) {
            // First column in next row
            const newRowIndex = activeCell.rowIndex + 1;
            const newColumn = columns[0];
            setActiveCell({ rowIndex: newRowIndex, columnName: newColumn });
            setEditValue(chartData[newRowIndex][newColumn] !== undefined ?
              String(chartData[newRowIndex][newColumn]) : '');
          }
        }
      }
    } else if (e.key === 'ArrowUp' && type === 'cell') {
      e.preventDefault();
      handleCellBlur();

      if (activeCell.rowIndex > 0) {
        const newRowIndex = activeCell.rowIndex - 1;
        setActiveCell({ rowIndex: newRowIndex, columnName: activeCell.columnName });
        setEditValue(chartData[newRowIndex][activeCell.columnName] !== undefined ?
          String(chartData[newRowIndex][activeCell.columnName]) : '');
      }
    } else if (e.key === 'ArrowDown' && type === 'cell') {
      e.preventDefault();
      handleCellBlur();

      if (activeCell.rowIndex < chartData.length - 1) {
        const newRowIndex = activeCell.rowIndex + 1;
        setActiveCell({ rowIndex: newRowIndex, columnName: activeCell.columnName });
        setEditValue(chartData[newRowIndex][activeCell.columnName] !== undefined ?
          String(chartData[newRowIndex][activeCell.columnName]) : '');
      }
    } else if (e.key === 'ArrowLeft' && type === 'cell') {
      e.preventDefault();
      handleCellBlur();

      const columns = Object.keys(chartData[0] || {});
      const currentColumnIndex = columns.indexOf(activeCell.columnName);

      if (currentColumnIndex > 0) {
        const newColumn = columns[currentColumnIndex - 1];
        setActiveCell({ rowIndex: activeCell.rowIndex, columnName: newColumn });
        setEditValue(chartData[activeCell.rowIndex][newColumn] !== undefined ?
          String(chartData[activeCell.rowIndex][newColumn]) : '');
      }
    } else if (e.key === 'ArrowRight' && type === 'cell') {
      e.preventDefault();
      handleCellBlur();

      const columns = Object.keys(chartData[0] || {});
      const currentColumnIndex = columns.indexOf(activeCell.columnName);

      if (currentColumnIndex < columns.length - 1) {
        const newColumn = columns[currentColumnIndex + 1];
        setActiveCell({ rowIndex: activeCell.rowIndex, columnName: newColumn });
        setEditValue(chartData[activeCell.rowIndex][newColumn] !== undefined ?
          String(chartData[activeCell.rowIndex][newColumn]) : '');
      }
    }
  };

  // Add a new row to the data grid
  const addRow = () => {
    const newRow = {};
    Object.keys(chartData[0] || {}).forEach(key => {
      newRow[key] = '';
    });
    setChartData([...chartData, newRow]);
  };

  // Add a new column to the data grid
  const addColumn = () => {
    if (chartData.length === 0) {
      // If no data yet, create initial data structure
      setChartData([{ newColumn: '' }]);
      setXAxisKey('newColumn');
      return;
    }

    const columns = Object.keys(chartData[0]);
    let newColumnName = `column${columns.length + 1}`;

    // Avoid duplicate column names
    while (columns.includes(newColumnName)) {
      newColumnName = `column${parseInt(newColumnName.replace('column', '')) + 1}`;
    }

    const newData = chartData.map(row => ({
      ...row,
      [newColumnName]: ''
    }));

    setChartData(newData);

    // Check if we should add this as a Y-axis column
    if (newColumnName !== xAxisKey) {
      setYAxisKeys([...yAxisKeys, newColumnName]);
    }
  };

  // Delete a column
  const deleteColumn = (columnName) => {
    if (Object.keys(chartData[0] || {}).length <= 1) {
      alert("Cannot delete the only column.");
      return;
    }

    // Create new data without the deleted column
    const newData = chartData.map(row => {
      const newRow = { ...row };
      delete newRow[columnName];
      return newRow;
    });

    setChartData(newData);

    // Update xAxisKey if it was the deleted column
    if (xAxisKey === columnName) {
      setXAxisKey(Object.keys(newData[0])[0]);
    }

    // Update yAxisKeys if needed
    setYAxisKeys(yAxisKeys.filter(key => key !== columnName));

    // Update line styles if needed
    if (lineStyles[columnName]) {
      const newLineStyles = { ...lineStyles };
      delete newLineStyles[columnName];
      setLineStyles(newLineStyles);
    }
  };

  // Delete a row
  const deleteRow = (rowIndex) => {
    if (chartData.length <= 1) {
      alert("Cannot delete the only row.");
      return;
    }

    const newData = [...chartData];
    newData.splice(rowIndex, 1);
    setChartData(newData);
  };

  // Y-AXIS SELECTOR - Show the Y-axis selector modal
  const openYAxisSelector = () => {
    setShowYAxisSelector(true);
  };

  // Y-AXIS SELECTOR - Add a new Y-axis series
  const addYAxis = (columnName) => {
    if (columnName === 'new') {
      // Create a new column
      const columns = Object.keys(chartData[0] || {});
      let newColumnName = `y${yAxisKeys.length + 1}`;

      // Avoid duplicate column names
      while (columns.includes(newColumnName)) {
        newColumnName = `y${parseInt(newColumnName.replace('y', '')) + 1}`;
      }

      const newData = chartData.map(row => ({
        ...row,
        [newColumnName]: ''
      }));

      setChartData(newData);
      setYAxisKeys([...yAxisKeys, newColumnName]);
    } else if (columnName) {
      // Add existing column
      setYAxisKeys([...yAxisKeys, columnName]);
    }

    setShowYAxisSelector(false);
  };

  // Toggle color picker visibility
  const toggleColorPicker = (index) => {
    setActiveColorIndex(index);
    setColorPickerVisible(!colorPickerVisible);
  };

  // Change color for a specific series
  const changeColor = (index, color) => {
    const newPalette = [...colorPalette];
    newPalette[index] = color;
    setColorPalette(newPalette);
    setColorPickerVisible(false);
  };

  // LINE STYLING - Update line thickness
  const updateLineThickness = (key, thickness) => {
    setLineStyles({
      ...lineStyles,
      [key]: {
        ...lineStyles[key],
        thickness: Number(thickness)
      }
    });
  };

  // LINE STYLING - Update dot size
  const updateDotSize = (key, size) => {
    setLineStyles({
      ...lineStyles,
      [key]: {
        ...lineStyles[key],
        dotSize: Number(size)
      }
    });
  };

  // Import data from CSV
  const handleCsvImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;
        const result = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });

        if (result.data && result.data.length > 0) {
          setChartData(result.data);

          // Set x-axis key to first column
          const firstColumnName = Object.keys(result.data[0])[0];
          setXAxisKey(firstColumnName);

          // Set y-axis keys to all other columns
          const columns = Object.keys(result.data[0]);
          setYAxisKeys(columns.filter(col => col !== firstColumnName));
        }
      };
      reader.readAsText(file);
    }
  };

  // EXPORT FUNCTIONS - Export chart as PNG
  const exportPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current, {
        backgroundColor: bgColor,
        scale: 2 // Higher quality
      }).then(canvas => {
        canvas.toBlob(blob => {
          saveAs(blob, `${chartTitle || 'chart'}.png`);
        });
      });
    }
  };

  // EXPORT FUNCTIONS - Export chart as SVG
  const exportSVG = () => {
    if (chartRef.current) {
      // For SVG export, we'd need a more complex implementation or a library
      // This is a placeholder alert
      alert('SVG export would be implemented with a library like svg-crowbar or saveSvgAsPng');
    }
  };

  // EXPORT FUNCTIONS - Export data as CSV
  const exportCSV = () => {
    const csvData = Papa.unparse(chartData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${chartTitle || 'chart_data'}.csv`);
  };

  // EXPORT FUNCTIONS - Export as PDF
  const exportPDF = () => {
    alert('PDF export would be implemented with a library like jsPDF');
  };

  // EXPORT FUNCTIONS - Generate embed code
  const getEmbedCode = () => {
    const title = chartTitle || 'Chart';
    const embedCode = `<iframe src="${window.location.origin}/embed/${title.replace(/\s+/g, '-').toLowerCase()}" width="800" height="500" frameborder="0"></iframe>`;

    // Copy to clipboard
    navigator.clipboard.writeText(embedCode).then(() => {
      alert('Embed code copied to clipboard!');
    });
  };

  // Set Y-axis auto range
  useEffect(() => {
    if (chartData.length > 0 && yAxisKeys.length > 0) {
      let min = Infinity;
      let max = -Infinity;

      chartData.forEach(row => {
        yAxisKeys.forEach(key => {
          const value = row[key];
          if (typeof value === 'number') {
            min = Math.min(min, value);
            max = Math.max(max, value);
          }
        });
      });

      if (min !== Infinity && max !== -Infinity) {
        // Round down min and round up max for nicer ranges
        min = Math.floor(min);
        max = Math.ceil(max);

        // Add some padding
        const padding = Math.max(1, Math.round((max - min) * 0.1));
        min = Math.max(0, min - padding);
        max = max + padding;

        setYAxisRange({ min, max });
      }
    }
  }, [chartData, yAxisKeys]);

  // Close color picker when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setColorPickerVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get visible data based on range slider
  const getVisibleData = () => {
    if (chartData.length === 0) return [];

    const end = Math.min(visibleRows.end, chartData.length);
    return chartData.slice(visibleRows.start, end);
  };

  // Handle range slider change
  const handleRangeChange = (e) => {
    setRangeValue(parseInt(e.target.value));
  };

  return (
    <div className="chart-interface">
      <div className="interface-header">
        <div className="logo">BizCharts</div>
        <nav className="main-nav">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
          <a href="#more">More</a>
        </nav>
        <div className="view-all">
          <button className="view-all-btn">View all charts</button>
        </div>
      </div>

      <div className="chart-title-section">
        <h1>
          <span className="highlight">Line</span> Chart Maker
        </h1>
        <p className="subtitle">Transform Your Data into Stunning Line Graph for free!</p>
      </div>

      <div className="interface-content">
        {/* Data Panel */}
        <div className="data-panel">
          <div className="panel-header">
            <h2>Data</h2>
            <button className="csv-import-btn" onClick={() => document.getElementById('csv-upload').click()}>
              <span className="icon">↑</span> CSV
            </button>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleCsvImport}
              style={{ display: 'none' }}
            />
          </div>

          <div className="data-grid-container">
            <table className="data-grid">
              <thead>
                <tr>
                  {chartData.length > 0 && Object.keys(chartData[0]).map((column, index) => (
                    <th
                      key={index}
                      className={column === xAxisKey ? 'x-axis-column' : ''}
                    >
                      <div className="header-cell">
                        {editingHeader === column ? (
                          <input
                            type="text"
                            value={headerEditValue}
                            onChange={handleHeaderChange}
                            onBlur={handleHeaderBlur}
                            onKeyDown={(e) => handleKeyDown(e, 'header')}
                            autoFocus
                            className="header-input"
                          />
                        ) : (
                          <>
                            <span
                              className="header-text"
                              onClick={() => handleHeaderClick(column)}
                            >
                              {column}
                            </span>
                            <button
                              className="delete-column-btn"
                              onClick={() => deleteColumn(column)}
                              title="Delete column"
                            >
                              ×
                            </button>
                          </>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(row).map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`
                          ${activeCell && activeCell.rowIndex === rowIndex && activeCell.columnName === column ? 'active-cell' : ''}
                          ${column === xAxisKey ? 'x-axis-column' : ''}
                        `}
                        onClick={() => handleCellClick(rowIndex, column)}
                      >
                        {activeCell && activeCell.rowIndex === rowIndex && activeCell.columnName === column ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={handleCellChange}
                            onBlur={handleCellBlur}
                            onKeyDown={(e) => handleKeyDown(e, 'cell')}
                            autoFocus
                            className="cell-input"
                          />
                        ) : (
                          <div className="cell-content">{row[column] !== undefined ? row[column] : ''}</div>
                        )}
                      </td>
                    ))}
                    <td className="row-action-cell">
                      <button
                        className="delete-row-btn"
                        onClick={() => deleteRow(rowIndex)}
                        title="Delete row"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="grid-actions">
              <button onClick={addRow}>Add Row</button>
              <button onClick={addColumn}>Add Column</button>
            </div>
          </div>
        </div>

        {/* Graph Panel */}
        <div className="graph-panel">
          <div className="panel-header">
            <h2>Graph</h2>
            <div className="export-options">
              <button className="embed-btn" onClick={getEmbedCode}>
                <span className="icon">&lt;/&gt;</span> Embed
              </button>
              <button className="image-btn" onClick={() => {
                const dropdown = document.getElementById('export-dropdown');
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
              }}>
                <span className="icon">↓</span> Export
              </button>
              <div id="export-dropdown" className="export-dropdown">
                <button onClick={exportPNG}>PNG Image</button>
                <button onClick={exportSVG}>SVG Vector</button>
                <button onClick={exportCSV}>CSV Data</button>
                <button onClick={exportPDF}>PDF Document</button>
              </div>
            </div>
          </div>

          <div className="chart-container" ref={chartRef} style={{ backgroundColor: bgColor }}>
            {chartTitle && (
              <div className="chart-title-display">
                {chartTitle}
              </div>
            )}

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                {orientation === 'vertical' ? (
                  <LineChart
                    data={getVisibleData()}
                    margin={{
                      top: chartTitle ? 10 : 30,
                      right: 30,
                      left: 20,
                      bottom: legendPosition === 'bottom' ? 40 : 30
                    }}
                    layout="vertical"
                  >
                    {(showGridX || showGridY) && (
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e0e0e0"
                        horizontal={showGridX}
                        vertical={showGridY}
                      />
                    )}

                    {showXAxis && (
                      <XAxis
                        type="number"
                        label={{
                          value: yAxisTitle,
                          position: 'bottom',
                          style: { fontSize, fill: yAxisLabelColor }
                        }}
                        tick={{ fontSize, fill: yAxisTickColor }}
                        height={50}
                        domain={[
                          yAxisRange.min !== '' ? Number(yAxisRange.min) : 'auto',
                          yAxisRange.max !== '' ? Number(yAxisRange.max) : 'auto'
                        ]}
                        scale={logScale ? 'log' : 'auto'}
                      />
                    )}

                    {showYAxis && (
                      <YAxis
                        dataKey={xAxisKey}
                        type="category"
                        label={{
                          value: xAxisTitle,
                          angle: -90,
                          position: 'insideLeft',
                          style: { fontSize, fill: xAxisLabelColor }
                        }}
                        tick={{ fontSize, fill: xAxisTickColor }}
                        width={100}
                      />
                    )}

                    <Tooltip
                      formatter={(value) => {
                        let formattedValue = value;

                        // Apply precision
                        if (typeof value === 'number') {
                          formattedValue = value.toFixed(precision);

                          // Apply comma separator if enabled
                          if (commaSeparator) {
                            formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                          }

                          // Apply decimal separator
                          formattedValue = formattedValue.replace('.', decimalSeparator);

                          // Apply prefix and postfix
                          formattedValue = `${prefix}${formattedValue}${postfix}`;
                        }

                        return formattedValue;
                      }}
                    />

                    {showLegend && (
                      <Legend
                        verticalAlign={legendPosition}
                        layout={legendLayout}
                        wrapperStyle={{
                          backgroundColor: legendBgColor,
                          color: legendTextColor,
                          borderRadius: '4px',
                          padding: '5px',
                          marginTop: legendPosition === 'bottom' ? '20px' : '0'
                        }}
                      />
                    )}

                    {yAxisKeys.map((key, index) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={colorPalette[index % colorPalette.length]}
                        strokeWidth={lineStyles[key]?.thickness || defaultLineThickness}
                        activeDot={{
                          r: (lineStyles[key]?.dotSize || defaultDotSize) + 4,
                          fill: colorPalette[index % colorPalette.length]
                        }}
                        dot={{
                          r: lineStyles[key]?.dotSize || defaultDotSize
                        }}
                        label={showValues ? {
                          position: 'right',
                          fontSize,
                          fill: colorPalette[index % colorPalette.length]
                        } : false}
                      />
                    ))}
                  </LineChart>
                ) : (
                  <LineChart
                    data={getVisibleData()}
                    margin={{
                      top: chartTitle ? 10 : 30,
                      right: 30,
                      left: 20,
                      bottom: legendPosition === 'bottom' ? 40 : 30
                    }}
                  >
                    {(showGridX || showGridY) && (
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e0e0e0"
                        horizontal={showGridX}
                        vertical={showGridY}
                      />
                    )}

                    {showXAxis && (
                      <XAxis
                        dataKey={xAxisKey}
                        label={{
                          value: xAxisTitle,
                          position: 'bottom',
                          style: { fontSize, fill: xAxisLabelColor }
                        }}
                        tick={{ fontSize, fill: xAxisTickColor }}
                        height={50}
                      />
                    )}

                    {showYAxis && (
                      <YAxis
                        label={{
                          value: yAxisTitle,
                          angle: -90,
                          position: 'left',
                          style: { fontSize, fill: yAxisLabelColor }
                        }}
                        tick={{ fontSize, fill: yAxisTickColor }}
                        width={60}
                        domain={[
                          yAxisRange.min !== '' ? Number(yAxisRange.min) : 'auto',
                          yAxisRange.max !== '' ? Number(yAxisRange.max) : 'auto'
                        ]}
                        scale={logScale ? 'log' : 'auto'}
                      />
                    )}

                    <Tooltip
                      formatter={(value) => {
                        let formattedValue = value;

                        // Apply precision
                        if (typeof value === 'number') {
                          formattedValue = value.toFixed(precision);

                          // Apply comma separator if enabled
                          if (commaSeparator) {
                            formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                          }

                          // Apply decimal separator
                          formattedValue = formattedValue.replace('.', decimalSeparator);

                          // Apply prefix and postfix
                          formattedValue = `${prefix}${formattedValue}${postfix}`;
                        }

                        return formattedValue;
                      }}
                    />

                    {showLegend && (
                      <Legend
                        verticalAlign={legendPosition}
                        layout={legendLayout}
                        wrapperStyle={{
                          backgroundColor: legendBgColor,
                          color: legendTextColor,
                          borderRadius: '4px',
                          padding: '5px',
                          marginTop: legendPosition === 'bottom' ? '20px' : '0'
                        }}
                      />
                    )}

                    {yAxisKeys.map((key, index) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={colorPalette[index % colorPalette.length]}
                        strokeWidth={lineStyles[key]?.thickness || defaultLineThickness}
                        activeDot={{
                          r: (lineStyles[key]?.dotSize || defaultDotSize) + 4,
                          fill: colorPalette[index % colorPalette.length]
                        }}
                        dot={{
                          r: lineStyles[key]?.dotSize || defaultDotSize
                        }}
                        label={showValues ? {
                          position: 'top',
                          fontSize,
                          fill: colorPalette[index % colorPalette.length]
                        } : false}
                      />
                    ))}
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="no-data-message">No data available</div>
            )}

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
          </div>
        </div>

        {/* Customizations Panel */}
        <div className="customizations-panel">
          <div className="panel-header">
            <h2>Customizations</h2>
          </div>

          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === 'fields' ? 'active' : ''}`}
              onClick={() => setActiveTab('fields')}
            >
              Fields
            </button>
            <button
              className={`tab-btn ${activeTab === 'options' ? 'active' : ''}`}
              onClick={() => setActiveTab('options')}
            >
              Options
            </button>
            <button
              className={`tab-btn ${activeTab === 'format' ? 'active' : ''}`}
              onClick={() => setActiveTab('format')}
            >
              Format
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'fields' && (
              <div className="fields-tab">
                <div className="control-group">
                  <label>X-Axis</label>
                  <select
                    value={xAxisKey}
                    onChange={(e) => {
                      const newXKey = e.target.value;
                      setXAxisKey(newXKey);

                      // Update Y-axis keys to exclude new X-axis
                      setYAxisKeys(yAxisKeys.filter(key => key !== newXKey));
                    }}
                  >
                    {chartData.length > 0 && Object.keys(chartData[0]).map((column, index) => (
                      <option key={index} value={column}>{column}</option>
                    ))}
                  </select>
                </div>

                <div className="control-group">
                  <label>Y-Axis Series</label>
                  <div className="y-axis-list">
                    {yAxisKeys.map((key, index) => (
                      <div key={index} className="y-axis-item">
                        <div
                          className="color-box"
                          style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
                          onClick={() => toggleColorPicker(index)}
                        ></div>
                        <span>{key}</span>

                        {/* LINE STYLING - Line thickness control */}
                        <div className="line-controls">
                          <div className="line-thickness">
                            <label title="Line Thickness">
                              <span className="line-icon">━</span>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={lineStyles[key]?.thickness || defaultLineThickness}
                                onChange={(e) => updateLineThickness(key, e.target.value)}
                              />
                            </label>
                            <label title="Dot Size">
                              <span className="dot-icon">⚬</span>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                value={lineStyles[key]?.dotSize || defaultDotSize}
                                onChange={(e) => updateDotSize(key, e.target.value)}
                              />
                            </label>
                          </div>
                        </div>

                        <button
                          className="remove-y-axis"
                          onClick={() => setYAxisKeys(yAxisKeys.filter(k => k !== key))}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button className="add-y-axis" onClick={openYAxisSelector}>+ Y-Axis</button>
                  </div>
                </div>

                <div className="control-group section-title">
                  <h3>Axes & Grid</h3>
                </div>

                <div className="control-group toggle">
                  <label>Show X Axis</label>
                  <div className="toggle-slider">
                    <input
                      type="checkbox"
                      checked={showXAxis}
                      onChange={(e) => setShowXAxis(e.target.checked)}
                      id="x-axis-toggle"
                    />
                    <label htmlFor="x-axis-toggle" className="slider"></label>
                  </div>
                </div>

                <div className="control-group toggle">
                  <label>Show Y Axis</label>
                  <div className="toggle-slider">
                    <input
                      type="checkbox"
                      checked={showYAxis}
                      onChange={(e) => setShowYAxis(e.target.checked)}
                      id="y-axis-toggle"
                    />
                    <label htmlFor="y-axis-toggle" className="slider"></label>
                  </div>
                </div>

                <div className="control-group toggle">
                  <label>Show Horizontal Grid Lines</label>
                  <div className="toggle-slider">
                    <input
                      type="checkbox"
                      checked={showGridX}
                      onChange={(e) => setShowGridX(e.target.checked)}
                      id="grid-x-toggle"
                    />
                    <label htmlFor="grid-x-toggle" className="slider"></label>
                  </div>
                </div>

                <div className="control-group toggle">
                  <label>Show Vertical Grid Lines</label>
                  <div className="toggle-slider">
                    <input
                      type="checkbox"
                      checked={showGridY}
                      onChange={(e) => setShowGridY(e.target.checked)}
                      id="grid-y-toggle"
                    />
                    <label htmlFor="grid-y-toggle" className="slider"></label>
                  </div>
                </div>

                {/* LEGEND FORMATTING - Legend controls */}
                <div className="control-group section-title">
                  <h3>Legend</h3>
                </div>

                <div className="control-group toggle">
                  <label>Show Legend</label>
                  <div className="toggle-slider">
                    <input
                      type="checkbox"
                      checked={showLegend}
                      onChange={(e) => setShowLegend(e.target.checked)}
                      id="legend-toggle"
                    />
                    <label htmlFor="legend-toggle" className="slider"></label>
                  </div>
                </div>

                {showLegend && (
                  <>
                    <div className="control-group">
                      <label>Legend Position</label>
                      <select
                        value={legendPosition}
                        onChange={(e) => setLegendPosition(e.target.value)}
                      >
                        <option value="bottom">Bottom</option>
                        <option value="top">Top</option>
                      </select>
                    </div>

                    <div className="control-group">
                      <label>Legend Layout</label>
                      <select
                        value={legendLayout}
                        onChange={(e) => setLegendLayout(e.target.value)}
                      >
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                      </select>
                    </div>

                    <div className="control-group">
                      <label>Legend Background</label>
                      <input
                        type="color"
                        value={legendBgColor === 'transparent' ? '#ffffff' : legendBgColor}
                        onChange={(e) => setLegendBgColor(e.target.value)}
                      />
                      <div className="color-with-toggle">
                        <label className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={legendBgColor !== 'transparent'}
                            onChange={(e) => setLegendBgColor(e.target.checked ? '#ffffff' : 'transparent')}
                          />
                          Show background
                        </label>
                      </div>
                    </div>

                    <div className="control-group">
                      <label>Legend Text Color</label>
                      <input
                        type="color"
                        value={legendTextColor}
                        onChange={(e) => setLegendTextColor(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {colorPickerVisible && (
                  <div className="color-picker-container" ref={colorPickerRef}>
                    <div className="color-picker-header">
                      <h3>Choose Color</h3>
                      <button onClick={() => setColorPickerVisible(false)}>×</button>
                    </div>
                    <div className="color-grid">
                      {[
                        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
                        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
                        '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
                        '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
                        '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'
                      ].map((color, i) => (
                        <div
                          key={i}
                          className="color-option"
                          style={{ backgroundColor: color }}
                          onClick={() => changeColor(activeColorIndex, color)}
                        ></div>
                      ))}
                    </div>
                    <div className="custom-color">
                      <label>Custom:</label>
                      <input
                        type="color"
                        value={colorPalette[activeColorIndex] || '#000000'}
                        onChange={(e) => changeColor(activeColorIndex, e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'options' && (
              <div className="options-tab">
                <div className="control-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={chartTitle}
                    onChange={(e) => setChartTitle(e.target.value)}
                    placeholder="Graph Title"
                  />
                </div>

                <div className="control-group">
                  <label>X-axis title</label>
                  <input
                    type="text"
                    value={xAxisTitle}
                    onChange={(e) => setXAxisTitle(e.target.value)}
                    placeholder="X-axis title"
                  />
                </div>

                <div className="control-group">
                  <label>Y-axis title</label>
                  <input
                    type="text"
                    value={yAxisTitle}
                    onChange={(e) => setYAxisTitle(e.target.value)}
                    placeholder="Y-axis title"
                  />
                </div>

                {/* LABEL FORMATTING - Axis color controls */}
                <div className="control-group">
                  <label>X-axis Label Color</label>
                  <input
                    type="color"
                    value={xAxisLabelColor}
                    onChange={(e) => setXAxisLabelColor(e.target.value)}
                  />
                </div>

                <div className="control-group">
                  <label>Y-axis Label Color</label>
                  <input
                    type="color"
                    value={yAxisLabelColor}
                    onChange={(e) => setYAxisLabelColor(e.target.value)}
                  />
                </div>

                <div className="control-group">
                  <label>X-axis Tick Color</label>
                  <input
                    type="color"
                    value={xAxisTickColor}
                    onChange={(e) => setXAxisTickColor(e.target.value)}
                  />
                </div>

                <div className="control-group">
                  <label>Y-axis Tick Color</label>
                  <input
                    type="color"
                    value={yAxisTickColor}
                    onChange={(e) => setYAxisTickColor(e.target.value)}
                  />
                </div>

                <div className="control-group">
                  <label>Font Size</label>
                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    min="8"
                    max="24"
                  />
                </div>

                <div className="control-group">
                  <label>Background Color</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                </div>

                {/* LINE STYLING - Default line styling */}
                <div className="control-group section-title">
                  <h3>Default Line Style</h3>
                </div>

                <div className="control-group">
                  <label>Default Line Thickness</label>
                  <input
                    type="number"
                    value={defaultLineThickness}
                    onChange={(e) => setDefaultLineThickness(Number(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>

                <div className="control-group">
                  <label>Default Dot Size</label>
                  <input
                    type="number"
                    value={defaultDotSize}
                    onChange={(e) => setDefaultDotSize(Number(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>

                <div className="control-group toggle">
                  <label>Logarithmic Graph</label>
                  <div className="toggle-slider">
                    <input
                      type="checkbox"
                      checked={logScale}
                      onChange={(e) => setLogScale(e.target.checked)}
                      id="log-toggle"
                    />
                    <label htmlFor="log-toggle" className="slider"></label>
                  </div>
                </div>

                <div className="control-group">
                  <label>Orientation</label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                  >
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                  </select>
                </div>

                <div className="control-group toggle">
                  <label>Show values on Graph</label>
                  <div className="toggle-slider">
                    <input
                      type="checkbox"
                      checked={showValues}
                      onChange={(e) => setShowValues(e.target.checked)}
                      id="values-toggle"
                    />
                    <label htmlFor="values-toggle" className="slider"></label>
                  </div>
                </div>

                <div className="control-group">
                  <label>X-Axis Sort Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="default">default</option>
                    <option value="ascending">ascending</option>
                    <option value="descending">descending</option>
                  </select>
                </div>

                <div className="control-group range">
                  <label>Y-Axis Range</label>
                  <div className="range-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={yAxisRange.min}
                      onChange={(e) => setYAxisRange({ ...yAxisRange, min: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={yAxisRange.max}
                      onChange={(e) => setYAxisRange({ ...yAxisRange, max: e.target.value })}
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label>Axis Step Size</label>
                  <input
                    type="number"
                    value={axisStep}
                    onChange={(e) => setAxisStep(e.target.value)}
                    placeholder="Auto"
                  />
                </div>
              </div>
            )}

            {activeTab === 'format' && (
              <div className="format-tab">
                <div className="control-group toggle">
                  <label>Comma separator</label>
                  <div className="toggle-slider">
                    <input
                      type="checkbox"
                      checked={commaSeparator}
                      onChange={(e) => setCommaSeparator(e.target.checked)}
                      id="comma-toggle"
                    />
                    <label htmlFor="comma-toggle" className="slider"></label>
                  </div>
                </div>

                <div className="control-group">
                  <label>Decimal separator</label>
                  <select
                    value={decimalSeparator}
                    onChange={(e) => setDecimalSeparator(e.target.value)}
                  >
                    <option value=".">. (decimal point)</option>
                    <option value=",">, (comma)</option>
                  </select>
                </div>

                <div className="control-group">
                  <label>Precision</label>
                  <select
                    value={precision}
                    onChange={(e) => setPrecision(Number(e.target.value))}
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>

                <div className="control-group">
                  <label>Prefix</label>
                  <input
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="Prefix"
                  />
                </div>

                <div className="control-group">
                  <label>Postfix</label>
                  <input
                    type="text"
                    value={postfix}
                    onChange={(e) => setPostfix(e.target.value)}
                    placeholder="Postfix"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Y-AXIS SELECTOR - Y-axis selector modal */}
      {showYAxisSelector && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Y-Axis Series</h3>
              <button className="modal-close" onClick={() => setShowYAxisSelector(false)}>×</button>
            </div>
            <div className="modal-body">
              {availableColumns.length > 0 ? (
                <>
                  <p>Select a column to add as Y-axis:</p>
                  <div className="column-list">
                    {availableColumns.map((column, index) => (
                      <button
                        key={index}
                        className="column-button"
                        onClick={() => addYAxis(column)}
                      >
                        {column}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p>All columns are already in use.</p>
              )}
              <div className="modal-action">
                <button
                  className="add-new-column-button"
                  onClick={() => addYAxis('new')}
                >
                  Create New Column
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setShowYAxisSelector(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartInterface;