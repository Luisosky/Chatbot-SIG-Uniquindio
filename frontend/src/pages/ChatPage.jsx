import React from 'react';
import Header from '../components/UI/Header';
import Footer from '../components/UI/Footer';
import ChatWidget from '../components/Chat/ChatWidget';
import '../styles/ChatPage.css';

const ChatPage = () => {
  // Lista simulada de sistemas para el sidebar
  const systems = [
    { id: 'siac', code: 'SIAC', name: 'Sistema Interno de Aseguramiento de la Calidad' },
    { id: 'sgsst', code: 'SGSST', name: 'Sistema de Gestión de Seguridad y Salud en el Trabajo' },
    { id: 'sga', code: 'SGA', name: 'Sistema de Gestión Ambiental' },
    { id: 'sgl', code: 'SGL', name: 'Sistema de Gestión Laboratorios' },
    { id: 'ssi', code: 'SSI', name: 'Sistema de Seguridad de la Información' }
  ];
  
  // Historial simulado de conversaciones
  const conversationHistory = [
    { date: '2025-03-20', title: 'Consulta sobre documentos SIAC' },
    { date: '2025-03-18', title: 'Búsqueda de formatos' },
    { date: '2025-03-15', title: 'Información sobre procesos' }
  ];

  return (
    <div className="chat-page">
      <Header />
      
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Sistemas</h3>
            <ul className="systems-list">
              {systems.map(system => (
                <li key={system.id} className="system-item">
                  <button className="system-button">
                    {system.code} - {system.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h3 className="sidebar-title">Conversaciones Recientes</h3>
            <ul className="history-list">
              {conversationHistory.map((conversation, index) => (
                <li key={index} className="history-item">
                  <button className="history-button">
                    <span className="history-title">{conversation.title}</span>
                    <span className="history-date">{conversation.date}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h3 className="sidebar-title">Sugerencias</h3>
            <div className="suggestions-list">
              <button className="suggestion-button">Documentos recientes</button>
              <button className="suggestion-button">Procesos SGSST</button>
              <button className="suggestion-button">Formatos disponibles</button>
            </div>
          </div>
        </div>
        
        <div className="chat-main">
          <div className="chat-header-info">
            <h2>Asistente Virtual SIG</h2>
            <p>Consulta información sobre documentos, procesos y sistemas</p>
          </div>
          
          <ChatWidget />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ChatPage;