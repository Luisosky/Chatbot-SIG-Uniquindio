import React, { useState, useEffect } from 'react';
import { MdMenu, MdClose, MdPushPin, MdOutlineClear } from 'react-icons/md';
import Header from '../components/UI/Header';
import Footer from '../components/UI/Footer';
import ChatWidget from '../components/Chat/ChatWidget';
import '../styles/ChatPage.css';

const ChatPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const systems = [
    { id: 'siac', code: 'SIAC', name: 'Sistema Interno de Aseguramiento de la Calidad' },
    { id: 'sgsst', code: 'SGSST', name: 'Sistema de Gestión de Seguridad y Salud en el Trabajo' },
    { id: 'sga', code: 'SGA', name: 'Sistema de Gestión Ambiental' },
    { id: 'sgl', code: 'SGL', name: 'Sistema de Gestión Laboratorios' },
    { id: 'ssi', code: 'SSI', name: 'Sistema de Seguridad de la Información' }
  ];

  const [conversationHistory, setConversationHistory] = useState([
    { id: 1, date: '2025-03-20', title: 'Consulta sobre documentos SIAC' },
    { id: 2, date: '2025-03-18', title: 'Búsqueda de formatos' },
    { id: 3, date: '2025-03-15', title: 'Información sobre procesos' }
  ]);
  
  const [pinnedConversations, setPinnedConversations] = useState(() => {
    const savedPinned = localStorage.getItem('pinnedConversations');
    return savedPinned ? JSON.parse(savedPinned) : [];
  });

  useEffect(() => {
    localStorage.setItem('pinnedConversations', JSON.stringify(pinnedConversations));
  }, [pinnedConversations]);

  const pinConversation = (conversation) => {
    setPinnedConversations(prev => {
      const isPinned = prev.some(item => item.id === conversation.id);
      return isPinned ? prev.filter(item => item.id !== conversation.id) : [...prev, conversation];
    });
  };

 
  const removePinnedConversation = (id) => {
    setPinnedConversations(prev => prev.filter(item => item.id !== id));
  };

  
  const clearHistory = () => {
    setConversationHistory([]);
  };

  return (
    <div className="chat-page">
      <Header />
      <div className="chat-container">
        <button className={`global-sidebar-toggle-button ${sidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}>
          {sidebarOpen ? <MdClose /> : <MdMenu />}
        </button>

        <aside className={`chat-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-section">
            <h3 className="sidebar-title">Sistemas</h3>
            <ul className="systems-list">
              {systems.map(system => (
                <li key={system.id} className="system-item">
                  <button className="system-button">{system.code} - {system.name}</button>
                </li>
              ))}
            </ul>
          </div>

          {pinnedConversations.length > 0 && (
            <div className="sidebar-section">
              <h3 className="sidebar-title">Conversaciones Fijadas</h3>
              <ul className="history-list">
                {pinnedConversations.map(conversation => (
                  <li key={conversation.id} className="history-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button className="history-button" onClick={() => pinConversation(conversation)}>
                      <span className="history-title">{conversation.title}</span>
                      <span className="history-date">{conversation.date}</span>
                      <MdPushPin style={{ marginLeft: '5px', color: 'var(--uniquindio-green)' }} />
                    </button>
                    <button 
                      className="delete-pinned-button" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        removePinnedConversation(conversation.id);
                      }} 
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                      title="Eliminar fijo"
                    >
                      <MdClose size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="sidebar-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="sidebar-title">Conversaciones Recientes</h3>
              <button onClick={clearHistory} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--uniquindio-green)' }} title="Limpiar historial">
                <MdOutlineClear size={20} />
              </button>
            </div>
            <ul className="history-list">
              {conversationHistory.map(conversation => (
                <li key={conversation.id} className="history-item">
                  <button className="history-button" onClick={() => pinConversation(conversation)}>
                    <span className="history-title">{conversation.title}</span>
                    <span className="history-date">{conversation.date}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

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
