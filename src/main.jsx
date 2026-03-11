import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AppShell from './components/AppShell';
import ErrorBoundary from './components/ErrorBoundary';
import { DataProvider } from './utils/DataContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppShell>
        <ErrorBoundary>
          <DataProvider>
            <App />
          </DataProvider>
        </ErrorBoundary>
      </AppShell>
    </BrowserRouter>
  </StrictMode>
);
