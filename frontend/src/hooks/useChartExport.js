// FILE: ~/Downloads/my work/bizcharts/frontend/src/hooks/useChartExport.js
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

/**
 * Custom hook for chart export functionality
 * @param {Object} options - Configuration options
 * @returns {Object} - Export functions and ref
 */
const useChartExport = ({ chartTitle = 'chart', bgColor = '#ffffff' }) => {
  const chartRef = useRef(null);

  /**
   * Export chart as PNG with high resolution
   * @param {Object} options - Export options
   */
  const exportPNG = async (options = {}) => {
    if (!chartRef.current) return;

    const {
      legendPosition = 'bottom',
      xAxisTitle = '',
      showLegend = true,
      scale = 4
    } = options;

    try {
      // Hide the range slider during capture
      const rangeSlider = chartRef.current.querySelector('.range-slider-container');
      if (rangeSlider) {
        rangeSlider.style.display = 'none';
      }

      // Temporary increase bottom margin if legend is at the bottom
      const chartElement = chartRef.current.querySelector('.recharts-wrapper');
      let originalMarginBottom = null;

      if (chartElement && legendPosition === 'bottom' && showLegend) {
        originalMarginBottom = chartElement.style.marginBottom;

        // Add more spacing if x-axis title is present
        const extraMargin = xAxisTitle ? '80px' : '50px';
        chartElement.style.marginBottom = extraMargin; // Add extra space to prevent overlap
      }

      // Capture with high resolution
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: bgColor,
        scale: scale, // Higher quality
        useCORS: true,
        logging: false,
        ignoreElements: (element) => {
          // Fix for className which could be a string or DOMTokenList
          if (!element || !element.className) return false;

          const classStr = typeof element.className === 'string'
            ? element.className
            : (element.className.baseVal || '');

          // Check if element has classList and check for range-slider or scrollbar
          if (element.classList) {
            for (let i = 0; i < element.classList.length; i++) {
              const cls = element.classList[i];
              if (cls.includes('range-slider') || cls.includes('scrollbar')) {
                return true;
              }
            }
          }

          // Also check className as string
          return classStr.includes('range-slider') || classStr.includes('scrollbar');
        }
      });

      // Restore the range slider display
      if (rangeSlider) {
        rangeSlider.style.display = 'block';
      }

      // Restore original margin if modified
      if (chartElement && originalMarginBottom !== null) {
        chartElement.style.marginBottom = originalMarginBottom;
      }

      // Create and download the image
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png', 1.0);
      });

      saveAs(blob, `${chartTitle || 'chart'}.png`);
      return true;
    } catch (error) {
      console.error('PNG export error:', error);

      // Restore elements in case of error
      const rangeSlider = chartRef.current.querySelector('.range-slider-container');
      if (rangeSlider) {
        rangeSlider.style.display = 'block';
      }

      const chartElement = chartRef.current.querySelector('.recharts-wrapper');
      if (chartElement && chartElement._originalMarginBottom) {
        chartElement.style.marginBottom = chartElement._originalMarginBottom;
      }

      throw error;
    }
  };

  /**
   * Export chart as SVG
   * @param {Object} options - Export options
   */
  const exportSVG = (options = {}) => {
    if (!chartRef.current) return null;

    const {
      legendPosition = 'bottom',
      xAxisTitle = '',
      showLegend = true
    } = options;

    try {
      // Find SVG element
      const svgElement = chartRef.current.querySelector('svg');
      if (!svgElement) {
        throw new Error('SVG element not found');
      }

      // Hide the range slider during capture to prevent it from being included
      const rangeSlider = chartRef.current.querySelector('.range-slider-container');
      if (rangeSlider) {
        rangeSlider.style.display = 'none';
      }

      // Temporarily adjust bottom margin to prevent legend/title overlap
      const chartElement = chartRef.current.querySelector('.recharts-wrapper');
      let originalMarginBottom = null;

      if (chartElement && legendPosition === 'bottom' && showLegend) {
        originalMarginBottom = chartElement.style.marginBottom;
        // Add more spacing if x-axis title is present
        const extraMargin = xAxisTitle ? '80px' : '50px';
        chartElement.style.marginBottom = extraMargin;
      }

      // Clone the SVG to avoid modifying the displayed one
      const svgClone = svgElement.cloneNode(true);

      // Set width, height, and viewBox to ensure proper sizing
      const width = svgElement.clientWidth || 800;
      const height = svgElement.clientHeight || 600;

      svgClone.setAttribute('width', width);
      svgClone.setAttribute('height', height);
      svgClone.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svgClone.setAttribute('style', `background-color: ${bgColor};`);

      // Add title metadata if available
      if (chartTitle) {
        const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleElement.textContent = chartTitle;
        svgClone.insertBefore(titleElement, svgClone.firstChild);
      }

      // Convert to string, adding XML declaration
      const svgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
        new XMLSerializer().serializeToString(svgClone);

      // Create blob and download
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      saveAs(blob, `${chartTitle || 'chart'}.svg`);

      // Restore elements
      if (rangeSlider) {
        rangeSlider.style.display = 'block';
      }

      if (chartElement && originalMarginBottom !== null) {
        chartElement.style.marginBottom = originalMarginBottom;
      }

      return true;
    } catch (error) {
      console.error('SVG export error:', error);

      // Restore elements in case of error
      const rangeSlider = chartRef.current.querySelector('.range-slider-container');
      if (rangeSlider) {
        rangeSlider.style.display = 'block';
      }

      const chartElement = chartRef.current.querySelector('.recharts-wrapper');
      if (chartElement && chartElement._originalMarginBottom) {
        chartElement.style.marginBottom = chartElement._originalMarginBottom;
      }

      throw error;
    }
  };

  /**
   * Export data as CSV
   * @param {Array} data - Chart data array
   */
  const exportCSV = (data) => {
    if (!data || !data.length) {
      throw new Error('No data to export');
    }

    const csvData = Papa.unparse(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${chartTitle || 'chart_data'}.csv`);
    return true;
  };

  /**
   * Generate embed code for the chart
   * @returns {string} Embed code
   */
  const generateEmbedCode = () => {
    const title = chartTitle || 'Chart';
    return `<iframe src="${window.location.origin}/embed/${title.replace(/\s+/g, '-').toLowerCase()}" width="800" height="500" frameborder="0"></iframe>`;
  };

  /**
   * Toggle fullscreen mode
   * @param {Object} containerRef - Ref to the container element to make fullscreen
   */
  const toggleFullscreen = (containerRef) => {
    if (!containerRef || !containerRef.current) return;

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  return {
    chartRef,
    exportPNG,
    exportSVG,
    exportCSV,
    generateEmbedCode,
    toggleFullscreen
  };
};

export default useChartExport;