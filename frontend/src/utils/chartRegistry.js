// FILE: ~/Downloads/my work/bizcharts/frontend/src/utils/chartRegistry.js

/**
 * Chart Registry - Central registry for all chart types
 * This allows us to easily add new chart types to the application
 */

// Import the correct path for LineChart based on your directory structure
import LineChart from '../components/charts/line/LineChart';
import LineChartOptions from '../components/charts/line/LineChartOptions';

/**
 * Registry of all available chart types
 * Each entry contains:
 * - id: Unique identifier for the chart type
 * - name: Display name
 * - icon: Icon to use in UI
 * - component: The main chart component
 * - optionsComponent: The chart-specific options component
 * - description: Brief description of the chart type
 * - dataRequirements: Description of the data format needed
 * - defaultConfig: Default configuration for this chart type
 */
const chartRegistry = [
  {
    id: 'line',
    name: 'Line Chart',
    icon: '📈', // Using emoji for simplicity
    component: LineChart,
    optionsComponent: LineChartOptions,
    description: 'Visualize trends over time or category sequences',
    dataRequirements: 'At least one X-axis column and one or more Y-axis columns of numerical data',
    defaultConfig: {
      showPoints: true,
      lineThickness: 2,
      curve: 'linear',
      fillArea: false
    }
  },
  // More chart types would be added here
];

/**
 * Get a chart type by its ID
 * @param {string} id - The chart type ID
 * @returns {Object|null} - The chart type object or null if not found
 */
export const getChartTypeById = (id) => {
  return chartRegistry.find(chart => chart.id === id) || null;
};

/**
 * Get all available chart types
 * @returns {Array} - Array of all chart types
 */
export const getAllChartTypes = () => {
  return chartRegistry;
};

/**
 * Register a new chart type
 * @param {Object} chartType - The chart type to register
 */
export const registerChartType = (chartType) => {
  if (!chartType.id || !chartType.component) {
    throw new Error('Chart type must have at least an id and component property');
  }

  // Check if chart type already exists
  const existing = chartRegistry.findIndex(c => c.id === chartType.id);

  if (existing >= 0) {
    // Replace existing chart type
    chartRegistry[existing] = chartType;
  } else {
    // Add new chart type
    chartRegistry.push(chartType);
  }
};

export default chartRegistry;