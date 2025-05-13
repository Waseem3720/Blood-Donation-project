import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { SocketProvider } from './context/SocketContext';

const root = createRoot(document.getElementById('root'));

root.render(
  <SocketProvider>
    <App />
  </SocketProvider>
);