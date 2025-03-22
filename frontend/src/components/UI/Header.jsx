import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img src="/images/logo-uniquindio.png" alt="UniQuindío Logo" className="logo-image" />
            <span className="logo-text">SIG UniQuindío</span>
          </Link>
        </div>
        
        <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link to="/systems" className="nav-link">Sistemas</Link>
            </li>
            <li className="nav-item">
              <Link to="/search" className="nav-link">Búsqueda</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;