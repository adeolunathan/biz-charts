#!/usr/bin/env python3
"""
BizCharts Platform Setup Script
This script sets up the directory structure and installs dependencies for the BizCharts platform.
"""

import os
import subprocess
import sys
import shutil
from pathlib import Path


# Define colors for terminal output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'


def print_step(message):
    """Print a step message with formatting."""
    print(f"\n{Colors.BLUE}{Colors.BOLD}==> {message}{Colors.ENDC}")


def print_success(message):
    """Print a success message with formatting."""
    print(f"{Colors.GREEN}✓ {message}{Colors.ENDC}")


def print_error(message):
    """Print an error message with formatting."""
    print(f"{Colors.FAIL}✗ {message}{Colors.ENDC}")


def create_directory_structure():
    """Create the project directory structure."""
    print_step("Creating directory structure...")

    directories = [
        "bizcharts",
        "bizcharts/backend",
        "bizcharts/backend/api",
        "bizcharts/backend/api/routes",
        "bizcharts/backend/auth",
        "bizcharts/backend/charts",
        "bizcharts/backend/utils",
        "bizcharts/backend/static",
        "bizcharts/backend/templates",
        "bizcharts/frontend",
        "bizcharts/frontend/public",
        "bizcharts/frontend/src",
        "bizcharts/frontend/src/components",
        "bizcharts/frontend/src/assets",
        "bizcharts/frontend/src/pages",
        "bizcharts/frontend/src/utils",
        "bizcharts/frontend/src/styles",
        "bizcharts/frontend/src/contexts",
        "bizcharts/data",
        "bizcharts/tests",
    ]

    for directory in directories:
        os.makedirs(directory, exist_ok=True)

    print_success("Directory structure created successfully")


def create_backend_files():
    """Create the essential backend files."""
    print_step("Creating backend files...")

    # Main app.py file
    with open("backend/app.py", "w") as f:
        f.write("""
from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, 
            static_folder='../frontend/build/static', 
            template_folder='../frontend/build')
CORS(app)

@app.route('/api/health')
def health_check():
    return jsonify({"status": "ok"})

@app.route('/api/sample-data')
def sample_data():
    data = [
        {"date": "2023-01", "revenue": 45000, "expenses": 32000, "profit": 13000},
        {"date": "2023-02", "revenue": 47500, "expenses": 33500, "profit": 14000},
        {"date": "2023-03", "revenue": 51000, "expenses": 35000, "profit": 16000},
        {"date": "2023-04", "revenue": 49000, "expenses": 34500, "profit": 14500},
        {"date": "2023-05", "revenue": 52500, "expenses": 36000, "profit": 16500},
        {"date": "2023-06", "revenue": 56000, "expenses": 37500, "profit": 18500},
        {"date": "2023-07", "revenue": 58000, "expenses": 38000, "profit": 20000},
        {"date": "2023-08", "revenue": 61000, "expenses": 39500, "profit": 21500},
        {"date": "2023-09", "revenue": 64000, "expenses": 41000, "profit": 23000},
        {"date": "2023-10", "revenue": 67500, "expenses": 42500, "profit": 25000},
        {"date": "2023-11", "revenue": 71000, "expenses": 44000, "profit": 27000},
        {"date": "2023-12", "revenue": 75000, "expenses": 46000, "profit": 29000}
    ]
    return jsonify(data)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
""")

    # Config file
    with open("backend/config.py", "w") as f:
        f.write("""
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-please-change-in-production'

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

class TestingConfig(Config):
    TESTING = True

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
""")

    # Requirements file
    with open("requirements.txt", "w") as f:
        f.write("""
Flask==2.2.3
Flask-Cors==3.0.10
gunicorn==20.1.0
python-dotenv==1.0.0
pytest==7.3.1
requests==2.28.2
""")

    print_success("Backend files created successfully")


