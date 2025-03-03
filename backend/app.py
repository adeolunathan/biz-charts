# FILE PATH: ~/Downloads/my work/bizcharts/backend/app.py
# Replace the entire content of this file with the code below

from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS
import os

# Create Flask app with development-appropriate settings
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


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


# For development only - serve a simple page when accessing root
@app.route('/')
def dev_home():
    return """
    <html>
        <head>
            <title>BizCharts API Server</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
                h1 { color: #2c3e50; }
                .endpoint { background: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 10px; }
                .url { font-family: monospace; background: #e9ecef; padding: 3px 6px; border-radius: 3px; }
                .note { color: #6c757d; font-style: italic; }
            </style>
        </head>
        <body>
            <h1>BizCharts API Server</h1>
            <p>This is the BizCharts backend API server. In development mode, you should access the React frontend at <a href="http://localhost:3000">http://localhost:3000</a>.</p>

            <h2>Available API Endpoints:</h2>
            <div class="endpoint">
                <p><span class="url">GET /api/health</span> - Health check endpoint</p>
            </div>
            <div class="endpoint">
                <p><span class="url">GET /api/sample-data</span> - Returns sample business data</p>
            </div>

            <p class="note">Note: In production, this page would serve the compiled React frontend.</p>
        </body>
    </html>
    """


if __name__ == '__main__':
    app.run(debug=True, port=5000)