// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/common/ExportToolbar.js
import React, { useState } from 'react';
import { useChartContext } from '../../contexts/ChartContext';
import html2canvas from 'html2canvas';

/**
 * ExportToolbar component for chart export functionality
 */
const ExportToolbar = ({ chartRef }) => {
  const { chartTitle, chartData, isFullscreen, setIsFullscreen } = useChartContext();
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (chartRef.current.requestFullscreen) {
        chartRef.current.requestFullscreen();
      } else if (chartRef.current.webkitRequestFullscreen) {
        chartRef.current.webkitRequestFullscreen();
      } else if (chartRef.current.msRequestFullscreen) {
        chartRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Export chart as PNG
  const exportPNG = async () => {
    try {
      if (!chartRef.current) return;

      // Hide range slider and other UI elements
      const uiElements = chartRef.current.querySelectorAll('.data-grid-actions, .range-slider');
      uiElements.forEach(el => {
        el._originalDisplay = el.style.display;
        el.style.display = 'none';
      });

      // Capture chart
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2 // Higher quality
      });

      // Restore UI elements
      uiElements.forEach(el => {
        el.style.display = el._originalDisplay || '';
        delete el._originalDisplay;
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${chartTitle || 'chart'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setShowExportMenu(false);
    } catch (error) {
      console.error('Error exporting PNG:', error);
      alert('Failed to export PNG');
    }
  };

  // Export data as CSV
  const exportCSV = () => {
    try {
      // Convert data to CSV format
      const headers = Object.keys(chartData[0]).join(',');
      const rows = chartData.map(row =>
        Object.values(row).map(value =>
          typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : String(value)
        ).join(',')
      );
      const csvContent = [headers, ...rows].join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${chartTitle || 'chart_data'}.csv`;
      link.click();

      setShowExportMenu(false);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV');
    }
  };

  // Generate embed code
  const getEmbedCode = () => {
    const embedCode = `<iframe src="${window.location.origin}/embed/${chartTitle || 'chart'}" width="800" height="500" frameborder="0"></iframe>`;

    // Copy to clipboard
    navigator.clipboard.writeText(embedCode)
      .then(() => alert('Embed code copied to clipboard!'))
      .catch(err => {
        console.error('Failed to copy embed code:', err);
        alert('Failed to copy embed code');
      });

    setShowExportMenu(false);
  };

  return (
    <div className="export-toolbar">
      <button
        className="toolbar-btn fullscreen-btn"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? "⊠" : "⊞"}
      </button>

      <div className="export-dropdown">
        <button
          className="toolbar-btn export-btn"
          onClick={() => setShowExportMenu(!showExportMenu)}
          title="Export"
        >
          ↓ Export
        </button>

        {showExportMenu && (
          <div className="export-menu">
            <button onClick={exportPNG}>PNG Image</button>
            <button onClick={exportCSV}>CSV Data</button>
            <button onClick={getEmbedCode}>Embed Code</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportToolbar;