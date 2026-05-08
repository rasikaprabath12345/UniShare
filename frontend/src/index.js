import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
const LOCAL_BACKEND_ORIGIN = 'http://localhost:8000';

const rewriteApiUrl = (value) => {
  if (typeof value !== 'string') return value;
  return value.startsWith(LOCAL_BACKEND_ORIGIN)
    ? value.replace(LOCAL_BACKEND_ORIGIN, API_BASE_URL)
    : value;
};

// Rewrite all axios requests that still point to localhost.
axios.interceptors.request.use((config) => {
  if (config?.url) {
    config.url = rewriteApiUrl(config.url);
  }
  return config;
});

// Rewrite all fetch requests that still point to localhost.
const originalFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  if (typeof input === 'string') {
    return originalFetch(rewriteApiUrl(input), init);
  }

  if (input instanceof Request) {
    const rewrittenRequest = new Request(rewriteApiUrl(input.url), input);
    return originalFetch(rewrittenRequest, init);
  }

  return originalFetch(input, init);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
