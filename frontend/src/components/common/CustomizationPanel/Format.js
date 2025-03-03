// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/common/CustomizationPanel/Format.js
import React from 'react';
import { useChartContext } from '../../../contexts/ChartContext';

/**
 * Format panel for controlling number formatting, prefixes, and suffixes
 */
const Format = () => {
  const {
    // Format options
    formatOptions,
    updateFormatOptions,

    // Data transformation options (if implemented)
    transforms,
    setTransforms
  } = useChartContext();

  // Destructure format options for easier access
  const {
    precision,
    commaSeparator,
    decimalSeparator,
    prefix,
    postfix
  } = formatOptions;

  return (
    <div className="format-panel">
      <div className="control-group section-title">
        <h3>Number Format</h3>
      </div>

      <div className="control-group toggle">
        <label>Comma separator</label>
        <div className="toggle-slider">
          <input
            type="checkbox"
            checked={commaSeparator}
            onChange={(e) => updateFormatOptions({ commaSeparator: e.target.checked })}
            id="comma-toggle"
          />
          <label htmlFor="comma-toggle" className="slider"></label>
        </div>
      </div>

      <div className="control-group">
        <label>Decimal separator</label>
        <select
          value={decimalSeparator}
          onChange={(e) => updateFormatOptions({ decimalSeparator: e.target.value })}
        >
          <option value=".">. (decimal point)</option>
          <option value=",">, (comma)</option>
        </select>
      </div>

      <div className="control-group">
        <label>Precision</label>
        <select
          value={precision}
          onChange={(e) => updateFormatOptions({ precision: Number(e.target.value) })}
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
          onChange={(e) => updateFormatOptions({ prefix: e.target.value })}
          placeholder="Prefix"
        />
      </div>

      <div className="control-group">
        <label>Postfix</label>
        <input
          type="text"
          value={postfix}
          onChange={(e) => updateFormatOptions({ postfix: e.target.value })}
          placeholder="Postfix"
        />
      </div>

      {/* Data Transformation Controls - if implemented */}
      {transforms && (
        <>
          <div className="control-group section-title">
            <h3>Data Transformations</h3>
          </div>

          <div className="control-group toggle">
            <label>Normalize Data (0-1)</label>
            <div className="toggle-slider">
              <input
                type="checkbox"
                checked={transforms.normalize}
                onChange={(e) => setTransforms({
                  ...transforms,
                  normalize: e.target.checked
                })}
                id="normalize-toggle"
              />
              <label htmlFor="normalize-toggle" className="slider"></label>
            </div>
          </div>

          <div className="control-group toggle">
            <label>Cumulative Values</label>
            <div className="toggle-slider">
              <input
                type="checkbox"
                checked={transforms.cumulative}
                onChange={(e) => setTransforms({
                  ...transforms,
                  cumulative: e.target.checked
                })}
                id="cumulative-toggle"
              />
              <label htmlFor="cumulative-toggle" className="slider"></label>
            </div>
          </div>

          <div className="control-group toggle">
            <label>Show as Percentage</label>
            <div className="toggle-slider">
              <input
                type="checkbox"
                checked={transforms.percentage}
                onChange={(e) => setTransforms({
                  ...transforms,
                  percentage: e.target.checked
                })}
                id="percentage-toggle"
              />
              <label htmlFor="percentage-toggle" className="slider"></label>
            </div>
          </div>

          <div className="control-group toggle">
            <label>Moving Average</label>
            <div className="toggle-slider">
              <input
                type="checkbox"
                checked={transforms.movingAverage?.enabled}
                onChange={(e) => setTransforms({
                  ...transforms,
                  movingAverage: {
                    ...transforms.movingAverage,
                    enabled: e.target.checked
                  }
                })}
                id="moving-avg-toggle"
              />
              <label htmlFor="moving-avg-toggle" className="slider"></label>
            </div>
          </div>

          {transforms.movingAverage?.enabled && (
            <div className="control-group">
              <label>Window Size</label>
              <input
                type="number"
                min="2"
                max="20"
                value={transforms.movingAverage.window}
                onChange={(e) => setTransforms({
                  ...transforms,
                  movingAverage: {
                    ...transforms.movingAverage,
                    window: Math.max(2, parseInt(e.target.value) || 2)
                  }
                })}
              />
            </div>
          )}
        </>
      )}

      {/* Value Display Format */}
      <div className="control-group section-title">
        <h3>Display Format</h3>
      </div>

      <div className="format-preview">
        <label>Example: </label>
        <span className="format-example">
          {formatExample(1234.5678, formatOptions)}
        </span>
      </div>
    </div>
  );
};

// Helper function to show formatted example
const formatExample = (value, options) => {
  const { precision, commaSeparator, decimalSeparator, prefix, postfix } = options;

  let formattedValue = value.toFixed(precision);

  // Apply comma separator if enabled
  if (commaSeparator) {
    const parts = formattedValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formattedValue = parts.join('.');
  }

  // Apply decimal separator
  formattedValue = formattedValue.replace('.', decimalSeparator);

  // Apply prefix and postfix
  return `${prefix}${formattedValue}${postfix}`;
};

export default Format;