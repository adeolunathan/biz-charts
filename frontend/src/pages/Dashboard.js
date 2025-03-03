// FILE: ~/Downloads/my work/bizcharts/frontend/src/pages/Dashboard.js
// Replace everything in this file with the following code:

import React from 'react';
import LineChartComponent from '../components/LineChartComponent';
import '../styles/Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>BizCharts Platform</h1>
        <p>Create beautiful, publication-quality charts</p>
      </header>

      <main className="dashboard-content">
        <LineChartComponent />
      </main>

      <footer className="dashboard-footer">
        <p>BizCharts Platform &copy; 2025</p>
      </footer>
    </div>
  );
}

export default Dashboard;