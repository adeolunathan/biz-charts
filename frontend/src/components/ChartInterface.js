// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/ChartInterface.js
import React, { useRef } from 'react';
import { useChartContext } from '../contexts/ChartContext';
import LineChart from './charts/line/LineChart';
import LineChartOptions from './charts/line/LineChartOptions';
import DataGrid from './common/DataGrid';
import ExportToolbar from './common/ExportToolbar';
import CustomizationPanel from './common/CustomizationPanel';
import '../styles/ChartInterface.css';

/**
 * Enhanced ChartInterface component with premium UI
 */
const ChartInterface = () => {
  const {
    chartTitle,
    chartType,
    styleOptions,
    activeTab,
    setActiveTab
  } = useChartContext();

  const chartRef = useRef(null);

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'fields':
        return <CustomizationPanel.Fields />;
      case 'general':
        return <CustomizationPanel.General />;
      case 'format':
        return <CustomizationPanel.Format />;
      case 'options':
        return chartType === 'line' ? <LineChartOptions /> : null;
      default:
        return <CustomizationPanel.Fields />;
    }
  };

  return (
    <div className="chart-interface">
      <div className="interface-header">
        <div className="logo">
          <span className="logo-square"></span>
          BizCharts
        </div>
        <nav className="main-nav">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>

      <div className="chart-title-section">
        <h1>
          <span className="highlight">Line</span> Chart Maker
        </h1>
        <p className="subtitle">Transform Your Data into Stunning Line Graphs</p>
      </div>

      <div className="interface-content" style={{ fontFamily: styleOptions?.fontFamily }}>
        <div className="panel data-panel">
          <div className="panel-header">
            <h2>Data</h2>
          </div>
          <DataGrid />
        </div>

        <div className="panel graph-panel">
          <div className="panel-header">
            <h2>Graph</h2>
            <ExportToolbar chartRef={chartRef} />
          </div>
          <div className="chart-container" ref={chartRef}>
            {chartTitle && (
              <div className="chart-title-display">
                {chartTitle}
              </div>
            )}
            <LineChart />
          </div>
        </div>

        <div className="panel customizations-panel">
          <div className="panel-header">
            <h2>Customizations</h2>
          </div>

          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === 'fields' ? 'active' : ''}`}
              onClick={() => setActiveTab('fields')}
            >
              Fields
            </button>
            <button
              className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button
              className={`tab-btn ${activeTab === 'options' ? 'active' : ''}`}
              onClick={() => setActiveTab('options')}
            >
              Options
            </button>
            <button
              className={`tab-btn ${activeTab === 'format' ? 'active' : ''}`}
              onClick={() => setActiveTab('format')}
            >
              Format
            </button>
          </div>

          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <div className="interface-footer">
        <p>&copy; 2025 BizCharts. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ChartInterface;