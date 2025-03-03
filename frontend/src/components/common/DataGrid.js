// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/common/DataGrid.js
import React, { useState } from 'react';
import { useChartContext } from '../../contexts/ChartContext';

/**
 * DataGrid component for editing chart data
 */
const DataGrid = () => {
  const {
    chartData,
    setChartData,
    xAxisKey,
    setXAxisKey
  } = useChartContext();

  // Local state for editing
  const [activeCell, setActiveCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editingHeader, setEditingHeader] = useState(null);
  const [headerEditValue, setHeaderEditValue] = useState('');

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

      setEditingHeader(null);
    } else {
      setEditingHeader(null);
    }
  };

  // Add a new row
  const addRow = () => {
    if (chartData.length === 0) return;

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

  // CSV import handler
  const handleCsvImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target.result;
        const rows = csvText.split('\n');

        // Get headers from the first row
        const headers = rows[0].split(',').map(header => header.trim());

        // Parse data rows
        const parsedData = [];
        for (let i = 1; i < rows.length; i++) {
          if (rows[i].trim() === '') continue;

          const values = rows[i].split(',');
          const rowData = {};

          headers.forEach((header, index) => {
            const value = values[index] ? values[index].trim() : '';
            // Try to convert to number if possible
            const numValue = parseFloat(value);
            rowData[header] = !isNaN(numValue) ? numValue : value;
          });

          parsedData.push(rowData);
        }

        if (parsedData.length > 0) {
          setChartData(parsedData);
          setXAxisKey(headers[0]);
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Failed to parse CSV file. Please check the format.');
      }
    };

    reader.readAsText(file);
  };

  // Render an empty message if no data
  if (chartData.length === 0) {
    return (
      <div className="data-grid-empty">
        <p>No data available. Import a CSV file or add data manually.</p>
        <div className="data-grid-actions">
          <button onClick={addColumn}>Add Column</button>
          <button onClick={addRow}>Add Row</button>
          <label className="csv-import-label">
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="data-grid-container">
      <div className="data-grid-actions">
        <button onClick={addRow}>Add Row</button>
        <button onClick={addColumn}>Add Column</button>
        <label className="csv-import-label">
          Import CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvImport}
            style={{ display: 'none' }}
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
                      autoFocus
                      className="header-edit-input"
                    />
                  ) : (
                    <div
                      className="column-header"
                      onClick={() => handleHeaderClick(column)}
                    >
                      {column}
                    </div>
                  )}
                </th>
              ))}
              <th className="actions-column"></th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.keys(row).map((column) => (
                  <td
                    key={`${rowIndex}-${column}`}
                    className={column === xAxisKey ? 'x-axis-column' : ''}
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