def create_frontend_files():
    """Create the essential frontend files."""
    print_step("Creating frontend files...")

    # package.json
    with open("frontend/package.json", "w") as f:
        f.write("""
{
  "name": "bizcharts-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.3.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.9.0",
    "react-scripts": "5.0.1",
    "recharts": "^2.5.0",
    "papaparse": "^5.4.1",
    "lodash": "^4.17.21",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.21",
    "autoprefixer": "^10.4.14",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://localhost:5000"
}
""")

    # Create App.js
    os.makedirs("frontend/src", exist_ok=True)
    with open("frontend/src/App.js", "w") as f:
        f.write("""
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
""")

    # Create index.js
    with open("frontend/src/index.js", "w") as f:
        f.write("""
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
""")

    # Create Dashboard.js
    os.makedirs("frontend/src/pages", exist_ok=True)
    with open("frontend/src/pages/Dashboard.js", "w") as f:
        f.write("""
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LineChartComponent from '../components/LineChartComponent';
import '../styles/Dashboard.css';

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/sample-data');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>BizCharts Platform</h1>
        <p>Create beautiful, publication-quality charts</p>
      </header>

      <main className="dashboard-content">
        <LineChartComponent data={data} />
      </main>
    </div>
  );
}

export default Dashboard;
""")

    # Create LineChartComponent.js
    os.makedirs("frontend/src/components", exist_ok=True)
    with open("frontend/src/components/LineChartComponent.js", "w") as f:
        f.write("""
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, Brush
} from 'recharts';
import Papa from 'papaparse';
import _ from 'lodash';
import '../styles/LineChartComponent.css';

// Theme definitions
const themes = {
  default: {
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
    backgroundColor: 'white',
    gridColor: '#e0e0e0',
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
    titleColor: '#333333',
    axisColor: '#666666'
  },
  dark: {
    colors: ['#61dafb', '#fb8c00', '#4caf50', '#e53935', '#ba68c8', '#8d6e63'],
    backgroundColor: '#282c34',
    gridColor: '#444444',
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
    titleColor: '#ffffff',
    axisColor: '#aaaaaa'
  },
  pastel: {
    colors: ['#8dd3c7', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69'],
    backgroundColor: '#f8f9fa',
    gridColor: '#e9ecef',
    fontFamily: 'Inter, sans-serif',
    fontSize: 12,
    titleColor: '#495057',
    axisColor: '#6c757d'
  }
};

const LineChartComponent = ({ data }) => {
  // State management
  const [chartData, setChartData] = useState(data || []);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [chartTitle, setChartTitle] = useState('Business Performance Over Time');
  const [xAxisLabel, setXAxisLabel] = useState('Time Period');
  const [yAxisLabel, setYAxisLabel] = useState('Value');
  const [currentTheme, setCurrentTheme] = useState('default');
  const [lineType, setLineType] = useState('monotone'); // linear, monotone, step, etc.
  const [showPoints, setShowPoints] = useState(true);
  const [csvText, setCsvText] = useState('');

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);

      // Get all keys except 'date'
      const keys = Object.keys(data[0]).filter(key => key !== 'date');
      setColumns(keys);
      setSelectedColumns(keys.slice(0, 3)); // Select first three by default

      // Convert data to CSV for display
      const csv = Papa.unparse(data);
      setCsvText(csv);
    }
  }, [data]);

  // Process CSV data
  const processData = (csvData) => {
    try {
      const result = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true, // Automatically convert numeric values
      });

      if (result.data && result.data.length > 0) {
        setChartData(result.data);

        // Get all column names except date
        const dataKeys = result.meta.fields.filter(field => field !== 'date');
        setColumns(dataKeys);

        // If no columns are currently selected or selected columns aren't in the new data,
        // select the first three columns by default
        const validSelectedColumns = selectedColumns.filter(col => dataKeys.includes(col));
        if (validSelectedColumns.length === 0) {
          setSelectedColumns(dataKeys.slice(0, Math.min(3, dataKeys.length)));
        } else {
          setSelectedColumns(validSelectedColumns);
        }
      }
    } catch (error) {
      console.error('Error parsing CSV data:', error);
    }
  };

  const handleColumnToggle = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(col => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
  };

  const handleCsvChange = (e) => {
    const newCsvText = e.target.value;
    setCsvText(newCsvText);
    processData(newCsvText);
  };

  const theme = themes[currentTheme];

  return (
    <div className="chart-container" style={{ 
      backgroundColor: theme.backgroundColor, 
      color: theme.titleColor,
      fontFamily: theme.fontFamily 
    }}>
      <div className="chart-title">{chartTitle}</div>

      {/* Chart */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} />

            <XAxis 
              dataKey="date" 
              stroke={theme.axisColor}
              label={{ value: xAxisLabel, position: 'bottom', fill: theme.axisColor }}
            />

            <YAxis 
              stroke={theme.axisColor}
              label={{ value: yAxisLabel, angle: -90, position: 'left', fill: theme.axisColor }}
            />

            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.backgroundColor,
                borderColor: theme.gridColor,
                color: theme.titleColor
              }}
            />

            <Legend />

            {selectedColumns.map((column, index) => (
              <Line
                key={column}
                type={lineType}
                dataKey={column}
                stroke={theme.colors[index % theme.colors.length]}
                activeDot={{ r: 8, fill: theme.colors[index % theme.colors.length] }}
                dot={showPoints}
                strokeWidth={2}
              />
            ))}

            <Brush 
              dataKey="date"
              height={30}
              stroke={theme.colors[0]}
              fill={theme.backgroundColor}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="controls-panel">
          <h3>Chart Settings</h3>

          <div className="control-group">
            <label>Chart Title:</label>
            <input
              type="text"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="control-group">
            <label>X-Axis Label:</label>
            <input
              type="text"
              value={xAxisLabel}
              onChange={(e) => setXAxisLabel(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="control-group">
            <label>Y-Axis Label:</label>
            <input
              type="text"
              value={yAxisLabel}
              onChange={(e) => setYAxisLabel(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="control-group">
            <label>Theme:</label>
            <select
              value={currentTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="select-field"
            >
              <option value="default">Default</option>
              <option value="dark">Dark</option>
              <option value="pastel">Pastel</option>
            </select>
          </div>

          <div className="control-group">
            <label>Line Type:</label>
            <select
              value={lineType}
              onChange={(e) => setLineType(e.target.value)}
              className="select-field"
            >
              <option value="linear">Linear</option>
              <option value="monotone">Monotone</option>
              <option value="step">Step</option>
              <option value="basis">Basis</option>
            </select>
          </div>

          <div className="control-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={showPoints}
                onChange={() => setShowPoints(!showPoints)}
              />
              Show Data Points
            </label>
          </div>
        </div>

        <div className="controls-panel">
          <h3>Data Input</h3>

          <div className="control-group">
            <label>CSV Data:</label>
            <textarea
              value={csvText}
              onChange={handleCsvChange}
              rows={6}
              className="textarea-field"
            />
          </div>

          <div className="control-group">
            <label>Data Series:</label>
            <div className="checkbox-group">
              {columns.map(column => (
                <label key={column} className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column)}
                    onChange={() => handleColumnToggle(column)}
                  />
                  {column}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="export-section">
        <h3>Export Options</h3>
        <div className="button-group">
          <button className="button button-primary">Download PNG</button>
          <button className="button button-primary">Download SVG</button>
          <button className="button button-primary">Download CSV</button>
        </div>
      </div>
    </div>
  );
};

export default LineChartComponent;
""")

    # Create CSS files
    os.makedirs("frontend/src/styles", exist_ok=True)

    with open("frontend/src/styles/index.css", "w") as f:
        f.write("""
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
""")

    with open("frontend/src/styles/App.css", "w") as f:
        f.write("""
.App {
  width: 100%;
  min-height: 100vh;
}
""")

    with open("frontend/src/styles/Dashboard.css", "w") as f:
        f.write("""
.dashboard {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.dashboard-header {
  background-color: #2c3e50;
  color: white;
  padding: 1.5rem;
  text-align: center;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 2rem;
}

.dashboard-header p {
  margin: 0.5rem 0 0;
  font-size: 1rem;
  opacity: 0.8;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.loading, .error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
}

.error {
  color: #e74c3c;
}
""")

    with open("frontend/src/styles/LineChartComponent.css", "w") as f:
        f.write("""
.chart-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.chart-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
}

.chart-wrapper {
  height: 400px;
  margin-bottom: 2rem;
}

.controls-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.controls-panel {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 1.25rem;
}

.controls-panel h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.control-group {
  margin-bottom: 1rem;
}

.control-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-field, .select-field, .textarea-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.textarea-field {
  font-family: monospace;
  resize: vertical;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.checkbox-container input {
  margin-right: 0.5rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  max-height: 150px;
  overflow-y: auto;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.export-section {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 1.25rem;
}

.export-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.button-primary {
  background-color: #3498db;
  color: white;
}

.button-primary:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  .controls-section {
    grid-template-columns: 1fr;
  }
}
""")

    # Create public index.html
    os.makedirs("frontend/public", exist_ok=True)
    with open("frontend/public/index.html", "w") as f:
        f.write("""
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="BizCharts - Create beautiful, publication-quality charts"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>BizCharts</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
""")

    # Create manifest.json
    with open("frontend/public/manifest.json", "w") as f:
        f.write("""
{
  "short_name": "BizCharts",
  "name": "BizCharts Platform",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
""")

    print_success("Frontend files created successfully")


