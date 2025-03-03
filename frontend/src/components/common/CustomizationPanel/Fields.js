// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/common/CustomizationPanel/Fields.js
import React, { useState } from 'react';
import { useChartContext } from '../../../contexts/ChartContext';

/**
 * Fields panel for selecting X and Y axis fields and configuring basic visibility
 */
const Fields = () => {
  const {
    // Chart data
    chartData,
    xAxisKey,
    setXAxisKey,
    yAxisKeys,
    setYAxisKeys,

    // Visualization settings
    visibilityOptions,
    updateVisibilityOptions,

    // Styling
    styleOptions,
    updateStyleOptions
  } = useChartContext();

  // State for Y-axis selector modal
  const [showYAxisSelector, setShowYAxisSelector] = useState(false);
  const [availableColumns, setAvailableColumns] = useState([]);

  // Calculate available columns
  React.useEffect(() => {
    if (chartData.length > 0) {
      const allColumns = Object.keys(chartData[0]);
      const usedColumns = [xAxisKey, ...yAxisKeys];
      const availableCols = allColumns.filter(col => !usedColumns.includes(col));
      setAvailableColumns(availableCols);
    }
  }, [chartData, xAxisKey, yAxisKeys]);

  // Open Y-axis selector modal
  const openYAxisSelector = () => {
    setShowYAxisSelector(true);
  };

  // Add a new Y-axis series
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

      // Update chart data
      // Note: In a real implementation, this should be done through a separate function
      // that handles all the state updates properly

      setYAxisKeys([...yAxisKeys, newColumnName]);
    } else if (columnName) {
      // Add existing column
      setYAxisKeys([...yAxisKeys, columnName]);
    }

    setShowYAxisSelector(false);
  };

  return (
    <div className="fields-panel">
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
                style={{ backgroundColor: styleOptions.colorPalette[index % styleOptions.colorPalette.length] }}
              ></div>
              <span>{key}</span>

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
            checked={visibilityOptions.showXAxis}
            onChange={(e) => updateVisibilityOptions({ showXAxis: e.target.checked })}
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
            checked={visibilityOptions.showYAxis}
            onChange={(e) => updateVisibilityOptions({ showYAxis: e.target.checked })}
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
            checked={visibilityOptions.showGridX}
            onChange={(e) => updateVisibilityOptions({ showGridX: e.target.checked })}
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
            checked={visibilityOptions.showGridY}
            onChange={(e) => updateVisibilityOptions({ showGridY: e.target.checked })}
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
            checked={visibilityOptions.showLegend}
            onChange={(e) => updateVisibilityOptions({ showLegend: e.target.checked })}
            id="legend-toggle"
          />
          <label htmlFor="legend-toggle" className="slider"></label>
        </div>
      </div>

      {visibilityOptions.showLegend && (
        <>
          <div className="control-group">
            <label>Legend Position</label>
            <select
              value={styleOptions.legendPosition}
              onChange={(e) => updateStyleOptions({ legendPosition: e.target.value })}
            >
              <option value="bottom">Bottom</option>
              <option value="top">Top</option>
            </select>
          </div>

          <div className="control-group">
            <label>Legend Layout</label>
            <select
              value={styleOptions.legendLayout}
              onChange={(e) => updateStyleOptions({ legendLayout: e.target.value })}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>

          <div className="control-group">
            <label>Legend Background</label>
            <input
              type="color"
              value={styleOptions.legendBgColor === 'transparent' ? '#ffffff' : styleOptions.legendBgColor}
              onChange={(e) => updateStyleOptions({ legendBgColor: e.target.value })}
            />
            <div className="color-with-toggle">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={styleOptions.legendBgColor !== 'transparent'}
                  onChange={(e) => updateStyleOptions({
                    legendBgColor: e.target.checked ? '#ffffff' : 'transparent'
                  })}
                />
                Show background
              </label>
            </div>
          </div>
        </>
      )}

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

export default Fields;