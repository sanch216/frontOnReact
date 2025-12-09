import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './Components/Header'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Registration from './pages/Registration'
import Login from './pages/Login'
import Order from './pages/Order'
import ProtectedRoute from './Components/ProtectedRoutes'

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />


        <Route path='/order' element={
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>} />


      </Routes>
    </div>
  )
}

export default App