def create_additional_files():
    """Create additional project files."""
    print_step("Creating additional project files...")

    # Create README.md
    with open("README.md", "w") as f:
        f.write("""
# BizCharts Platform

A comprehensive chart visualization platform for creating beautiful, publication-quality charts for business, science, finance, and marketing.

## Features

- Multiple chart types: line charts, bar charts, pie charts, scatter plots, and more
- Consistent design language with built-in themes
- Extensive customization options
- Flexible data handling (CSV, JSON)
- Modern web interface

## Getting Started

### Backend Setup

1. Navigate to the project root directory
2. Create a virtual environment:
   ```
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\\Scripts\\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Run the Flask development server:
   ```
   cd backend
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Project Structure

```
bizcharts/
├── backend/           # Flask backend
│   ├── api/           # API routes and controllers
│   ├── auth/          # Authentication logic
│   ├── charts/        # Chart generation logic
│   ├── utils/         # Utility functions
│   ├── app.py         # Main Flask application
│   └── config.py      # Configuration settings
├── frontend/          # React frontend
│   ├── public/        # Public assets
│   └── src/           # React source code
│       ├── components/# Reusable components
│       ├── pages/     # Page components
│       ├── utils/     # Utility functions
│       └── styles/    # CSS files
├── data/              # Sample data and assets
└── tests/             # Test suites
```

## Development Workflow

1. Run the backend server (Flask) on http://localhost:5000
2. Run the frontend dev server (React) on http://localhost:3000
3. The React dev server will proxy API requests to the Flask backend

## Deployment

For production deployment, build the React app and serve it via the Flask backend:

1. Build the React app:
   ```
   cd frontend
   npm run build
   ```
2. Run the Flask app with gunicorn:
   ```
   cd backend
   gunicorn -w 4 app:app
   ```
""")

    # Create .gitignore
    with open(".gitignore", "w") as f:
        f.write("""
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
ENV/
env/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
*.egg-info/
.installed.cfg
*.egg

# React
node_modules/
/frontend/build
/frontend/.pnp
/frontend/.pnp.js
/frontend/coverage
/frontend/.env.local
/frontend/.env.development.local
/frontend/.env.test.local
/frontend/.env.production.local
/frontend/npm-debug.log*
/frontend/yarn-debug.log*
/frontend/yarn-error.log*

# IDE
.idea/
.vscode/
*.sublime-project
*.sublime-workspace

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
""")

    print_success("Additional files created successfully")


def main():
    """Main execution function."""
    print(f"{Colors.HEADER}{Colors.BOLD}BizCharts Platform Setup{Colors.ENDC}")
    print("This script will set up the directory structure and create initial files for the BizCharts platform.")

    create_directory_structure()
    create_backend_files()
    create_frontend_files()
    create_additional_files()

    print(f"\n{Colors.GREEN}{Colors.BOLD}Setup completed successfully!{Colors.ENDC}")
    print(f"\n{Colors.BLUE}Next steps:{Colors.ENDC}")
    print("1. Navigate to the project directory:")
    print("   cd bizcharts")
    print("2. Set up Python virtual environment:")
    print("   python -m venv venv")
    print("   source venv/bin/activate  # On Windows: venv\\Scripts\\activate")
    print("   pip install -r requirements.txt")
    print("3. Start the backend server:")
    print("   cd backend")
    print("   python app.py")
    print("4. In a new terminal, set up the frontend:")
    print("   cd bizcharts/frontend")
    print("   npm install")
    print("   npm start")
    print(f"\n{Colors.BLUE}Your application will be available at:{Colors.ENDC}")
    print("- Frontend: http://localhost:3000")
    print("- Backend API: http://localhost:5000/api")


if __name__ == "__main__":
    main()