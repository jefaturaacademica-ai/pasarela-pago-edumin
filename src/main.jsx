import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Production PII & Credential Console Redaction (Ley N° 29733 Protection)
if (import.meta.env.PROD && typeof window !== 'undefined') {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const sanitize = (...args) => {
    return args.map(arg => {
      if (typeof arg === 'string') {
        return arg.replace(/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/g, '***@***.***');
      }
      return arg;
    });
  };
  console.log = (...args) => originalLog(...sanitize(...args));
  console.warn = (...args) => originalWarn(...sanitize(...args));
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
