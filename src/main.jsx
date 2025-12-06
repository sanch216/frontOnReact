import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Registration from './pages/Registration.jsx'
import { BrowserRouter } from 'react-router-dom'
import api, { pingBackend, setWithCredentials } from './api';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// expose helpers for quick debugging in browser console:
// - pingBackend() -> tries common health endpoints and base URL
// - setWithCredentials(true/false) -> toggle axios withCredentials default
// - api -> axios instance (you can call api.post('/auth/client_signup', {...}))
if (typeof window !== 'undefined') {
  window.api = api;
  window.pingBackend = pingBackend;
  window.setWithCredentials = setWithCredentials;
}
