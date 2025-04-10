import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the root element in your index.html
const rootElement = document.getElementById('root');

// Create a root and render the main App component
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
