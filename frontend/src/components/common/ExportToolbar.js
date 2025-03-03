// FILE: ~/Downloads/my work/bizcharts/frontend/src/components/common/ExportToolbar.js
import React, { useState } from 'react';
import { useChartContext } from '../../contexts/ChartContext';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';

/**
 * Enhanced ExportToolbar component for chart export functionality
 */
const ExportToolbar = ({ chartRef }) => {
  const {
    chartTitle,
    chartData,
    isFullscreen,
    setIsFullscreen,
    axisOptions,
    styleOptions
  } = useChartContext();

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportInProgress, setExportInProgress] = useState(false);

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
    if (!chartRef.current || exportInProgress) return;

    try {
      setExportInProgress(true);

      // Hide UI elements that shouldn't be in the export
      const uiElements = chartRef.current.querySelectorAll('.data-grid-actions, .range-slider, .export-toolbar');
      uiElements.forEach(el => {
        el._originalDisplay = el.style.display;
        el.style.display = 'none';
      });

      // Capture chart with high resolution
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: styleOptions.bgColor || '#ffffff',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true
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
      setExportInProgress(false);
    } catch (error) {
      console.error('Error exporting PNG:', error);
      alert('Failed to export PNG. Error: ' + error.message);
      setExportInProgress(false);

      // Restore UI elements in case of error
      const uiElements = chartRef.current.querySelectorAll('.data-grid-actions, .range-slider, .export-toolbar');
      uiElements.forEach(el => {
        if (el._originalDisplay !== undefined) {
          el.style.display = el._originalDisplay;
          delete el._originalDisplay;
        }
      });
    }
  };

  // Export chart as SVG
  const exportSVG = () => {
    if (!chartRef.current || exportInProgress) return;

    try {
      setExportInProgress(true);

      // Find SVG element
      const svgElement = chartRef.current.querySelector('svg');
      if (!svgElement) {
        throw new Error('SVG element not found in chart');
      }

      // Clone the SVG
      const svgClone = svgElement.cloneNode(true);

      // Set width, height, and viewBox
      const width = svgElement.clientWidth || 800;
      const height = svgElement.clientHeight || 500;
      svgClone.setAttribute('width', width);
      svgClone.setAttribute('height', height);
      svgClone.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svgClone.setAttribute('style', `background-color: ${styleOptions.bgColor || '#ffffff'};`);

      // Add title metadata
      const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      titleElement.textContent = chartTitle || 'Chart';
      svgClone.insertBefore(titleElement, svgClone.firstChild);

      // Convert to string
      const svgString = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });

      // Create download link
      const link = document.createElement('a');
      link.download = `${chartTitle || 'chart'}.svg`;
      link.href = URL.createObjectURL(svgBlob);
      link.click();

      setShowExportMenu(false);
      setExportInProgress(false);
    } catch (error) {
      console.error('Error exporting SVG:', error);
      alert('Failed to export SVG. Error: ' + error.message);
      setExportInProgress(false);
    }
  };

  // Export data as CSV
  const exportCSV = () => {
    try {
      // Convert data to CSV format
      const csvData = Papa.unparse(chartData, {
        quotes: true, // Put quotes around all fields
        delimiter: ',', // Use commas as delimiters
        header: true // Include header row
      });

      // Create download link
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${chartTitle || 'chart_data'}.csv`;
      link.click();

      setShowExportMenu(false);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Error: ' + error.message);
    }
  };

  // Generate embed code
  const getEmbedCode = () => {
    // Create iframe embed code
    const title = (chartTitle || 'chart').replace(/\s+/g, '-').toLowerCase();
    const embedCode = `<iframe src="${window.location.origin}/embed/${title}" width="800" height="500" frameborder="0" style="border: 1px solid #ddd;"></iframe>`;

    // Copy to clipboard
    navigator.clipboard.writeText(embedCode)
      .then(() => alert('Embed code copied to clipboard!'))
      .catch(err => {
        console.error('Failed to copy embed code:', err);

        // Show the embed code in an alert if clipboard copy fails
        alert('Failed to copy embed code. Here is the code:\n\n' + embedCode);
      });

    setShowExportMenu(false);
  };

  return (
    <div className="export-toolbar">
      <button
        className="toolbar-btn fullscreen-btn"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        disabled={exportInProgress}
      >
        {isFullscreen ? "⊠" : "⊞"}
      </button>

      <div className="export-dropdown">
        <button
          className="toolbar-btn export-btn"
          onClick={() => setShowExportMenu(!showExportMenu)}
          title="Export"
          disabled={exportInProgress}
        >
          {exportInProgress ? "Exporting..." : "↓ Export"}
        </button>

        {showExportMenu && !exportInProgress && (
          <div className="export-menu">
            <button onClick={exportPNG} disabled={exportInProgress}>PNG Image</button>
            <button onClick={exportSVG} disabled={exportInProgress}>SVG Vector</button>
            <button onClick={exportCSV} disabled={exportInProgress}>CSV Data</button>
            <button onClick={getEmbedCode} disabled={exportInProgress}>Embed Code</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportToolbar;