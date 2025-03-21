import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4 className="footer-title">Sistema Integrado de Gestión</h4>
          <p className="footer-description">
            Universidad del Quindío, promoviendo la calidad institucional
            a través de la gestión documental integrada.
          </p>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-title">Enlaces Rápidos</h4>
          <ul className="footer-links">
            <li><Link to="/systems">Sistemas</Link></li>
            <li><Link to="/search">Búsqueda</Link></li>
            <li><Link to="/chat">Asistente Virtual</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-title">Contacto</h4>
          <address className="footer-contact">
            <p>Universidad del Quindío</p>
            <p>Carrera 15 Calle 12 Norte</p>
            <p>Armenia, Quindío, Colombia</p>
            <p>Email: contactenos@uniquindio.edu.co</p>
          </address>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Universidad del Quindío - Todos los derechos reservados</p>
        <p>Proyecto desarrollado por estudiantes de la UniQuindío</p>
      </div>
    </footer>
  );
};

export default Footer;  