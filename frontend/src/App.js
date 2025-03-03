// FILE: ~/Downloads/my work/bizcharts/frontend/src/App.js
import React from 'react';
import { ChartProvider } from './contexts/ChartContext';
import ChartInterface from './components/ChartInterface';
import './styles/App.css';

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