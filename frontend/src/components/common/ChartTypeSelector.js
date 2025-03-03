// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/common/ChartTypeSelector.js
import React, { useState, useRef, useEffect } from 'react';
import { useChartContext } from '../../contexts/ChartContext';
import { getAllChartTypes } from '../../utils/chartRegistry';

/**
 * ChartTypeSelector component
 * Allows users to switch between different chart types
 */
const ChartTypeSelector = () => {
  const { chartType, setChartType } = useChartContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get all available chart types
  const chartTypes = getAllChartTypes();

  // Find the current chart type object
  const currentChartType = chartTypes.find(type => type.id === chartType) || chartTypes[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle chart type selection
  const handleChartTypeSelect = (type) => {
    setChartType(type);
    setIsOpen(false);
  };

  return (
    <div className="chart-type-selector" ref={dropdownRef}>
      <button
        className="chart-type-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Select chart type"
      >
        <span className="chart-type-icon">{currentChartType.name}</span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="chart-type-dropdown">
          {chartTypes.map((type) => (
            <div
              key={type.id}
              className={`chart-type-option ${type.id === chartType ? 'active' : ''}`}
              onClick={() => handleChartTypeSelect(type.id)}
            >
              <span className="chart-type-icon">{type.icon}</span>
              <div className="chart-type-info">
                <span className="chart-type-name">{type.name}</span>
                <span className="chart-type-desc">{type.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartTypeSelector;