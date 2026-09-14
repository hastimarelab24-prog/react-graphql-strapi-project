import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // <-- Point to the generated Tailwind CSS file
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);