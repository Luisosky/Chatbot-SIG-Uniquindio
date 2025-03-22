import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/UI/Header';
import Footer from '../components/UI/Footer';
import SystemsOverview from '../components/Systems/SystemsOverview';
import '../styles/SystemsPage.css';
import ChatToggle from '../components/Chat/ChatToggle';

const SystemsPage = () => {
  return (
    <div className="systems-page">
      <Header />
      
      <main className="systems-content">
        <div className="systems-header">
          <h1>Sistemas Integrados de Gestión</h1>
          <p>
            Explora los diferentes sistemas de gestión de la Universidad del Quindío 
            y accede a su documentación.
          </p>
          
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Buscar sistemas..." 
              className="systems-search"
            />
            <button className="search-button">
              <span className="search-icon">🔍</span>
            </button>
          </div>
        </div>
        
        <SystemsOverview />
        
        <div className="chat-cta">
          <h2>¿Necesitas ayuda para encontrar documentos?</h2>
          <p>Nuestro asistente virtual puede ayudarte a localizar la información que necesitas.</p>
          <Link to="/chat" className="primary-button">Abrir Chat Asistente</Link>
        </div>
      </main>
      
      <Footer />
      <ChatToggle />
    </div>
  );
};

export default SystemsPage;