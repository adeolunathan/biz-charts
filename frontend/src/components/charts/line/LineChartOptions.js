// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/charts/line/LineChartOptions.js
import React from 'react';
import { useChartContext } from '../../../contexts/ChartContext';

/**
 * LineChartOptions component for line chart specific options
 * This component shows only options specific to line charts
 */
const LineChartOptions = () => {
  const {
    // Line specific styling
    lineStyles,
    setLineStyles,
    defaultLineThickness,
    setDefaultLineThickness,
    defaultDotSize,
    setDefaultDotSize,

    // Line chart specific options
    yAxisKeys,
    styleOptions,
    orientation,
    setOrientation,
    logScale,
    setLogScale,

    // Display options
    updateVisibilityOptions,
    visibilityOptions
  } = useChartContext();

  // Toggle color picker visibility and manage active color index
  // This would be handled by a parent component or custom hook in the actual implementation

  // LINE STYLING - Update line thickness
  const updateLineThickness = (key, thickness) => {
    setLineStyles(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        thickness: Number(thickness)
      }
    }));
  };

  // LINE STYLING - Update dot size
  const updateDotSize = (key, size) => {
    setLineStyles(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        dotSize: Number(size)
      }
    }));
  };

  return (
    <div className="line-chart-options">
      <div className="control-group section-title">
        <h3>Line Chart Options</h3>
      </div>

      {/* Line series styling */}
      <div className="control-group">
        <label>Line Series Styling</label>
        <div className="y-axis-list">
          {yAxisKeys.map((key, index) => (
            <div key={index} className="y-axis-item">
              <div
                className="color-box"
                style={{ backgroundColor: styleOptions.colorPalette[index % styleOptions.colorPalette.length] }}
                // onClick would be handled by a color picker from parent component
              />
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
            </div>
          ))}
        </div>
      </div>

      {/* Default line styling */}
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

      {/* Chart type specific options */}
      <div className="control-group toggle">
        <label>Logarithmic Y Axis</label>
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
            checked={visibilityOptions.showValues}
            onChange={(e) => updateVisibilityOptions({ showValues: e.target.checked })}
            id="values-toggle"
          />
          <label htmlFor="values-toggle" className="slider"></label>
        </div>
      </div>

      {/* Line Curve Type - A common line chart option */}
      <div className="control-group">
        <label>Line Curve Type</label>
        <select
          value="monotone" // This would be stored in context in a real implementation
          onChange={(e) => {
            // This would update a lineOptions or similar setting in the context
            console.log("Set curve type to:", e.target.value);
          }}
        >
          <option value="linear">Straight lines</option>
          <option value="monotone">Smooth curve</option>
          <option value="step">Step line</option>
          <option value="natural">Natural curve</option>
        </select>
      </div>

      {/* Fill Area - Another common line chart option */}
      <div className="control-group toggle">
        <label>Fill Area Under Line</label>
        <div className="toggle-slider">
          <input
            type="checkbox"
            checked={false} // This would be stored in context in a real implementation
            onChange={(e) => {
              // This would update a lineOptions or similar setting in the context
              console.log("Set fill area to:", e.target.checked);
            }}
            id="fill-area-toggle"
          />
          <label htmlFor="fill-area-toggle" className="slider"></label>
        </div>
      </div>
    </div>
  );
};

export default LineChartOptions;