// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/common/DataGrid.js
import React, { useState, useRef } from 'react';
import { useChartContext } from '../../contexts/ChartContext';
import Papa from 'papaparse';

/**
 * Enhanced DataGrid component for editing chart data (Premium UI)
 */
const DataGrid = () => {
  const {
    chartData,
    setChartData,
    xAxisKey,
    setXAxisKey,
    yAxisKeys,
    setYAxisKeys
  } = useChartContext();

  // Local state for editing
  const [activeCell, setActiveCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editingHeader, setEditingHeader] = useState(null);
  const [headerEditValue, setHeaderEditValue] = useState('');
  const fileInputRef = useRef(null);

  // Handle cell click for editing
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

  // Handle header click for column renaming
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
      // Check if column name already exists
      if (Object.keys(chartData[0]).includes(headerEditValue)) {
        alert('Column name already exists. Please choose a different name.');
        setEditingHeader(null);
        return;
      }

      // Rename the column in all data rows
      const newData = chartData.map(row => {
        const newRow = { ...row };
        newRow[headerEditValue] = newRow[editingHeader];
        delete newRow[editingHeader];
        return newRow;
      });

      setChartData(newData);

      // Update xAxisKey if the renamed column was the x-axis
      if (xAxisKey === editingHeader) {
        setXAxisKey(headerEditValue);
      }

      // Update yAxisKeys if needed
      if (yAxisKeys.includes(editingHeader)) {
        setYAxisKeys(yAxisKeys.map(key =>
          key === editingHeader ? headerEditValue : key
        ));
      }

      setEditingHeader(null);
    } else {
      setEditingHeader(null);
    }
  };

  // Add a new row
  const addRow = () => {
    if (chartData.length === 0) {
      // Add default sample data if no data exists
      setChartData([
        { date: '1', Rev: 5000, COGS: 32000, 'Gross Profit': 13000 },
        { date: '2', Rev: 47500, COGS: 33500, 'Gross Profit': 14000 },
        { date: '3', Rev: 51000, COGS: 35000, 'Gross Profit': 16000 },
        { date: '4', Rev: 49000, COGS: 34500, 'Gross Profit': 14500 },
        { date: '5', Rev: 52500, COGS: 36000, 'Gross Profit': 16500 }
      ]);
      setXAxisKey('date');
      setYAxisKeys(['Rev', 'COGS', 'Gross Profit']);
      return;
    }

    const newRow = {};
    Object.keys(chartData[0]).forEach(key => {
      newRow[key] = '';
    });

    setChartData([...chartData, newRow]);
  };

  // Add a new column
  const addColumn = () => {
    let newColumnName = 'column1';

    // Find a unique column name
    if (chartData.length > 0) {
      const columns = Object.keys(chartData[0]);
      let index = 1;

      while (columns.includes(newColumnName)) {
        index++;
        newColumnName = `column${index}`;
      }
    }

    // Add the new column to all rows
    const newData = chartData.length > 0
      ? chartData.map(row => ({ ...row, [newColumnName]: '' }))
      : [{ [newColumnName]: '' }];

    setChartData(newData);

    // If this is the first column, make it the x-axis
    if (!xAxisKey) {
      setXAxisKey(newColumnName);
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

  // Export CSV
  const exportCsv = () => {
    if (chartData.length === 0) {
      alert("No data to export.");
      return;
    }

    // Convert data to CSV format
    const csv = Papa.unparse(chartData);

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'chart_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import CSV
  const importCsv = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target.result;
        const results = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true
        });

        if (results.data && results.data.length > 0) {
          setChartData(results.data);

          // Set first column as X-axis
          const firstColumn = Object.keys(results.data[0])[0];
          setXAxisKey(firstColumn);

          // Set remaining numeric columns as Y-axis
          const columns = Object.keys(results.data[0]);
          const numericColumns = columns.filter(col =>
            typeof results.data[0][col] === 'number' && col !== firstColumn
          );

          if (numericColumns.length > 0) {
            setYAxisKeys(numericColumns);
          }
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Failed to parse CSV file. Please check the format.');
      }
    };

    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // Render sample data button for empty state
  const renderSampleData = () => {
    const sampleData = [
      { date: '1', Rev: 5000, COGS: 32000, 'Gross Profit': 13000 },
      { date: '2', Rev: 47500, COGS: 33500, 'Gross Profit': 14000 },
      { date: '3', Rev: 51000, COGS: 35000, 'Gross Profit': 16000 },
      { date: '4', Rev: 49000, COGS: 34500, 'Gross Profit': 14500 },
      { date: '5', Rev: 52500, COGS: 36000, 'Gross Profit': 16500 },
      { date: '6', Rev: 56000, COGS: 37500, 'Gross Profit': 18500 },
      { date: '7', Rev: 58000, COGS: 38000, 'Gross Profit': 20000 },
      { date: '8', Rev: 61000, COGS: 39500, 'Gross Profit': 21500 }
    ];

    setChartData(sampleData);
    setXAxisKey('date');
    setYAxisKeys(['Rev', 'COGS', 'Gross Profit']);
  };

  // Render an empty message if no data
  if (chartData.length === 0) {
    return (
      <div className="data-grid-empty">
        <p>No data available. Import a CSV file or add data manually.</p>
        <div className="data-grid-actions">
          <button onClick={addColumn}>Add Column</button>
          <button onClick={addRow}>Add Row</button>
          <button onClick={renderSampleData}>Use Sample Data</button>
          <label className="csv-import-label">
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={importCsv}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="data-grid-container">
      <div className="data-grid-actions">
        <button onClick={addRow}>
          Add Row
        </button>
        <button onClick={addColumn}>
          Add Column
        </button>
        <button onClick={exportCsv}>
          Export CSV
        </button>
        <label className="csv-import-label">
          Import CSV
          <input
            type="file"
            accept=".csv"
            onChange={importCsv}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
        </label>
      </div>

      <div className="data-grid-table-container">
        <table className="data-grid-table">
          <thead>
            <tr>
              {Object.keys(chartData[0]).map((column) => (
                <th
                  key={column}
                  className={column === xAxisKey ? 'x-axis-column' : ''}
                >
                  {editingHeader === column ? (
                    <input
                      type="text"
                      value={headerEditValue}
                      onChange={handleHeaderChange}
                      onBlur={handleHeaderBlur}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleHeaderBlur();
                        if (e.key === 'Escape') setEditingHeader(null);
                      }}
                      autoFocus
                      className="header-edit-input"
                    />
                  ) : (
                    <div className="column-header">
                      <span
                        onClick={() => handleHeaderClick(column)}
                        title="Click to rename column"
                      >
                        {column}
                      </span>
                      {column === xAxisKey && (
                        <span className="axis-indicator">(X)</span>
                      )}
                    </div>
                  )}
                </th>
              ))}
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.keys(row).map((column) => (
                  <td
                    key={`${rowIndex}-${column}`}
                    className={column === xAxisKey ? 'x-axis-column' : yAxisKeys.includes(column) ? 'y-axis-column' : ''}
                    onClick={() => handleCellClick(rowIndex, column)}
                  >
                    {activeCell &&
                     activeCell.rowIndex === rowIndex &&
                     activeCell.columnName === column ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={handleCellChange}
                        onBlur={handleCellBlur}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCellBlur();
                          if (e.key === 'Escape') setActiveCell(null);
                        }}
                        autoFocus
                        className="cell-edit-input"
                      />
                    ) : (
                      <div className="cell-content">
                        {row[column] !== undefined ? row[column] : ''}
                      </div>
                    )}
                  </td>
                ))}
                <td className="actions-column">
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
      </div>

      <div className="x-axis-selector">
        <label>X-Axis Column: </label>
        <select
          value={xAxisKey || ''}
          onChange={(e) => setXAxisKey(e.target.value)}
          className="premium-select"
        >
          {Object.keys(chartData[0]).map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DataGrid;