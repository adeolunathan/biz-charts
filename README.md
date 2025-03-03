# BizCharts

A modern, modular charting library for creating beautiful, interactive data visualizations.

## Features

- **Multiple Chart Types** - Line charts, bar charts, pie charts, and more to come
- **Interactive Data Grid** - Edit your data directly in the application
- **Customizable Options** - Extensive styling and formatting options
- **Export Capabilities** - Export as PNG, SVG, CSV, and more
- **Responsive Design** - Works on all screen sizes

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/              # Shared UI components
│   │   │   ├── DataGrid.js      # Data input component
│   │   │   ├── CustomizationPanel/
│   │   │   │   ├── index.js     # Panel collection
│   │   │   │   ├── Fields.js    # Series selection panel
│   │   │   │   ├── General.js   # General options panel
│   │   │   │   └── Format.js    # Number formatting panel  
│   │   │   ├── ExportToolbar.js # Export functionality
│   │   │   └── RangeSlider.js   # Data range filter
│   │   │
│   │   ├── charts/              # Chart-specific components
│   │   │   ├── line/            # Line chart components
│   │   │   │   ├── LineChart.js      # Line chart display
│   │   │   │   └── LineChartOptions.js # Line chart options
│   │   │   │
│   │   │   └── bar/             # Bar chart components (coming soon)
│   │   │
│   │   └── ChartInterface.js    # Main container component
│   │
│   ├── contexts/
│   │   └── ChartContext.js      # Global state management
│   │
│   ├── hooks/
│   │   ├── useChartData.js      # Data management hook
│   │   └── useChartExport.js    # Export functionality hook
│   │
│   ├── utils/
│   │   ├── exportUtils.js       # Export utility functions
│   │   └── chartRegistry.js     # Chart type registry
│   │
│   ├── styles/
│   │   └── ChartInterface.css   # Styling
│   │
│   ├── App.js                   # Application entry point
│   └── index.js                 # React entry point
```

## Adding a New Chart Type

To add a new chart type:

1. Create a new directory under `components/charts/` (e.g., `components/charts/bar/`)
2. Add the main chart component (e.g., `BarChart.js`)
3. Add chart-specific options (e.g., `BarChartOptions.js`)
4. Register the chart in `utils/chartRegistry.js`

## Getting Started for Development

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Available Scripts

In the project directory, you can run:

- `npm start` - Runs the app in development mode
- `npm test` - Runs tests
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Dependencies

- React
- Recharts
- PapaParse (CSV parsing)
- FileSaver.js
- html2canvas

## License

This project is licensed under the MIT License - see the LICENSE file for details.