import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import App from './App';
import 'semantic-ui-css/semantic.min.css'




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

