import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/UI/Header';
import Footer from '../components/UI/Footer';
import SystemsOverview from '../components/Systems/SystemsOverview';
import ChatWidget from '../components/Chat/ChatWidget';
import PageTransition from '../components/PageTransition';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
   <PageTransition> 
    <div className="home-page">
      <Header />
      
      <main className="main-content">
        <div className="hero-section">
          <h1>Sistema Integrado de Gestión - UniQuindío</h1>
          <p>
            Consulta y accede a los documentos del Sistema Integrado de Gestión 
            mediante nuestro asistente virtual basado en inteligencia artificial.
          </p>
          <div className="cta-buttons">
            <Link to="/chat" className="primary-button">Iniciar Chat</Link>
            <Link to="/systems" className="secondary-button">Ver Sistemas</Link>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Documentación Centralizada</h3>
            <p>Accede a todos los documentos de los diferentes sistemas de gestión desde un solo lugar.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Asistente Virtual</h3>
            <p>Consulta información a través de lenguaje natural con nuestro chatbot.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Búsqueda Inteligente</h3>
            <p>Encuentra documentos específicos con nuestra tecnología de búsqueda avanzada.</p>
          </div>
        </div>

        <div className="systems-preview">
          <h2>Sistemas Disponibles</h2>
          <SystemsOverview />
        </div>
        
        <div className="chat-preview-section">
          <h2>Prueba Nuestro Asistente</h2>
          <p>Haz una pregunta rápida a nuestro asistente del SIG</p>
          <ChatWidget />
        </div>
      </main>
      
      <Footer />
    </div>
  </PageTransition>
  );
};

export default HomePage;