// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/DataSpreadsheet.js
// Create this new file with the following code:

import React, { useState, useEffect } from 'react';
import '../styles/DataSpreadsheet.css';
import Papa from 'papaparse';

const DataSpreadsheet = ({ data, onDataChange }) => {
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [activeCell, setActiveCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Initialize the spreadsheet with data
  useEffect(() => {
    if (data && data.length > 0) {
      const headers = Object.keys(data[0]);
      const rows = data.map(item => ({ ...item }));
      setHeaders(headers);
      setRows(rows);
    }
  }, [data]);

  // When headers or rows change, notify parent component
  useEffect(() => {
    if (headers.length > 0 && rows.length > 0) {
      const newData = rows.map(row => {
        const newRow = {};
        headers.forEach(header => {
          newRow[header] = row[header];
        });
        return newRow;
      });
      onDataChange(newData);
    }
  }, [headers, rows, onDataChange]);

  const handleCellClick = (rowIndex, header) => {
    setActiveCell({ rowIndex, header });
    setEditValue(rows[rowIndex][header] !== undefined ? String(rows[rowIndex][header]) : '');
  };

  const handleCellChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleCellBlur = () => {
    if (activeCell) {
      const { rowIndex, header } = activeCell;
      const newRows = [...rows];

      // Try to convert to number if it looks like a number
      const numValue = parseFloat(editValue);
      const value = !isNaN(numValue) && editValue.trim() !== '' ? numValue : editValue;

      newRows[rowIndex] = { ...newRows[rowIndex], [header]: value };
      setRows(newRows);
      setActiveCell(null);
    }
  };

  const handleKeyDown = (e) => {
    if (!activeCell) return;

    if (e.key === 'Enter') {
      handleCellBlur();
      e.preventDefault();

      // Move to next row
      if (activeCell.rowIndex < rows.length - 1) {
        const newRowIndex = activeCell.rowIndex + 1;
        setActiveCell({ rowIndex: newRowIndex, header: activeCell.header });
        setEditValue(rows[newRowIndex][activeCell.header] !== undefined ?
          String(rows[newRowIndex][activeCell.header]) : '');
      }
    } else if (e.key === 'Tab') {
      handleCellBlur();
      e.preventDefault();

      // Find current header index
      const currentHeaderIndex = headers.indexOf(activeCell.header);

      if (e.shiftKey) {
        // Move to previous cell
        if (currentHeaderIndex > 0) {
          // Previous column in same row
          const newHeader = headers[currentHeaderIndex - 1];
          setActiveCell({ rowIndex: activeCell.rowIndex, header: newHeader });
          setEditValue(rows[activeCell.rowIndex][newHeader] !== undefined ?
            String(rows[activeCell.rowIndex][newHeader]) : '');
        } else if (activeCell.rowIndex > 0) {
          // Last column in previous row
          const newRowIndex = activeCell.rowIndex - 1;
          const newHeader = headers[headers.length - 1];
          setActiveCell({ rowIndex: newRowIndex, header: newHeader });
          setEditValue(rows[newRowIndex][newHeader] !== undefined ?
            String(rows[newRowIndex][newHeader]) : '');
        }
      } else {
        // Move to next cell
        if (currentHeaderIndex < headers.length - 1) {
          // Next column in same row
          const newHeader = headers[currentHeaderIndex + 1];
          setActiveCell({ rowIndex: activeCell.rowIndex, header: newHeader });
          setEditValue(rows[activeCell.rowIndex][newHeader] !== undefined ?
            String(rows[activeCell.rowIndex][newHeader]) : '');
        } else if (activeCell.rowIndex < rows.length - 1) {
          // First column in next row
          const newRowIndex = activeCell.rowIndex + 1;
          const newHeader = headers[0];
          setActiveCell({ rowIndex: newRowIndex, header: newHeader });
          setEditValue(rows[newRowIndex][newHeader] !== undefined ?
            String(rows[newRowIndex][newHeader]) : '');
        }
      }
    }
  };

  const addRow = () => {
    const newRow = {};
    headers.forEach(header => {
      newRow[header] = '';
    });
    setRows([...rows, newRow]);
  };

  const addColumn = () => {
    const newHeader = `column${headers.length + 1}`;
    setHeaders([...headers, newHeader]);

    const newRows = rows.map(row => ({
      ...row,
      [newHeader]: ''
    }));
    setRows(newRows);
  };

  const deleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const deleteColumn = (header) => {
    const newHeaders = headers.filter(h => h !== header);
    setHeaders(newHeaders);

    const newRows = rows.map(row => {
      const newRow = { ...row };
      delete newRow[header];
      return newRow;
    });
    setRows(newRows);
  };

  const renameColumn = (oldHeader, newHeader) => {
    if (newHeader && !headers.includes(newHeader)) {
      const headerIndex = headers.indexOf(oldHeader);
      const newHeaders = [...headers];
      newHeaders[headerIndex] = newHeader;
      setHeaders(newHeaders);

      const newRows = rows.map(row => {
        const newRow = { ...row };
        newRow[newHeader] = newRow[oldHeader];
        delete newRow[oldHeader];
        return newRow;
      });
      setRows(newRows);
    }
  };

  const handleColumnRename = (header) => {
    const newHeader = prompt('Enter new column name:', header);
    if (newHeader && newHeader !== header) {
      renameColumn(header, newHeader);
    }
  };

  return (
    <div className="data-spreadsheet">
      <div className="spreadsheet-toolbar">
        <button className="spreadsheet-button" onClick={addRow}>Add Row</button>
        <button className="spreadsheet-button" onClick={addColumn}>Add Column</button>
      </div>

      <div className="spreadsheet-container">
        <table className="spreadsheet-table">
          <thead>
            <tr>
              <th className="row-header">#</th>
              {headers.map((header, index) => (
                <th key={index} className="column-header">
                  <div className="header-content">
                    <span
                      className="header-text"
                      onClick={() => handleColumnRename(header)}
                      title="Click to rename"
                    >
                      {header}
                    </span>
                    <button
                      className="delete-column-btn"
                      onClick={() => deleteColumn(header)}
                      title="Delete column"
                    >
                      ×
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="row-header">
                  <div className="row-header-content">
                    <span>{rowIndex + 1}</span>
                    <button
                      className="delete-row-btn"
                      onClick={() => deleteRow(rowIndex)}
                      title="Delete row"
                    >
                      ×
                    </button>
                  </div>
                </td>
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className={`spreadsheet-cell ${activeCell && activeCell.rowIndex === rowIndex && activeCell.header === header ? 'active-cell' : ''}`}
                    onClick={() => handleCellClick(rowIndex, header)}
                  >
                    {activeCell && activeCell.rowIndex === rowIndex && activeCell.header === header ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={handleCellChange}
                        onBlur={handleCellBlur}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="cell-input"
                      />
                    ) : (
                      <div className="cell-content">{row[header] !== undefined ? row[header] : ''}</div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataSpreadsheet;