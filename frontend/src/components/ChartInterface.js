// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/ChartInterface.js
import React, { useRef } from 'react';
import { useChartContext } from '../contexts/ChartContext';
import LineChart from './charts/line/LineChart';
import DataGrid from './common/DataGrid';
import '../styles/ChartInterface.css';

/**
 * ChartInterface component with DataGrid for data editing
 */
const ChartInterface = () => {
  const {
    chartTitle,
    setChartTitle,
    chartData,
    styleOptions,
    activeTab,
    setActiveTab
  } = useChartContext();

  const chartRef = useRef(null);

  return (
    <div className="chart-interface">
      <div className="interface-header">
        <div className="logo">BizCharts</div>
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
        <div className="data-panel">
          <div className="panel-header">
            <h2>Data</h2>
          </div>
          <DataGrid />
        </div>

        <div className="graph-panel">
          <div className="panel-header">
            <h2>Graph</h2>
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

        <div className="customizations-panel">
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
            {activeTab === 'fields' && (
              <div className="fields-tab">
                <div className="control-group">
                  <label>Chart Title</label>
                  <input
                    type="text"
                    value={chartTitle || ''}
                    onChange={(e) => setChartTitle(e.target.value)}
                    placeholder="Enter chart title"
                  />
                </div>
              </div>
            )}

            {activeTab === 'options' && (
              <div className="options-tab">
                <div className="control-group toggle">
                  <label>Show Points</label>
                  <div className="toggle-slider">
                    <input
                      type="checkbox"
                      checked={true}
                      id="show-points-toggle"
                      readOnly
                    />
                    <label htmlFor="show-points-toggle" className="slider"></label>
                  </div>
                </div>

                <div className="control-group toggle">
                  <label>Show Grid</label>
                  <div className="toggle-slider">
                    <input
                      type="checkbox"
                      checked={true}
                      id="show-grid-toggle"
                      readOnly
                    />
                    <label htmlFor="show-grid-toggle" className="slider"></label>
                  </div>
                </div>

                <div className="control-group toggle">
                  <label>Show Legend</label>
                  <div className="toggle-slider">
                    <input
                      type="checkbox"
                      checked={true}
                      id="show-legend-toggle"
                      readOnly
                    />
                    <label htmlFor="show-legend-toggle" className="slider"></label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'format' && (
              <div className="format-tab">
                <div className="control-group">
                  <label>Line Thickness</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    defaultValue="2"
                    className="slider-input"
                  />
                </div>

                <div className="control-group">
                  <label>Point Size</label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    defaultValue="4"
                    className="slider-input"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartInterface;