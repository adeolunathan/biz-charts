// FILE: ~/Downloads/my work/bizcharts/frontend/src/App.js
// Replace everything in this file with the following code:

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChartInterface from './components/ChartInterface';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ChartInterface />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;