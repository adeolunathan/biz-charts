// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/common/CustomizationPanel/General.js
import React from 'react';
import { useChartContext } from '../../../contexts/ChartContext';

// Available fonts for the font selector
const AVAILABLE_FONTS = [
  { name: 'System Default', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times New Roman', value: 'Times New Roman, Times, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { name: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
  { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
];

/**
 * Enhanced General options panel for chart title, axes and general appearance
 */
const General = () => {
  const {
    // Chart title
    chartTitle,
    setChartTitle,

    // Axis options
    axisOptions,
    updateAxisOptions,

    // Style options
    styleOptions,
    updateStyleOptions,

    // Line chart specific
    curveType,
    setCurveType,
    fillArea,
    setFillArea,
    logScale,
    setLogScale,
    orientation,
    setOrientation
  } = useChartContext();

  return (
    <div className="general-options-panel">
      <div className="control-group section-title">
        <h3>Chart Title</h3>
      </div>

      <div className="control-group">
        <label>Title</label>
        <input
          type="text"
          value={chartTitle}
          onChange={(e) => setChartTitle(e.target.value)}
          placeholder="Enter chart title"
        />
      </div>

      <div className="control-group section-title">
        <h3>Axis Titles</h3>
      </div>

      <div className="control-group">
        <label>X-axis title</label>
        <input
          type="text"
          value={axisOptions.xTitle}
          onChange={(e) => updateAxisOptions({ xTitle: e.target.value })}
          placeholder="X-axis title"
        />
      </div>

      <div className="control-group">
        <label>Y-axis title</label>
        <input
          type="text"
          value={axisOptions.yTitle}
          onChange={(e) => updateAxisOptions({ yTitle: e.target.value })}
          placeholder="Y-axis title"
        />
      </div>

      <div className="control-group section-title">
        <h3>Line Style</h3>
      </div>

      <div className="control-group">
        <label>Line Curve Type</label>
        <select
          value={curveType}
          onChange={(e) => setCurveType(e.target.value)}
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
            id="fill-area-toggle"
          />
          <label htmlFor="fill-area-toggle" className="slider"></label>
        </div>
      </div>

      <div className="control-group toggle">
        <label>Logarithmic Y Axis</label>
        <div className="toggle-slider">
          <input
            type="checkbox"
            checked={logScale}
            onChange={(e) => setLogScale(e.target.checked)}
            id="log-scale-toggle"
          />
          <label htmlFor="log-scale-toggle" className="slider"></label>
        </div>
      </div>

      <div className="control-group">
        <label>Chart Orientation</label>
        <select
          value={orientation}
          onChange={(e) => setOrientation(e.target.value)}
        >
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </div>

      <div className="control-group section-title">
        <h3>Font Style</h3>
      </div>

      {/* Font selector */}
      <div className="control-group">
        <label>Font Family</label>
        <select
          value={styleOptions.fontFamily}
          onChange={(e) => updateStyleOptions({ fontFamily: e.target.value })}
        >
          {AVAILABLE_FONTS.map((font, index) => (
            <option key={index} value={font.value} style={{ fontFamily: font.value }}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label>Font Size</label>
        <input
          type="number"
          value={styleOptions.fontSize}
          onChange={(e) => updateStyleOptions({ fontSize: Number(e.target.value) })}
          min="8"
          max="24"
        />
      </div>

      {/* LABEL FORMATTING - Axis color controls */}
      <div className="control-group section-title">
        <h3>Color Settings</h3>
      </div>

      <div className="control-group">
        <label>Background Color</label>
        <input
          type="color"
          value={styleOptions.bgColor}
          onChange={(e) => updateStyleOptions({ bgColor: e.target.value })}
        />
      </div>

      <div className="control-group">
        <label>X-axis Label Color</label>
        <input
          type="color"
          value={styleOptions.xAxisLabelColor}
          onChange={(e) => updateStyleOptions({ xAxisLabelColor: e.target.value })}
        />
      </div>

      <div className="control-group">
        <label>Y-axis Label Color</label>
        <input
          type="color"
          value={styleOptions.yAxisLabelColor}
          onChange={(e) => updateStyleOptions({ yAxisLabelColor: e.target.value })}
        />
      </div>

      <div className="control-group section-title">
        <h3>Axis Range Settings</h3>
      </div>

      <div className="control-group">
        <label>X-Axis Range</label>
        <div className="range-inputs">
          <input
            type="text"
            placeholder="Min"
            value={axisOptions.xRange.min !== null ? axisOptions.xRange.min : ''}
            onChange={(e) => updateAxisOptions({
              xRange: { ...axisOptions.xRange, min: e.target.value === '' ? null : e.target.value }
            })}
          />
          <input
            type="text"
            placeholder="Max"
            value={axisOptions.xRange.max !== null ? axisOptions.xRange.max : ''}
            onChange={(e) => updateAxisOptions({
              xRange: { ...axisOptions.xRange, max: e.target.value === '' ? null : e.target.value }
            })}
          />
        </div>
      </div>

      <div className="control-group">
        <label>X-Axis Tick Interval</label>
        <select
          value={axisOptions.xTicks.interval}
          onChange={(e) => updateAxisOptions({
            xTicks: {
              ...axisOptions.xTicks,
              interval: e.target.value === 'auto' ? 'auto' : Number(e.target.value)
            }
          })}
        >
          <option value="auto">Auto</option>
          <option value="1">Every tick</option>
          <option value="2">Every 2 ticks</option>
          <option value="5">Every 5 ticks</option>
          <option value="10">Every 10 ticks</option>
        </select>
      </div>

      <div className="control-group range">
        <label>Y-Axis Range</label>
        <div className="range-inputs">
          <input
            type="text"
            placeholder="Min"
            value={axisOptions.yRange.min !== null ? axisOptions.yRange.min : ''}
            onChange={(e) => updateAxisOptions({
              yRange: { ...axisOptions.yRange, min: e.target.value === '' ? null : Number(e.target.value) }
            })}
          />
          <input
            type="text"
            placeholder="Max"
            value={axisOptions.yRange.max !== null ? axisOptions.yRange.max : ''}
            onChange={(e) => updateAxisOptions({
              yRange: { ...axisOptions.yRange, max: e.target.value === '' ? null : Number(e.target.value) }
            })}
          />
        </div>
      </div>

      <div className="control-group">
        <label>Y-Axis Tick Interval</label>
        <select
          value={axisOptions.yTicks.interval}
          onChange={(e) => updateAxisOptions({
            yTicks: {
              ...axisOptions.yTicks,
              interval: e.target.value === 'auto' ? 'auto' : Number(e.target.value)
            }
          })}
        >
          <option value="auto">Auto</option>
          <option value="1">Every 1 unit</option>
          <option value="5">Every 5 units</option>
          <option value="10">Every 10 units</option>
          <option value="25">Every 25 units</option>
          <option value="50">Every 50 units</option>
          <option value="100">Every 100 units</option>
        </select>
      </div>
    </div>
  );
};

export default General;