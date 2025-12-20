import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Registration from './pages/Registration.jsx'
import { BrowserRouter } from 'react-router-dom'
import api from './api';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4CAF50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)

// expose api for quick debugging in browser console:
// - api -> axios instance (you can call api.post('/auth/client_signup', {...}))
if (typeof window !== 'undefined') {
  window.api = api;
}
