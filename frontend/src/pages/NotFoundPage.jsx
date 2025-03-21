import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/UI/Header';
import Footer from '../components/UI/Footer';
import '../styles/NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <Header />
      
      <main className="not-found-content">
        <div className="not-found-container">
          <div className="error-code">404</div>
          <h1 className="error-title">Página no encontrada</h1>
          <p className="error-message">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          
          <div className="action-buttons">
            <Link to="/" className="primary-button">Ir al Inicio</Link>
            <Link to="/chat" className="secondary-button">Consultar al Asistente</Link>
          </div>
          
          <div className="suggestions">
            <h2>Sugerencias:</h2>
            <ul>
              <li>Verifica que la URL esté correctamente escrita.</li>
              <li>Regresa a la página anterior e intenta de nuevo.</li>
              <li>Utiliza la navegación principal para encontrar lo que buscas.</li>
              <li>Consulta al asistente virtual para obtener ayuda.</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFoundPage;