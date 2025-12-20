import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './index.css';
import Track from './pages/Track';
import { AuthProvider } from './contexts/AuthContext';
import Welcome from './pages/Welcome';
import Login from './pages/Login.jsx'
import App from './App.jsx';
import AddressAutocomplete from "./components/AddressAutocomplete.jsx";
import RoutePage from "./pages/RoutePage.jsx";
import {Autocomplete} from "@react-google-maps/api";


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>

    <BrowserRouter>
      <Routes>
          <Route path="/register" element={<AddressAutocomplete/>} />
        <Route path="/login" element={<RoutePage />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/track" element={<Track />} />


      </Routes>
    </BrowserRouter>
  </AuthProvider>

);