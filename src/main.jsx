/**
 * Entry point.
 * Loads global styles then boots the React tree wrapped in GameProvider.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';

import './styles/global.css';
import './styles/ui.css';

import App from './App.jsx';
import { GameProvider } from './state/GameContext.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>
);
