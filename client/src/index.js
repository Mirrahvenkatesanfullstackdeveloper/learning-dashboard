import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress MUI Grid warnings (these cause blinking)
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Filter out MUI Grid warnings
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && 
      (args[0].includes('MUI Grid') || 
       args[0].includes('item prop') ||
       args[0].includes('xs prop') ||
       args[0].includes('sm prop'))) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && 
      (args[0].includes('MUI') || 
       args[0].includes('Grid'))) {
    return;
  }
  originalConsoleWarn(...args);
};

// Import fonts
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // StrictMode removed to prevent double rendering and blinking
  <App />
);