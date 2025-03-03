
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
   - Windows: `venv\Scripts\activate`
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
