// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/common/CustomizationPanel/Fields.js
import React, { useState, useEffect } from 'react';
import { useChartContext } from '../../../contexts/ChartContext';

/**
 * Enhanced Fields panel for selecting X and Y axis fields and configuring basic visibility
 */
const Fields = () => {
  const {
    // Chart data
    chartData,
    xAxisKey,
    setXAxisKey,
    yAxisKeys,
    setYAxisKeys,
    availableColumns,

    // Visualization settings
    visibilityOptions,
    updateVisibilityOptions,

    // Styling
    styleOptions,
    updateStyleOptions
  } = useChartContext();

  // State for Y-axis selector modal
  const [showYAxisSelector, setShowYAxisSelector] = useState(false);
  const [selectedColumnForYAxis, setSelectedColumnForYAxis] = useState('');

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
      // Note: In a real implementation, we would use setChartData
      // but here we'll just add the new column to Y-axis keys

      setYAxisKeys([...yAxisKeys, newColumnName]);
    } else if (columnName && !yAxisKeys.includes(columnName)) {
      // Add existing column
      setYAxisKeys([...yAxisKeys, columnName]);
    }

    setShowYAxisSelector(false);
    setSelectedColumnForYAxis('');
  };

  // Remove a Y-axis series
  const removeYAxis = (key) => {
    setYAxisKeys(yAxisKeys.filter(k => k !== key));
  };

  // Get color for a Y-axis series
  const getSeriesColor = (index) => {
    return styleOptions.colorPalette[index % styleOptions.colorPalette.length];
  };

  return (
    <div className="fields-panel">
      <div className="control-group">
        <label>X-Axis</label>
        <select
          value={xAxisKey}
          onChange={(e) => {
            const newXKey = e.target.value;

            // If the new X-axis is currently a Y-axis, remove it from Y-axes
            if (yAxisKeys.includes(newXKey)) {
              setYAxisKeys(yAxisKeys.filter(key => key !== newXKey));
            }

            setXAxisKey(newXKey);
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
                style={{ backgroundColor: getSeriesColor(index) }}
              ></div>
              <span>{key}</span>

              <button
                className="remove-y-axis"
                onClick={() => removeYAxis(key)}
                title="Remove series"
              >
                ×
              </button>
            </div>
          ))}
          <button className="add-y-axis" onClick={openYAxisSelector} title="Add data series">
            + Y-Axis
          </button>
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

      <div className="control-group toggle">
        <label>Show Points on Lines</label>
        <div className="toggle-slider">
          <input
            type="checkbox"
            checked={visibilityOptions.showPoints}
            onChange={(e) => updateVisibilityOptions({ showPoints: e.target.checked })}
            id="points-toggle"
          />
          <label htmlFor="points-toggle" className="slider"></label>
        </div>
      </div>

      <div className="control-group toggle">
        <label>Show Values on Chart</label>
        <div className="toggle-slider">
          <input
            type="checkbox"
            checked={visibilityOptions.showValues}
            onChange={(e) => updateVisibilityOptions({ showValues: e.target.checked })}
            id="values-toggle"
          />
          <label htmlFor="values-toggle" className="slider"></label>
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
                  <select
                    value={selectedColumnForYAxis}
                    onChange={(e) => setSelectedColumnForYAxis(e.target.value)}
                  >
                    <option value="">-- Select Column --</option>
                    {availableColumns.map((column, index) => (
                      <option key={index} value={column}>{column}</option>
                    ))}
                  </select>
                  <div className="modal-action">
                    <button
                      className="add-column-button"
                      onClick={() => addYAxis(selectedColumnForYAxis)}
                      disabled={!selectedColumnForYAxis}
                    >
                      Add Column
                    </button>
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