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
 * General options panel for chart title, axes and general appearance
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
    updateStyleOptions
  } = useChartContext();

  return (
    <div className="general-options-panel">
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

      {/* LABEL FORMATTING - Axis color controls */}
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

      <div className="control-group">
        <label>X-axis Tick Color</label>
        <input
          type="color"
          value={styleOptions.xAxisTickColor}
          onChange={(e) => updateStyleOptions({ xAxisTickColor: e.target.value })}
        />
      </div>

      <div className="control-group">
        <label>Y-axis Tick Color</label>
        <input
          type="color"
          value={styleOptions.yAxisTickColor}
          onChange={(e) => updateStyleOptions({ yAxisTickColor: e.target.value })}
        />
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

      <div className="control-group">
        <label>Background Color</label>
        <input
          type="color"
          value={styleOptions.bgColor}
          onChange={(e) => updateStyleOptions({ bgColor: e.target.value })}
        />
      </div>

      <div className="control-group section-title">
        <h3>Axis Range Settings</h3>
      </div>

      <div className="control-group">
        <label>X-Axis Range</label>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min"
            value={axisOptions.xRange.min}
            onChange={(e) => updateAxisOptions({
              xRange: { ...axisOptions.xRange, min: e.target.value }
            })}
          />
          <input
            type="number"
            placeholder="Max"
            value={axisOptions.xRange.max}
            onChange={(e) => updateAxisOptions({
              xRange: { ...axisOptions.xRange, max: e.target.value }
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
            type="number"
            placeholder="Min"
            value={axisOptions.yRange.min}
            onChange={(e) => updateAxisOptions({
              yRange: { ...axisOptions.yRange, min: e.target.value }
            })}
          />
          <input
            type="number"
            placeholder="Max"
            value={axisOptions.yRange.max}
            onChange={(e) => updateAxisOptions({
              yRange: { ...axisOptions.yRange, max: e.target.value }
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

      <div className="control-group toggle">
        <label>Custom Tick Formatting</label>
        <div className="toggle-slider">
          <input
            type="checkbox"
            checked={axisOptions.yTicks.tickFormatter === 'custom'}
            onChange={(e) => updateAxisOptions({
              yTicks: {
                ...axisOptions.yTicks,
                tickFormatter: e.target.checked ? 'custom' : null
              }
            })}
            id="tick-format-toggle"
          />
          <label htmlFor="tick-format-toggle" className="slider"></label>
        </div>
      </div>
    </div>
  );
};

export default General;