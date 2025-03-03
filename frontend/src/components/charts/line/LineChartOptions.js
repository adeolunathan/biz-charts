// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/charts/line/LineChartOptions.js
import React, { useState } from 'react';
import { useChartContext } from '../../../contexts/ChartContext';

/**
 * Enhanced LineChartOptions component with premium UI controls
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
    curveType,
    setCurveType,
    fillArea,
    setFillArea,
    logScale,
    setLogScale,

    // Style options
    updateStyleOptions
  } = useChartContext();

  // State for color picker
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeSeriesIndex, setActiveSeriesIndex] = useState(null);

  // Update line thickness for a specific series
  const updateLineThickness = (key, thickness) => {
    setLineStyles(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        thickness: Number(thickness)
      }
    }));
  };

  // Update dot size for a specific series
  const updateDotSize = (key, size) => {
    setLineStyles(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        dotSize: Number(size)
      }
    }));
  };

  // Update color for a series at a specific index
  const updateSeriesColor = (index, color) => {
    const newPalette = [...styleOptions.colorPalette];
    newPalette[index % newPalette.length] = color;
    updateStyleOptions({ colorPalette: newPalette });
    setShowColorPicker(false);
  };

  // Toggle color picker for a series
  const toggleColorPicker = (index) => {
    setActiveSeriesIndex(index === activeSeriesIndex ? null : index);
    setShowColorPicker(!showColorPicker);
  };

  // Handle curve type change
  const handleCurveTypeChange = (e) => {
    setCurveType(e.target.value);
  };

  // Get predefined color shades for the palette
  const colorPresets = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
    '#4393c3', '#f4a582', '#92c5de', '#ca0020', '#f7f7f7'
  ];

  return (
    <div className="line-chart-options">
      <div className="control-group section-title">
        <h3>Line Chart Options</h3>
      </div>

      <div className="control-group">
        <label>Line Curve Type</label>
        <select
          value={curveType}
          onChange={handleCurveTypeChange}
          className="premium-select"
        >
          <option value="linear">Straight lines</option>
          <option value="monotone">Smooth curve</option>
          <option value="step">Step line</option>
          <option value="natural">Natural curve</option>
        </select>
      </div>

      <div className="control-group toggle">
        <label>Fill Area Under Line</label>
        <div className="toggle-slider">
          <input
            type="checkbox"
            checked={fillArea}
            onChange={(e) => setFillArea(e.target.checked)}
            id="fill-area-toggle-options"
          />
          <label htmlFor="fill-area-toggle-options" className="slider"></label>
        </div>
      </div>

      <div className="control-group toggle">
        <label>Logarithmic Y Axis</label>
        <div className="toggle-slider">
          <input
            type="checkbox"
            checked={logScale}
            onChange={(e) => setLogScale(e.target.checked)}
            id="log-scale-toggle-options"
          />
          <label htmlFor="log-scale-toggle-options" className="slider"></label>
        </div>
      </div>

      {/* Default line styling */}
      <div className="control-group section-title">
        <h3>Default Line Style</h3>
      </div>

      <div className="control-group">
        <label>Default Line Thickness: {defaultLineThickness}</label>
        <div className="slider-container">
          <input
            type="range"
            min="1"
            max="10"
            value={defaultLineThickness}
            onChange={(e) => setDefaultLineThickness(Number(e.target.value))}
            className="slider-input"
          />
          <div className="slider-value">{defaultLineThickness}</div>
        </div>
      </div>

      <div className="control-group">
        <label>Default Dot Size: {defaultDotSize}</label>
        <div className="slider-container">
          <input
            type="range"
            min="1"
            max="10"
            value={defaultDotSize}
            onChange={(e) => setDefaultDotSize(Number(e.target.value))}
            className="slider-input"
          />
          <div className="slider-value">{defaultDotSize}</div>
        </div>
      </div>

      {/* Line series styling */}
      <div className="control-group section-title">
        <h3>Series Styling</h3>
      </div>

      <div className="series-styling-container">
        {yAxisKeys.map((key, index) => {
          const color = styleOptions.colorPalette[index % styleOptions.colorPalette.length];
          const seriesStyle = lineStyles[key] || {};
          const thickness = seriesStyle.thickness || defaultLineThickness;
          const dotSize = seriesStyle.dotSize || defaultDotSize;

          return (
            <div key={index} className="series-style-card">
              <div className="series-header">
                <div
                  className="color-box large"
                  style={{ backgroundColor: color }}
                  onClick={() => toggleColorPicker(index)}
                  title="Click to change color"
                />
                <span className="series-name">{key}</span>
              </div>

              <div className="series-controls">
                <div className="control-mini-group">
                  <label>Line: {thickness}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={thickness}
                    onChange={(e) => updateLineThickness(key, e.target.value)}
                    className="slider-input"
                  />
                </div>
                <div className="control-mini-group">
                  <label>Dot: {dotSize}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={dotSize}
                    onChange={(e) => updateDotSize(key, e.target.value)}
                    className="slider-input"
                  />
                </div>
              </div>

              {/* Color picker popover */}
              {showColorPicker && activeSeriesIndex === index && (
                <div className="color-picker-popover">
                  <div className="color-picker-header">
                    <h4>Choose Color for {key}</h4>
                    <button
                      className="close-button"
                      onClick={() => setShowColorPicker(false)}
                    >
                      ×
                    </button>
                  </div>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateSeriesColor(index, e.target.value)}
                    className="color-picker-input"
                  />
                  <div className="color-picker-presets">
                    {colorPresets.map((presetColor, i) => (
                      <div
                        key={i}
                        className="color-preset"
                        style={{ backgroundColor: presetColor }}
                        onClick={() => updateSeriesColor(index, presetColor)}
                        title={presetColor}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Color palette */}
      <div className="control-group section-title">
        <h3>Color Palette</h3>
      </div>

      <div className="color-palette-container">
        {styleOptions.colorPalette.map((color, index) => (
          <div key={index} className="color-palette-item">
            <div
              className="color-box large"
              style={{ backgroundColor: color }}
              title={color}
            />
            <input
              type="color"
              value={color}
              onChange={(e) => {
                const newPalette = [...styleOptions.colorPalette];
                newPalette[index] = e.target.value;
                updateStyleOptions({ colorPalette: newPalette });
              }}
              className="color-input"
            />
          </div>
        ))}
      </div>

      {/* Reset palette button */}
      <div className="control-group">
        <button
          className="reset-palette-btn"
          onClick={() => updateStyleOptions({
            colorPalette: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
          })}
        >
          Reset Color Palette
        </button>
      </div>
    </div>
  );
};

export default LineChartOptions;