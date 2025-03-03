// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/common/CustomizationPanel/Format.js
import React from 'react';
import { useChartContext } from '../../../contexts/ChartContext';

/**
 * Enhanced Format panel for controlling number formatting, prefixes, and suffixes
 */
const Format = () => {
  const {
    // Format options
    formatOptions,
    updateFormatOptions,
    formatNumber,

    // Data transformation options
    transforms,
    setTransforms,

    // Sort order
    sortOrder,
    setSortOrder
  } = useChartContext();

  // Destructure format options for easier access
  const {
    precision,
    commaSeparator,
    decimalSeparator,
    prefix,
    postfix
  } = formatOptions;

  // Handle transform toggle
  const toggleTransform = (key, value) => {
    if (key === 'movingAverage') {
      setTransforms({
        ...transforms,
        movingAverage: {
          ...transforms.movingAverage,
          enabled: value
        }
      });
    } else {
      setTransforms({
        ...transforms,
        [key]: value
      });
    }
  };

  // Update moving average window
  const updateMovingAverageWindow = (window) => {
    const value = parseInt(window);
    if (!isNaN(value) && value >= 2) {
      setTransforms({
        ...transforms,
        movingAverage: {
          ...transforms.movingAverage,
          window: value
        }
      });
    }
  };

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
          placeholder="Prefix (e.g., $)"
        />
      </div>

      <div className="control-group">
        <label>Postfix</label>
        <input
          type="text"
          value={postfix}
          onChange={(e) => updateFormatOptions({ postfix: e.target.value })}
          placeholder="Postfix (e.g., %)"
        />
      </div>

      {/* Data Transformation Controls */}
      <div className="control-group section-title">
        <h3>Data Transformations</h3>
      </div>

      <div className="control-group toggle">
        <label>Normalize Data (0-1)</label>
        <div className="toggle-slider">
          <input
            type="checkbox"
            checked={transforms.normalize}
            onChange={(e) => toggleTransform('normalize', e.target.checked)}
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
            onChange={(e) => toggleTransform('cumulative', e.target.checked)}
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
            onChange={(e) => toggleTransform('percentage', e.target.checked)}
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
            onChange={(e) => toggleTransform('movingAverage', e.target.checked)}
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
            onChange={(e) => updateMovingAverageWindow(e.target.value)}
          />
        </div>
      )}

      {/* Data Sorting Controls */}
      <div className="control-group section-title">
        <h3>Data Sorting</h3>
      </div>

      <div className="control-group">
        <label>Sort Order</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Default (as entered)</option>
          <option value="ascending">Ascending (low to high)</option>
          <option value="descending">Descending (high to low)</option>
        </select>
      </div>

      {/* Value Display Format */}
      <div className="control-group section-title">
        <h3>Display Format</h3>
      </div>

      <div className="format-preview">
        <label>Example: </label>
        <span className="format-example">
          {formatNumber(1234.5678)}
        </span>
      </div>
    </div>
  );
};

export default Format;