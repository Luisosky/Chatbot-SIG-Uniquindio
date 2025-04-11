import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ChatWidget.css';
import ReactMarkdown from 'react-markdown';
import ResetButton from './ResetButton';

// Constantes extraídas para mejor mantenimiento y buenas practicas 
const API_URL = "http://localhost:5005/webhooks/rest/webhook";
const API_RESET_URL = "http://localhost:5005/api/reset";
const API_SUPPORT_URL = "http://localhost:5005/api/support-request";
const TYPING_DELAY = 500;
const WELCOME_MESSAGE = '¡Hola! Soy el asistente del Sistema Integrado de Gestión de la UniQuindío. ¿En qué puedo ayudarte hoy?';

// Componentes pequeños
const TypingIndicator = () => (
  <div className="typing-indicator">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

const MessageTime = ({ timestamp }) => (
  <span className="message-time">
    {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  </span>
);

// Nuevo componente para formularios dinámicos
const DynamicForm = ({ formType, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  // Renderizar diferentes formularios según el tipo
  if (formType === 'support') {
    return (
      <form className="dynamic-form" onSubmit={handleSubmit}>
        <h4>Solicitar asistencia técnica</h4>
        <div className="form-group">
          <label htmlFor="name">Nombre completo</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            onChange={handleChange}
            placeholder="usuario@uniquindio.edu.co"
          />
        </div>
        <div className="form-group">
          <label htmlFor="issue">Descripción del problema</label>
          <textarea 
            id="issue" 
            name="issue" 
            required 
            rows="3" 
            onChange={handleChange}
            placeholder="Describe tu consulta o problema..."
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">Enviar solicitud</button>
          <button type="button" className="cancel-btn" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    );
  }
  
  if (formType === 'email-doc') {
    return (
      <form className="dynamic-form" onSubmit={handleSubmit}>
        <h4>Enviar documento por correo</h4>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            onChange={handleChange}
            placeholder="usuario@uniquindio.edu.co"
          />
        </div>
        <div className="form-group">
          <label htmlFor="documentId">ID del documento</label>
          <input 
            type="text" 
            id="documentId" 
            name="documentId" 
            required 
            onChange={handleChange}
            placeholder="Ejemplo: SIG-MAN-001"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">Enviar</button>
          <button type="button" className="cancel-btn" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    );
  }
  
  return <div>Formulario no encontrado</div>;
};

const ChatWidget = () => {
  // Estados
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Mensaje de bienvenida
    setMessages([
      {
        id: 1,
        text: WELCOME_MESSAGE,
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    
    // Enfocar el input al inicio
    inputRef.current?.focus();
  }, []);

  // Función para reiniciar la conversación
  const handleResetConversation = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      await fetch(API_RESET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      // Reiniciar interfaz
      setMessages([{
        id: Date.now(),
        text: WELCOME_MESSAGE,
        sender: 'bot',
        timestamp: new Date()
      }]);
      
      setInputValue('');
      setActiveForm(null);
    } catch (error) {
      console.error("Error al reiniciar conversación:", error);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [isLoading]);

  // Extraer la lógica de envío a una función memoizada con useCallback
  const sendMessage = useCallback(async (text) => {
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Comandos especiales
      if (text.toLowerCase() === 'reset' || text.toLowerCase() === 'reiniciar') {
        await handleResetConversation();
        setIsTyping(false);
        setIsLoading(false);
        return;
      }
      
      // Comando para formulario de soporte
      if (text.toLowerCase().includes('contactar soporte') || 
          text.toLowerCase().includes('necesito ayuda técnica')) {
        setActiveForm('support');
        setIsTyping(false);
        setIsLoading(false);
        return;
      }
      
      // Comando para enviar documento por correo
      if (text.toLowerCase().includes('enviar documento por correo') || 
          text.toLowerCase().includes('recibir documento por email')) {
        setActiveForm('email-doc');
        setIsTyping(false);
        setIsLoading(false);
        return;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "user", 
          message: text
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();

      // Añadir un pequeño retraso para simular tiempo de pensamiento del bot
      setTimeout(() => {
        if (data.length === 0) {
          // Manejar respuestas vacías
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: "Lo siento, no encuentro una respuesta para tu consulta. ¿Podrías reformularla?",
            sender: 'bot',
            timestamp: new Date()
          }]);
        } else {
          data.forEach((botMsg) => {
            const newBotMessage = {
              id: Date.now() + Math.random(),
              text: botMsg.text,
              sender: 'bot',
              timestamp: new Date(),
              buttons: botMsg.buttons
            };
            setMessages(prev => [...prev, newBotMessage]);
          });
        }
        setIsTyping(false);
        setIsLoading(false);
      }, TYPING_DELAY);
    } catch (error) {
      console.error("Error al enviar el mensaje a la API:", error);
      // Mostrar mensaje de error al usuario
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Lo siento, tuve un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      }]);
      setIsTyping(false);
      setIsLoading(false);
    }
  }, [handleResetConversation]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    
    // Enfocar nuevamente el input
    inputRef.current?.focus();
    
    // Enviar el mensaje al backend
    sendMessage(currentInput);
  };

  // Manejar envío de formularios
  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    
    if (activeForm === 'support') {
      try {
        const response = await fetch(API_SUPPORT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: `Tu solicitud ha sido registrada con el ticket ${data.ticketId}. Un especialista se pondrá en contacto contigo pronto a través del correo ${formData.email}.`,
            sender: 'bot',
            timestamp: new Date()
          }]);
        } else {
          throw new Error(data.error || 'Error al procesar la solicitud');
        }
      } catch (error) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: `Lo siento, ocurrió un error al enviar tu solicitud: ${error.message}`,
          sender: 'bot',
          timestamp: new Date(),
          isError: true
        }]);
      }
    }
    
    if (activeForm === 'email-doc') {
      try {
        // Notificación de la solicitud al usuario
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: `Enviando documento ${formData.documentId} al correo ${formData.email}...`,
          sender: 'bot',
          timestamp: new Date()
        }]);
        
        // Crear mensaje simulado
        const userMessage = {
          id: Date.now(),
          text: `Enviar documento ${formData.documentId} al correo ${formData.email}`,
          sender: 'user',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        
        // Enviar a la API
        await sendMessage(userMessage.text);
      } catch (error) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: `Lo siento, ocurrió un error al enviar el documento: ${error.message}`,
          sender: 'bot',
          timestamp: new Date(),
          isError: true
        }]);
      }
    }
    
    setActiveForm(null);
    setIsLoading(false);
  };

  // Scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Manejar clic en botones de respuesta
  const handleButtonClick = (value) => {
    setInputValue(value);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Renderizar mensaje con soporte markdown
  const renderMessageContent = (text) => {
    return (
      <div className="message-text">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <h3>Asistente SIG UniQuindío</h3>
        <ResetButton onReset={handleResetConversation} isDisabled={isLoading} />
      </div>
      
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.sender} ${msg.isError ? 'error' : ''}`}
            aria-label={`Mensaje de ${msg.sender === 'bot' ? 'asistente' : 'usuario'}`}
          >
            <div className="message-content">
              {renderMessageContent(msg.text)}
              
              {msg.buttons && msg.buttons.length > 0 && (
                <div className="message-buttons">
                  {msg.buttons.map((btn, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleButtonClick(btn.value)}
                      className="response-button"
                    >
                      {btn.text}
                    </button>
                  ))}
                </div>
              )}
              
              <MessageTime timestamp={msg.timestamp} />
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot typing" aria-label="El asistente está escribiendo">
            <div className="message-content">
              <TypingIndicator />
            </div>
          </div>
        )}
        
        {/* Formulario dinámico */}
        {activeForm && (
          <div className="message bot form">
            <div className="message-content">
              <DynamicForm 
                formType={activeForm} 
                onSubmit={handleFormSubmit}
                onCancel={() => setActiveForm(null)}
              />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-container">
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Escribe tu mensaje..."
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          className="chat-input"
          disabled={isLoading || activeForm !== null}
          aria-label="Mensaje para el asistente"
        />
        <button 
          onClick={handleSendMessage} 
          className={`send-button ${isLoading || activeForm !== null ? 'disabled' : ''}`}
          disabled={isLoading || activeForm !== null}
          aria-label="Enviar mensaje"
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;