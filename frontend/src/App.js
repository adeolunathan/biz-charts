// FILE: ~/Downloads/my work/bizcharts/frontend/src/App.js
import React from 'react';
import { ChartProvider } from './contexts/ChartContext';
import ChartInterface from './components/ChartInterface';
import './styles/App.css';

/**
 * Main App component with ChartProvider for global state
 */
function App() {
  return (
    <div className="App">
      <ChartProvider>
        <ChartInterface />
      </ChartProvider>
    </div>
  );
}

export default App;