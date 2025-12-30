import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">ShotForge 🏀</NavLink>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Oyuncu Panosu</NavLink>
        <NavLink to="/shot-map" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Şut Haritası</NavLink>
        <NavLink to="/compare" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Kıyasla</NavLink>

        {isLoggedIn ? (
          <>
            <NavLink to="/add-player" className="nav-link special-link">Yeni Oyuncu Ekle (+)</NavLink>
            <button onClick={handleLogout} className="nav-link logout-btn">Çıkış Yap</button>
          </>
        ) : (
          <NavLink to="/login" className="nav-link login-btn">Giriş Yap</NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
