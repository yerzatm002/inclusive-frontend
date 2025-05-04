import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import { ThemeProviderCustom } from './store/ThemeContext.jsx';
import { FontProvider } from './store/FontContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProviderCustom>
    <FontProvider>
      <App />
      </FontProvider>
    </ThemeProviderCustom>
  </React.StrictMode>
);
