import { useState } from 'react'
import './App.css'
import Header from './Components/Header'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Registration from './pages/Registration'
import Login from './pages/Login'
import Order from './pages/Order'
// import Profile from './pages/Profile'
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


        {/* <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>} /> */}


      </Routes>
    </div>
  )
}

export default App
