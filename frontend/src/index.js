// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// You might add an import for global styles here: 
// import './assets/styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);