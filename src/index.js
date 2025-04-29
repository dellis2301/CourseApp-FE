import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter } from 'react-router-dom'; // Import HashRouter

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HashRouter> {/* Wrap the App component with HashRouter */}
      <App />
    </HashRouter>
  </React.StrictMode>
);
