import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import {AppProvider} from './contexts/AppStateContext';
import './main.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
