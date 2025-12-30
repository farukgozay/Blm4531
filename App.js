// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddPlayer from './pages/AddPlayer'; // BU SATIRI EKLE
import './App.css';
import PlayerDetail from './pages/PlayerDetail';
import Login from './pages/Login';
import ShotMap from './pages/ShotMap';
import Compare from './pages/Compare';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/player/:playerId" element={<PlayerDetail />} /> 
          <Route path="/add-player" element={<AddPlayer />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/shot-map" element={<ShotMap />} />
          <Route path="/compare" element={<Compare />} />
          
          <Route path="/shot-map" element={
            <div className="container"><h1>Şut Haritası (Yakında)</h1></div>
          } />
           <Route path="/compare" element={
            <div className="container"><h1>Lig Ortalaması ile Kıyasla (Yakında)</h1></div>
          } />
        </Routes>
      </main>
    </Router>
  );
}

export default App;